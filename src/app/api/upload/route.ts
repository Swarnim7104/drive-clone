import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { createFile } from "~/server/db/queries";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const parentId = data.get("parentId") as string;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    if (!parentId) {
      return NextResponse.json({ error: "Parent ID is required" }, { status: 400 });
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);
    const publicUrl = `/uploads/${filename}`;
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    // Determine corruption status (30% chance)
    const corruptionRoll = Math.random();
    const isCorrupted = corruptionRoll < 0.3;
    const corrupted = isCorrupted ? 1 : 0;
    const corruptionLevel = isCorrupted ? Math.floor(Math.random() * 3) + 1 : 0;
    
    // Save file metadata to database (with fallback)
    try {
      const parentIdBigInt = BigInt(parentId);
      const result = await createFile(
        file.name,
        publicUrl,
        file.size,
        parentIdBigInt,
        corrupted,
        corruptionLevel
      );
      
      return NextResponse.json({ 
        success: true, 
        file: {
          name: file.name,
          url: publicUrl,
          size: file.size,
          corrupted,
          corruptionLevel,
          parent: parentId
        },
        result,
        mode: "database"
      });
    } catch (dbError) {
      console.warn("Database unavailable for file upload, using fallback mode:", dbError);
      
      // Return success even if database fails (file is still saved to disk)
      return NextResponse.json({ 
        success: true, 
        file: {
          name: file.name,
          url: publicUrl,
          size: file.size,
          corrupted,
          corruptionLevel,
          parent: parentId
        },
        mode: "fallback",
        warning: "File uploaded but not saved to database"
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
