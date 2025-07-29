import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { folders } from "~/server/db/schema";

// Simple database connection test
export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Try to query the folders table
    const result = await db.select().from(folders).limit(1);
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      sampleData: result
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
