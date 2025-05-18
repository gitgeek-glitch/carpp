// app/api/predict/route.ts

import { NextRequest } from "next/server";

const FLASK_API_URL = process.env.BACKEND_API_URL
  ? `${process.env.BACKEND_API_URL}/predict`
  : "http://localhost:5000/predict"; // Provide a default fallback

// Increase timeout to 60 seconds to accommodate slower model loading
const TIMEOUT_MS = 600000;

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

    // Extract model type for conditional timeout
    const modelType = body.modelType || "linear-regression";
    
    // Determine appropriate timeout based on model complexity
    // More complex models get longer timeouts
    let timeoutValue = TIMEOUT_MS;
    if (["random-forest", "gradient-boosting", "xgboost"].includes(modelType)) {
      timeoutValue = 90000; // 90 seconds for complex models
    }

    console.log(`Using timeout of ${timeoutValue}ms for model: ${modelType}`);

    const response = await fetch(FLASK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      // Use the conditionally set timeout
      signal: AbortSignal.timeout(timeoutValue),
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
    
    // Improved error handling with more details and user-friendly timeout message
    let errorMessage = "Unknown error";
    let errorDetails = {};
    
    if (error instanceof Error) {
      // Check specifically for timeout errors
      if ('name' in error && error.name === 'TimeoutError' || error.message.includes('timeout')) {
        errorMessage = "The prediction request timed out";
        errorDetails = {
          suggestion: "Try again with a simpler model like Linear Regression or Ridge Regression",
          reason: "Complex models may take longer to load and make predictions"
        };
      } else {
        errorMessage = error.message;
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        details: errorDetails,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}