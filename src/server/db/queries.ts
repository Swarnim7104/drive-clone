import "server-only";

import { db } from ".";
import { files, folders } from "./schema";
import { eq, and } from "drizzle-orm";

// Folder operations
export async function getFoldersByParent(parentId: bigint) {
  return await db
    .select()
    .from(folders)
    .where(eq(folders.parent, parentId));
}

export async function createFolder(name: string, parentId: bigint) {
  const result = await db
    .insert(folders)
    .values({
      name,
      parent: parentId,
    });
  
  return result;
}

export async function deleteFolder(id: bigint) {
  return await db
    .delete(folders)
    .where(eq(folders.id, id));
}

// File operations
export async function getFilesByParent(parentId: bigint) {
  return await db
    .select()
    .from(files)
    .where(eq(files.parent, parentId));
}

export async function createFile(
  name: string, 
  url: string, 
  size: number, 
  parentId: bigint,
  corrupted = 0,
  corruptionLevel = 0
) {
  const result = await db
    .insert(files)
    .values({
      name,
      url,
      size,
      parent: parentId,
      corrupted,
      corruptionLevel,
    });
  
  return result;
}

export async function updateFileCorruption(id: bigint, corrupted: number, corruptionLevel: number) {
  return await db
    .update(files)
    .set({
      corrupted,
      corruptionLevel,
    })
    .where(eq(files.id, id));
}

export async function deleteFile(id: bigint) {
  return await db
    .delete(files)
    .where(eq(files.id, id));
}

// Get all items in a folder (both files and folders)
export async function getFolderContents(parentId: bigint) {
  const [folderList, fileList] = await Promise.all([
    getFoldersByParent(parentId),
    getFilesByParent(parentId),
  ]);
  
  return {
    folders: folderList,
    files: fileList,
  };
}

// Initialize default data if database is empty
export async function initializeDefaultData() {
  // Check if root folder exists
  const existingFolders = await db
    .select()
    .from(folders)
    .where(eq(folders.id, 1n));
  
  if (existingFolders.length === 0) {
    // Create root folder structure
    await db.insert(folders).values([
      { id: 1n, name: "My Drive", parent: null },
      { id: 101n, name: "Documents", parent: 1n },
      { id: 102n, name: "Images", parent: 1n },
    ]);
    
    // Create some sample files with corruption
    await db.insert(files).values([
      {
        id: 1n,
        name: "Project Proposal.docx",
        url: "/files/proposal.docx",
        size: 45232,
        parent: 101n,
        corrupted: 0,
        corruptionLevel: 0,
      },
      {
        id: 2n,
        name: "Meeting Notes.pdf",
        url: "/files/notes.pdf",
        size: 123456,
        parent: 101n,
        corrupted: 1,
        corruptionLevel: 2,
      },
      {
        id: 3n,
        name: "presentation.pptx",
        url: "/files/presentation.pptx",
        size: 2234567,
        parent: 101n,
        corrupted: 0,
        corruptionLevel: 0,
      },
      {
        id: 4n,
        name: "corrupted_data.txt",
        url: "/files/corrupted.txt",
        size: 8192,
        parent: 101n,
        corrupted: 1,
        corruptionLevel: 3,
      },
    ]);
    
    console.log("🗄️ Database initialized with default data");
  }
}
