import { type NextRequest, NextResponse } from "next/server";
import { getFilesByParent, createFile, deleteFile } from "~/server/db/queries";

// GET /api/files?parent=123 - Get files by parent ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get("parent");
    
    if (!parentId) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }
    
    const parentIdBigInt = BigInt(parentId);
    const fileList = await getFilesByParent(parentIdBigInt);
    
    return NextResponse.json({ files: fileList });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

// POST /api/files - Create new file
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, size, parent, corrupted = 0, corruptionLevel = 0 } = body;
    
    if (!name || !url || typeof size !== "number" || typeof parent !== "string") {
      return NextResponse.json({ 
        error: "Name, URL, size, and parent ID are required" 
      }, { status: 400 });
    }
    
    const parentIdBigInt = BigInt(parent);
    const result = await createFile(name, url, size, parentIdBigInt, corrupted, corruptionLevel);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error creating file:", error);
    return NextResponse.json({ error: "Failed to create file" }, { status: 500 });
  }
}
