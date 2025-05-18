// app/api/predict/route.ts

import { NextRequest } from "next/server";

const FLASK_API_URL = process.env.BACKEND_API_URL
  ? `${process.env.BACKEND_API_URL}/predict`
  : "http://localhost:5000/predict"; // Provide a default fallback

export async function POST(request: NextRequest): Promise<Response> {
  if (!FLASK_API_URL) {
    return new Response(
      JSON.stringify({ error: "Flask API URL not configured." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    
    console.log("Sending request to Flask API:", FLASK_API_URL);
    console.log("Request body:", JSON.stringify(body));

    const response = await fetch(FLASK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    // Log the response status
    console.log("Flask API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Flask backend error:", errorText);
      
      // Return a properly formatted error response
      return new Response(
        JSON.stringify({ 
          error: "Flask API error", 
          details: errorText,
          status: response.status 
        }),
        { 
          status: 500, // Always use 500 for API errors to prevent 502 in Next.js
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Prediction error:", error);
    
    // Improved error handling with more details
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch prediction", 
        details: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}
