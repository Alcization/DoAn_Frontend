import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY as string;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const refid = searchParams.get("refid");

    if (!refid) {
      return NextResponse.json(
        { error: "refid parameter is required" },
        { status: 400 }
      );
    }



    const vietmapUrl = new URL("https://maps.vietmap.vn/api/place/v4");
    vietmapUrl.searchParams.append("apikey", API_KEY);
    vietmapUrl.searchParams.append("refid", refid);

    const response = await fetch(vietmapUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Vietmap Place API error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Vietmap Place API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Place API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: 500 }
    );
  }
}
