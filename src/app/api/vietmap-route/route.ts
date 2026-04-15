import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY as string;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const points = searchParams.getAll("point");
    const vehicle = searchParams.get("vehicle") || "car";
    const capacity = searchParams.get("capacity");
    const points_encoded = searchParams.get("points_encoded") || "true";
    const annotations = searchParams.get("annotations");

    if (points.length < 2) {
      return NextResponse.json(
        { error: "At least two points (origin and destination) are required" },
        { status: 400 }
      );
    }



    const vietmapUrl = new URL("https://maps.vietmap.vn/api/route/v3");
    vietmapUrl.searchParams.append("apikey", API_KEY);
    points.forEach((p) => {
      vietmapUrl.searchParams.append("point", p);
    });
    vietmapUrl.searchParams.append("vehicle", vehicle);
    vietmapUrl.searchParams.append("points_encoded", points_encoded);
    
    if (capacity) {
      vietmapUrl.searchParams.append("capacity", capacity);
    }
    if (annotations) {
      vietmapUrl.searchParams.append("annotations", annotations);
    }

    const response = await fetch(vietmapUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Vietmap Route API error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Vietmap API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch route results" },
      { status: 500 }
    );
  }
}
