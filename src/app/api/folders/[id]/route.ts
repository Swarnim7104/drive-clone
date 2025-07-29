import { type NextRequest, NextResponse } from "next/server";
import { deleteFolder } from "~/server/db/queries";

// DELETE /api/folders/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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
