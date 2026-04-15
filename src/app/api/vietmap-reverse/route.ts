import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY as string;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "lat and lng parameters are required" },
        { status: 400 }
      );
    }

    const vietmapUrl = new URL("https://maps.vietmap.vn/api/reverse/v3");
    vietmapUrl.searchParams.append("apikey", API_KEY);
    vietmapUrl.searchParams.append("lat", lat);
    vietmapUrl.searchParams.append("lng", lng);

    const response = await fetch(vietmapUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Vietmap Reverse API error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Vietmap Reverse API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Return the first result if available
    return NextResponse.json(data[0] || data);
  } catch (error) {
    console.error("Reverse API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reverse geocoding results" },
      { status: 500 }
    );
  }
}
