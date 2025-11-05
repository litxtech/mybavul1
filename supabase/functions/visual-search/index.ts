

// FIX: Using npm specifier for Supabase functions types to ensure stable Deno environment type resolution.
/// <reference types="npm:@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.4'
import { GoogleGenAI } from 'https://esm.sh/@google/genai@0.12.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image, mimeType } = await req.json();
    if (!image || !mimeType) {
        return new Response(JSON.stringify({ error: 'Missing image data or mimeType' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // 1. Get image description from Gemini
    const apiKey = Deno.env.get('API_KEY');
    if (!apiKey) throw new Error("Gemini API key is not configured.");
    
    const ai = new GoogleGenAI({ apiKey });
    
    const imagePart = {
        inlineData: { data: image, mimeType }
    };

    const textPart = {
        text: "Describe this hotel or room's visual style in 5-10 keywords suitable for a database search. Focus on ambiance, materials, and key features. Example: modern, minimalist, concrete, wood, scenic view, infinity pool"
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] }
    });

    const description = response.text;
    if (!description) {
        throw new Error("Could not generate a description from the image.");
    }
    
    // 2. Search for properties in Supabase using the description
    const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Clean up keywords from Gemini response
    const keywords = description.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    if (keywords.length === 0) {
        throw new Error("Could not extract keywords from Gemini response.");
    }
    
    // Build an 'OR' query for full-text search on the description column
    const orQuery = keywords.map(kw => `description.ilike.%${kw}%`).join(',');

    const { data: properties, error: dbError } = await supabaseAdmin
        .from('properties')
        .select('*, room_types(*, rate_plans(*))')
        .or(orQuery)
        .limit(10);
        
    if (dbError) throw dbError;

    return new Response(JSON.stringify({ properties: properties || [], keywords }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in visual-search function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})