import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import type { PRD } from "@/types/prd";

/**
 * GET /api/prd
 * Returns the parsed contents of prd.json from the project root.
 */
export async function GET() {
  const prdPath = join(process.cwd(), "prd.json");

  try {
    const fileContents = await readFile(prdPath, "utf-8");
    const prd: PRD = JSON.parse(fileContents);
    return NextResponse.json(prd);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return NextResponse.json(
        { error: "prd.json not found" },
        { status: 404 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in prd.json" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to read prd.json" },
      { status: 500 }
    );
  }
}
