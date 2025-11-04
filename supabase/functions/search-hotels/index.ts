// FIX: Using a specific version for the Deno edge runtime types to resolve loading errors.
/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Self-contained types to ensure function deploys correctly without external dependencies.
interface RatePlan {
  id: string;
  created_at: string;
  room_type_id: string;
  name: string;
  refundable: boolean;
  cancellation_policy: string;
  price_per_night_usd_minor: number;
  cancellation_deadline_hours: number;
  rateType: 'BOOKABLE' | 'RECHECK';
  rateCommentsId?: string;
  rateComments?: string;
  cancellationPolicies?: {
      amount: string;
      from: string;
  }[];
}
interface RoomType {
  id: string;
  created_at: string;
  property_id: string;
  name: string;
  capacity: number;
  photos: string[];
  rate_plans?: RatePlan[];
}
interface Property {
  id: string;
  created_at: string;
  title: string;
  description: string;
  location_city: string;
  location_country: string;
  latitude: number;
  longitude: number;
  photos: string[];
  star_rating: number;
  review_count: number;
  review_score: number;
  tenant_id: string;
  room_types?: RoomType[];
}


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Map user-friendly city names to the required Hotelbeds destination codes.
const cityToDestinationCode: { [key: string]: string } = {
  'barcelona': 'BCN',
  'madrid': 'MAD',
  'palma': 'PMI',
  'istanbul': 'IST',
};

// Add mock coordinates for cities to enable map view functionality.
const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'BCN': { lat: 41.3851, lng: 2.1734 },
    'MAD': { lat: 40.4168, lng: -3.7038 },
    'PMI': { lat: 39.5696, lng: 2.6502 },
    'IST': { lat: 41.0082, lng: 28.9784 },
};


// Function to generate the Hotelbeds X-Signature
async function createHotelbedsSignature(apiKey: string, secret: string): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000);
    const dataToSign = `${apiKey}${secret}${timestamp}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(dataToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// Function to map Hotelbeds API response to our Property type
function mapHotelbedsToProperty(hotel: any): Property {
  const starRating = parseInt(hotel.categoryName?.match(/\d/)?.[0] || '3', 10);
  
  const mockDescription = `Enjoy a wonderful stay at ${hotel.name.content}, located in the heart of ${hotel.city.content}. This ${starRating}-star hotel offers great amenities and easy access to local attractions.`;
  const minRate = parseFloat(hotel.minRate);
  const nonRefundablePrice = Math.round(minRate * 0.9 * 100); // 10% cheaper
  const refundablePrice = Math.round(minRate * 100);

  const cancellationDeadline = new Date();
  cancellationDeadline.setDate(cancellationDeadline.getDate() + 14);

  // Get base coordinates for the city and add a small random offset.
  const baseCoords = cityCoordinates[hotel.destinationCode] || { lat: 0, lng: 0 };
  const latitude = baseCoords.lat + (Math.random() - 0.5) * 0.05; // ~5.5 km radius
  const longitude = baseCoords.lng + (Math.random() - 0.5) * 0.05;


  return {
    id: hotel.code.toString(),
    created_at: new Date().toISOString(),
    title: hotel.name.content,
    description: mockDescription,
    location_city: hotel.city.content,
    location_country: hotel.countryCode,
    latitude,
    longitude,
    photos: [
        `https://picsum.photos/seed/${hotel.code}/800/600`,
        `https://picsum.photos/seed/${hotel.code + 1}/800/600`,
        `https://picsum.photos/seed/${hotel.code + 2}/800/600`,
        `https://picsum.photos/seed/${hotel.code + 3}/800/600`,
        `https://picsum.photos/seed/${hotel.code + 4}/800/600`,
    ],
    star_rating: isNaN(starRating) ? 3 : starRating,
    review_count: Math.floor(Math.random() * 200) + 10,
    review_score: parseFloat(((Math.random() * 1.5) + 8.0).toFixed(1)), // Mocked score: 8.0-9.5
    tenant_id: 'd41d8cd9-8f00-4e2a-a259-07548b26b3c4', // A default tenant for now
    room_types: [
        {
            id: `${hotel.code}-standard`,
            created_at: new Date().toISOString(),
            property_id: hotel.code.toString(),
            name: 'Standard Room',
            capacity: 2,
            photos: [`https://picsum.photos/seed/${hotel.code}-room/800/600`],
            rate_plans: [
                {
                    id: `${hotel.code}-standard-refundable`,
                    created_at: new Date().toISOString(),
                    room_type_id: `${hotel.code}-standard`,
                    name: 'Free Cancellation',
                    refundable: true,
                    cancellation_policy: 'Flexible rate with free cancellation options. Please check the policy for deadlines.',
                    price_per_night_usd_minor: refundablePrice,
                    cancellation_deadline_hours: 24,
                    rateType: 'BOOKABLE',
                    rateComments: 'Breakfast can be added at the property for an additional fee.',
                    cancellationPolicies: [{
                        amount: (minRate * 0.5).toFixed(2), // 50% fee
                        from: cancellationDeadline.toISOString(),
                    }]
                },
                {
                    id: `${hotel.code}-standard-nonrefundable`,
                    created_at: new Date().toISOString(),
                    room_type_id: `${hotel.code}-standard`,
                    name: 'Non-Refundable',
                    refundable: false,
                    cancellation_policy: 'This rate is non-refundable. No changes or cancellations are allowed.',
                    price_per_night_usd_minor: nonRefundablePrice,
                    cancellation_deadline_hours: 0,
                    rateType: 'BOOKABLE',
                    rateComments: 'This is a special discounted rate with no flexibility. Payment is taken at the time of booking.',
                    cancellationPolicies: []
                }
            ]
        }
    ]
  };
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { city, checkin, checkout, guests } = await req.json();
    
    if (!city || !checkin || !checkout || !guests) {
      return new Response(JSON.stringify({ error: 'Missing search parameters.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    const destinationCode = cityToDestinationCode[city.toLowerCase()];
    if (!destinationCode) {
      console.warn(`No destination code found for city: ${city}. Returning empty results.`);
      return new Response(JSON.stringify({ properties: [] }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const HOTELBEDS_API_KEY = Deno.env.get('HOTELBEDS_API_KEY');
    const HOTELBEDS_SECRET = Deno.env.get('HOTELBEDS_SECRET');

    if (!HOTELBEDS_API_KEY || !HOTELBEDS_SECRET) {
        throw new Error("Hotelbeds API credentials are not configured in server environment.");
    }
    
    const signature = await createHotelbedsSignature(HOTELBEDS_API_KEY, HOTELBEDS_SECRET);
    const hotelbedsApiUrl = 'https://api.test.hotelbeds.com/hotel-api/1.0/hotels';

    const requestBody = {
      stay: {
        checkIn: checkin,
        checkOut: checkout,
      },
      occupancies: [
        {
          rooms: 1,
          adults: guests,
          children: 0,
        },
      ],
      destination: {
        code: destinationCode,
      },
      filter: {
        maxHotels: 20
      }
    };

    const response = await fetch(hotelbedsApiUrl, {
      method: 'POST',
      headers: {
        'Api-key': HOTELBEDS_API_KEY,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip'
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Hotelbeds API Error:", errorBody);
        throw new Error(`Failed to fetch from Hotelbeds API: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
       console.error("Hotelbeds API returned an error:", data.error);
       return new Response(JSON.stringify({ properties: [] }), {
         status: 200,
         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
       });
    }

    const properties: Property[] = (data.hotels?.hotels || [])
      .filter((hotel: any) => hotel.minRate && !isNaN(parseFloat(hotel.minRate)))
      .map(mapHotelbedsToProperty);

    return new Response(JSON.stringify({ properties }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in search-hotels function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})