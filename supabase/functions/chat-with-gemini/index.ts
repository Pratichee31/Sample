import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, generateImage } = await req.json();
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    if (generateImage) {
      // Use Pollinations AI for free image generation
      try {
        const imagePrompt = encodeURIComponent(message);
        const imageUrl = `https://image.pollinations.ai/prompt/${imagePrompt}?width=512&height=512&nologo=true`;
        
        // Test if the image URL is accessible
        const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
        
        if (imageResponse.ok) {
          return new Response(JSON.stringify({ 
            response: `I've generated an image based on your prompt: "${message}"`,
            imageUrl: imageUrl
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          throw new Error('Image generation failed');
        }
      } catch (error) {
        console.error('Image generation error:', error);
        // Fallback to a placeholder with better styling
        return new Response(JSON.stringify({ 
          response: `I couldn't generate an image at the moment, but here's a visual placeholder for your prompt: "${message}"`,
          imageUrl: `https://via.placeholder.com/512x512/6366f1/ffffff?text=${encodeURIComponent(message.slice(0, 30))}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Use Gemini for text generation
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: message
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response.";

      return new Response(JSON.stringify({ response: aiResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});