import { type NextRequest, NextResponse } from "next/server";
import { deleteFile } from "~/server/db/queries";

// DELETE /api/files/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }
    
    const idBigInt = BigInt(id);
    await deleteFile(idBigInt);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
