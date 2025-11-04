import { GoogleGenAI, FunctionDeclaration, Type, Chat } from "@google/genai";

// Per Gemini API guidelines, the API key MUST be obtained from the environment `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- AI Trip Planner with Function Calling ---

const searchHotelsFunctionDeclaration: FunctionDeclaration = {
  name: 'searchHotels',
  parameters: {
    type: Type.OBJECT,
    description: 'Performs a hotel search based on user criteria.',
    properties: {
      city: {
        type: Type.STRING,
        description: 'The destination city. Must be one of: barcelona, madrid, palma, istanbul.',
      },
      checkin: {
        type: Type.STRING,
        description: 'The check-in date in YYYY-MM-DD format.',
      },
      checkout: {
        type: Type.STRING,
        description: 'The check-out date in YYYY-MM-DD format.',
      },
      guests: {
        type: Type.INTEGER,
        description: 'The number of guests.',
      },
    },
    required: ['city', 'checkin', 'checkout', 'guests'],
  },
};


export const createAIPlannerChat = (languageName: string): Chat => {
  const systemInstruction = `You are a proactive and friendly travel planner for MyBavul.com.
Your goal is to help the user plan their trip by gathering necessary information and then using the searchHotels tool.
1.  Start by asking the user what kind of trip they're looking for.
2.  Engage in a natural conversation to determine the destination city, check-in date, check-out date, and number of guests.
3.  You MUST ask clarifying questions one by one until you have all the required information. For example, if the user says "next month", ask for specific dates.
4.  Once you have all four parameters (city, checkin, checkout, guests), you MUST call the searchHotels function with the collected data.
5.  IMPORTANT: Your entire conversation MUST be in ${languageName}. Do not use any other language.`;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [searchHotelsFunctionDeclaration] }],
    },
  });
};

export const createAIAssistantChat = (hotelName: string, city: string, languageName: string): Chat => {
    const systemInstruction = `You are a friendly, enthusiastic, and knowledgeable travel assistant for MyBavul.com.
        A user is staying at the "${hotelName}" in ${city}.
        Your goal is to have a helpful conversation about the local area.
        Answer questions about things to do, see, or eat nearby. Keep your answers concise but informative.
        IMPORTANT: You MUST reply entirely in ${languageName}.
        Your entire response must be in ${languageName}. Do not use any other language.`;

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};
