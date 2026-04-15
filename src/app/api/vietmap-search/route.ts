import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_VIETMAP_API_KEY as string;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("text");
    const focus = searchParams.get("focus");
    const display_type = searchParams.get("display_type") || "5";

    if (!text) {
      return NextResponse.json(
        { error: "text parameter is required" },
        { status: 400 }
      );
    }



    const vietmapUrl = new URL("https://maps.vietmap.vn/api/search/v4");
    vietmapUrl.searchParams.append("apikey", API_KEY);
    vietmapUrl.searchParams.append("text", text);
    if (focus) {
      vietmapUrl.searchParams.append("focus", focus);
    }
    vietmapUrl.searchParams.append("display_type", display_type);

    const response = await fetch(vietmapUrl.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Vietmap Search API error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Vietmap Search API error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
