import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const maxDuration = 60; // Max allowed by Vercel Hobby

export async function POST(req: NextRequest) {
  try {
    const { images, context } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "Missing or invalid images array." }, { status: 400 });
    }

    // Initialize Gemini Flash Model since it supports image inputs
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: "You are an expert waste classification and recycling assistant. Your job is to analyze images of waste items, identify them, classify them correctly, and provide detailed, actionable disposal steps. You MUST respond with valid JSON strictly adhering to the schema: { items: string[], classification: 'Compostable' | 'Recyclable' | 'Hazardous' | 'Landfill', steps: string[], suggestion: string }.",
    });

    const parts = images.map((base64Image: string) => {
      // Extract mime type and base64 data using regex matching
      const matches = base64Image.match(/^data:(image\/\w+);base64,(.*)$/);
      let mimeType = "image/jpeg";
      let base64Data = base64Image;

      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      } else {
        base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
      }

      return {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };
    });

    const promptText = `Please analyze the provided image(s) to classify the waste.` + (context ? ` Additional context from user: ${context}` : "");

    const result = await model.generateContent([promptText, ...parts]);
    const responseText = result.response.text();

    try {
      const parsedData = JSON.parse(responseText);
      return NextResponse.json({ result: parsedData }, { status: 200 });
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", responseText);
      return NextResponse.json({ error: "Received invalid data structure from AI." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process the request." }, { status: 500 });
  }
}
