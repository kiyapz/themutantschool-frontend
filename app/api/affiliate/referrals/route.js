import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    const backendUrl =
      "https://themutantschool-backend.onrender.com/api/affiliate/referrals";

    const headers = {
      "Content-Type": "application/json",
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: headers,
    });

    const data = await response.json();

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
        message: "Failed to fetch affiliate referrals data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}










