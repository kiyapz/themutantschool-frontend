import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get the authorization token from the request headers
    const authHeader = request.headers.get("authorization");

    // Forward the request to the external backend
    const backendUrl =
      "https://themutantschool-backend.onrender.com/api/student/dashboard";

    const headers = {
      "Content-Type": "application/json",
    };

    // Include authorization header if present
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: headers,
    });

    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error proxying to backend:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch student dashboard data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
