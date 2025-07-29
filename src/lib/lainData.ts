import { mockFiles, mockFolders } from "~/lib/mockData";
import type { FileItem as MockFileItem, Folder as MockFolder } from "~/lib/mockData";

// Interface matching your current page.tsx FileItem
export interface FileItem {
  id: string;
  name: string;
  type: "folder" | "document" | "image" | "video" | "audio" | "archive";
  size?: string;
  modified: string;
  path: string;
  parentPath: string;
}

// Transform mock data to match your current interface
export function transformMockDataToFileItems(): FileItem[] {
  const transformedFolders: FileItem[] = mockFolders.map((folder: MockFolder) => ({
    id: folder.id,
    name: folder.name,
    type: "folder" as const,
    modified: folder.modified,
    path: buildPath(folder.id, mockFolders),
    parentPath: buildParentPath(folder.parentId),
  }));

  const transformedFiles: FileItem[] = mockFiles.map((file: MockFileItem) => ({
    id: file.id,
    name: file.name,
    type: mapFileType(file.fileType),
    size: file.size,
    modified: file.modified,
    path: buildPath(file.id, [...mockFolders, ...mockFiles]),
    parentPath: buildParentPath(file.parentId),
  }));

  return [...transformedFolders, ...transformedFiles];
}

// Helper to map file types from mock data to your interface
function mapFileType(fileType: string): FileItem["type"] {
  switch (fileType) {
    case "image":
      return "image";
    case "video":
      return "video";
    case "audio":
      return "audio";
    case "archive":
      return "archive";
    default:
      return "document";
  }
}

// Build full path for an item - simplified for now
function buildPath(itemId: string, allItems: Array<MockFolder | MockFileItem>): string {
  const item = allItems.find((i) => i.id === itemId);
  if (!item) return "/NAVI/";
  
  if (item.parentId === null || item.parentId === "root") {
    return `/NAVI/${item.name}`;
  }
  
  return `/NAVI/${item.name}`;
}

// Build parent path for an item - simplified to work with current navigation
function buildParentPath(parentId: string | null): string {
  if (parentId === null || parentId === "root") {
    return "/NAVI";
  }
  
  // For now, everything is at /NAVI level to make navigation simple
  return "/NAVI";
}
