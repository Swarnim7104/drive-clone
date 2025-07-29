import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { folders } from "~/server/db/schema";
import { getFoldersByParent, createFolder, deleteFolder } from "~/server/db/queries";

// GET /api/folders?parent=123 - Get folders by parent ID
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get("parent");
    
    if (!parentId) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }
    
    const parentIdBigInt = BigInt(parentId);
    const folderList = await getFoldersByParent(parentIdBigInt);
    
    return NextResponse.json({ folders: folderList });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

// POST /api/folders - Create new folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, parent } = body;
    
    if (!name || typeof parent !== "string") {
      return NextResponse.json({ error: "Name and parent ID are required" }, { status: 400 });
    }
    
    const parentIdBigInt = BigInt(parent);
    const result = await createFolder(name, parentIdBigInt);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}

// DELETE /api/folders/[id] - Delete folder
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 });
    }
    
    const idBigInt = BigInt(id);
    await deleteFolder(idBigInt);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting folder:", error);
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 });
  }
}
