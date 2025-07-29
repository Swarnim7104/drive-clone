import { type NextRequest, NextResponse } from "next/server";
import { getFolderContents, initializeDefaultData } from "~/server/db/queries";
import { mockFiles, mockFolders } from "~/lib/mockData";

// Fallback function to get mock data when database is unavailable
function getMockFolderContents(parentId: string, corruptionLevel?: string) {
  const parentIdStr = parentId === "1" ? "root" : parentId;
  
  let folders: typeof mockFolders;
  let files: typeof mockFiles;
  
  if (corruptionLevel === "none") {
    // Level 1: Only show normal folders and files
    folders = mockFolders.filter(folder => 
      folder.parentId === parentIdStr && folder.id.startsWith("normal_")
    );
    files = mockFiles.filter(file => 
      file.parentId === parentIdStr && file.id.startsWith("normal_")
    );
  } else {
    // Level 2+: Show all folders and files (Lain content appears)
    folders = mockFolders.filter(folder => folder.parentId === parentIdStr);
    files = mockFiles.filter(file => file.parentId === parentIdStr);
  }
  
  return {
    folders: folders.map(folder => ({
      id: folder.id === "root" ? "1" : folder.id,
      name: folder.name,
      parent: folder.parentId === "root" ? null : "1",
      corrupted: folder.corrupted ? 1 : 0,
      corruptionLevel: folder.corruptionLevel || 0,
      modified: folder.modified,
    })),
    files: files.map(file => ({
      id: file.id,
      name: file.name,
      size: parseInt(file.size.replace(/[^\d]/g, '')) || 1000,
      url: file.url,
      parent: "1",
      corrupted: file.corrupted ? 1 : 0,
      corruptionLevel: file.corruptionLevel || 0,
      fileType: file.fileType,
      modified: file.modified,
    })),
  };
}

// GET /api/folder-contents?parent=123&corruption=none - Get all contents of a folder
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get("parent");
    const corruptionLevel = searchParams.get("corruption");
    
    if (!parentId) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }

    try {
      // Try database first - but only if parentId is numeric
      if (/^\d+$/.test(parentId)) {
        const parentIdBigInt = BigInt(parentId);
        const contents = await getFolderContents(parentIdBigInt);
        return NextResponse.json(contents);
      } else {
        // If parentId is not numeric (like "root"), use mock data
        throw new Error("Non-numeric parent ID, using fallback");
      }
    } catch (dbError) {
      console.warn("Database unavailable, falling back to mock data:", dbError);
      // Fallback to mock data
      const mockContents = getMockFolderContents(parentId, corruptionLevel || undefined);
      return NextResponse.json(mockContents);
    }
  } catch (error) {
    console.error("Error fetching folder contents:", error);
    return NextResponse.json({ error: "Failed to fetch folder contents" }, { status: 500 });
  }
}

// POST /api/folder-contents/init - Initialize default data
export async function POST(request: NextRequest) {
  try {
    await initializeDefaultData();
    return NextResponse.json({ success: true, message: "Database initialized" });
  } catch (error) {
    console.warn("Database initialization failed, using fallback mode:", error);
    return NextResponse.json({ 
      success: true, 
      message: "Running in fallback mode with mock data",
      fallbackMode: true 
    });
  }
}
