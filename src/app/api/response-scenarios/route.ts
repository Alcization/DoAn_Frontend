import { NextResponse } from "next/server";
import { SCENARIOS } from "../../../context/services/mock/government/scenario-management";

/**
 * GET /api/response-scenarios
 * Returns all available response scenarios
 */
export async function GET() {
  try {
    return NextResponse.json(SCENARIOS, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    return NextResponse.json(
      { error: "Failed to fetch scenarios" },
      { status: 500 }
    );
  }
}
