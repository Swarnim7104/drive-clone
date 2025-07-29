"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Upload,
  FolderPlus,
  MoreHorizontal,
  Folder,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Download,
  Share,
  Trash2,
  ChevronRight,
  Search,
  AlertTriangle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import type { files, folders } from "~/server/db/schema";
import React from "react";

type FileType = typeof files.$inferSelect;
type FolderType = typeof folders.$inferSelect;

interface DatabaseConnectedDriveUIProps {
  onCorruptedFileClick?: () => void;
  showCorruption?: boolean;
  corruptionLevel?: "none" | "glitching" | "destroyed";
  onCustomKonamiActivation?: () => void;
  customKonamiCode?: string[];
}

export default function DatabaseConnectedDriveUI(props: DatabaseConnectedDriveUIProps = {}) {
  const {
    onCorruptedFileClick,
    showCorruption = false,
    corruptionLevel = "none",
    onCustomKonamiActivation,
    customKonamiCode = []
  } = props;

  // State
  const [files, setFiles] = useState<FileType[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sharingFile, setSharingFile] = useState<FileType | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  // Custom Konami code detection
  useEffect(() => {
    if (customKonamiCode.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...keySequence, e.code].slice(-customKonamiCode.length);
      setKeySequence(newSequence);

      if (newSequence.join(",") === customKonamiCode.join(",")) {
        onCustomKonamiActivation?.();
        setKeySequence([]); // Reset sequence
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keySequence, customKonamiCode, onCustomKonamiActivation]);

  // Initialize database and load folder contents
  useEffect(() => {
    initializeDatabase();
  }, []);

  useEffect(() => {
    loadFolderContents(currentFolder);
  }, [currentFolder]);

  const initializeDatabase = async () => {
    try {
      await fetch("/api/folder-contents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  };

  const loadFolderContents = async (folderId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/folder-contents?parent=${folderId}&corruption=${corruptionLevel}`);
      const data = await response.json();
      
      if (response.ok) {
        setFiles(data.files || []);
        setFolders(data.folders || []);
      } else {
        console.error("Failed to load folder contents:", data.error);
      }
    } catch (error) {
      console.error("Error loading folder contents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get styling based on corruption state
  const getBaseClasses = () => {
    if (!showCorruption) {
      return {
        container: "",
        text: "text-gray-900",
        border: "border-gray-200",
        bg: "bg-white"
      };
    }

    if (corruptionLevel === "destroyed") {
      return {
        container: "corrupted-destroyed",
        text: "text-red-500",
        border: "border-red-700",
        bg: "bg-gray-900"
      };
    }

    return {
      container: "corrupted-glitch",
      text: "text-green-400",
      border: "border-green-500",
      bg: "bg-black"
    };
  };

  const baseStyles = getBaseClasses();

  // Navigation
  const handleFolderClick = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  const handleBreadcrumbClick = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  // Build breadcrumbs (simplified for now - in production you'd need to fetch folder hierarchy)
  const breadcrumbs = useMemo(() => {
    const breadcrumbsArr: FolderType[] = [];
    if (currentFolder !== "root") {
      const folder = folders.find((f) => f.id.toString() === currentFolder);
      if (folder) {
        breadcrumbsArr.push(folder);
      }
    }
    return breadcrumbsArr;
  }, [currentFolder, folders]);

  // Filtering
  const filteredFolders = useMemo(() => {
    return folders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [folders, searchQuery]);

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      (file.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [files, searchQuery]);

  // Handle file clicks - KEY: Only show corruption alert, no visual changes in clean mode
  const handleFileClick = (file: FileType) => {
    if (file.corrupted && file.corrupted > 0) {
      onCorruptedFileClick?.();
      alert("Cannot open file - access denied");
      return;
    } else {
      // Open file in new tab
      if (file.url) {
        window.open(file.url, "_blank");
      }
    }
  };

  // Text corruption (only when showCorruption is true)
  const corruptText = (text: string) => {
    if (!showCorruption) return text;
    
    if (corruptionLevel === "destroyed") {
      return text.split('').map((char, i) => 
        Math.random() < 0.3 
          ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) 
          : Math.random() < 0.2 
          ? char.toUpperCase() 
          : char
      ).join('') + " [CORRUPTED]";
    } else {
      return text.toUpperCase().split('').map((char, i) => 
        Math.random() < 0.1 ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : char
      ).join('');
    }
  };

  // Icon helper - KEY: Corrupted files look completely normal in clean mode
  const getFileIcon = (file: FileType) => {
    const baseClasses = "w-5 h-5";
    
    // NEVER show corruption indicators in clean mode - this is the stealth system
    const extension = file.name?.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) {
      return <ImageIcon className={`${baseClasses} text-purple-500`} />;
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(extension)) {
      return <Video className={`${baseClasses} text-red-500`} />;
    }
    if (['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg'].includes(extension)) {
      return <Music className={`${baseClasses} text-green-500`} />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return <Archive className={`${baseClasses} text-orange-500`} />;
    }
    
    return <FileText className={`${baseClasses} text-gray-500`} />;
  };

  // Handlers
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFolderName,
          parent: currentFolder.toString(),
        }),
      });
      
      if (response.ok) {
        setIsNewFolderDialogOpen(false);
        setNewFolderName("");
        await loadFolderContents(currentFolder);
      } else {
        const data = await response.json();
        alert(`Failed to create folder: ${data.error}`);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFilesList = event.target.files;
    if (!uploadedFilesList || uploadedFilesList.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (const file of Array.from(uploadedFilesList)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("parentId", currentFolder.toString());
        
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          const data = await response.json();
          console.error(`Failed to upload ${file.name}:`, data.error);
          alert(`Failed to upload ${file.name}: ${data.error}`);
        }
      }
      
      // Reload folder contents after upload
      await loadFolderContents(currentFolder);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      for (const file of Array.from(droppedFiles)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("parentId", currentFolder.toString());
        
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          const data = await response.json();
          console.error(`Failed to upload ${file.name}:`, data.error);
        }
      }
      
      await loadFolderContents(currentFolder);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: bigint, type: 'file' | 'folder') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    try {
      const endpoint = type === 'file' ? `/api/files/${id.toString()}` : `/api/folders/${id.toString()}`;
      const response = await fetch(endpoint, { method: "DELETE" });
      
      if (response.ok) {
        await loadFolderContents(currentFolder);
      } else {
        const data = await response.json();
        alert(`Failed to delete ${type}: ${data.error}`);
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Failed to delete ${type}`);
    }
  };

  const handleDownload = (file: FileType) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = (file: FileType) => {
    setSharingFile(file);
    setShareDialogOpen(true);
  };

  const copyShareLink = () => {
    if (sharingFile && typeof window !== 'undefined') {
      const link = `${window.location.origin}${sharingFile.url}`;
      navigator.clipboard.writeText(link);
      setShareDialogOpen(false);
      alert("Share link copied to clipboard!");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors ${baseStyles.bg} ${baseStyles.container} ${isDragOver ? "bg-gray-50" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share "{sharingFile?.name}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Share link</label>
              <div className="flex space-x-2">
                <Input
                  value={sharingFile && typeof window !== 'undefined' ? `${window.location.origin}${sharingFile.url}` : ""}
                  readOnly
                  className="border-gray-200 bg-gray-50 text-sm"
                />
                <Button variant="outline" size="sm" onClick={copyShareLink}>
                  Copy
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileInputChange} />

      {/* Drag overlay */}
      {isDragOver && (
        <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-dashed border-blue-300">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900">Drop files to upload</p>
          </div>
        </div>
      )}

      {/* Upload overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-lg font-medium text-gray-900">Uploading files...</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`px-6 py-4 border-b ${baseStyles.border}`}>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 mb-4">
            <button
              onClick={() => handleBreadcrumbClick("root")}
              className={`text-sm ${
                showCorruption && corruptionLevel === "glitching" 
                  ? "text-green-400 hover:text-green-300" 
                  : showCorruption && corruptionLevel === "destroyed" 
                  ? "text-red-500 hover:text-red-400" 
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {showCorruption && corruptionLevel === "glitching" 
                ? "SYSTEM_ROOT://" 
                : showCorruption && corruptionLevel === "destroyed" 
                ? "ERROR_DRIVE_CORRUPTED" 
                : "My Drive"}
            </button>
            {breadcrumbs.map((crumb) => (
              <div key={crumb.id.toString()} className="flex items-center">
                <ChevronRight className={`w-4 h-4 mx-2 ${
                  showCorruption && corruptionLevel === "glitching" 
                    ? "text-green-600" 
                    : showCorruption && corruptionLevel === "destroyed" 
                    ? "text-red-600" 
                    : "text-gray-300"
                }`} />
                <button
                  onClick={() => handleBreadcrumbClick(crumb.id.toString())}
                  className={`text-sm ${
                    showCorruption && corruptionLevel === "glitching" 
                      ? "text-green-400 hover:text-green-300" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "text-red-500 hover:text-red-400" 
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  {showCorruption ? corruptText(crumb.name) : crumb.name}
                </button>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleUploadClick} 
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>

              <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FolderPlus className="w-4 h-4 mr-2" />
                    New folder
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create new folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateFolder();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                        Create
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search in Drive"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {(filteredFolders.length > 0 || filteredFiles.length > 0) ? (
            <div className={`${baseStyles.bg} rounded-lg border ${baseStyles.border}`}>
              {/* File list header */}
              <div className={`grid grid-cols-12 gap-4 px-6 py-3 border-b ${baseStyles.border} text-sm font-medium ${
                showCorruption && corruptionLevel === "glitching" ? "text-green-500" : "text-gray-500"
              }`}>
                <div className="col-span-6">
                  {showCorruption && corruptionLevel === "glitching" ? "ENTITY_NAME" : "Name"}
                </div>
                <div className="col-span-2">
                  {showCorruption && corruptionLevel === "glitching" ? "TIMESTAMP" : "Modified"}
                </div>
                <div className="col-span-2">
                  {showCorruption && corruptionLevel === "glitching" ? "SIZE_BYTES" : "Size"}
                </div>
                <div className="col-span-2"></div>
              </div>

              {/* Folders */}
              {filteredFolders.map((folder) => (
                <div
                  key={folder.id.toString()}
                  className={`group grid grid-cols-12 gap-4 px-6 py-3 cursor-pointer border-b ${baseStyles.border} ${
                    showCorruption && corruptionLevel === "glitching" 
                      ? "hover:bg-gray-900 text-green-400" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "hover:bg-red-950 text-red-400" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleFolderClick(folder.id.toString())}
                >
                  <div className="col-span-6 flex items-center">
                    <Folder className={`w-5 h-5 mr-3 ${
                      showCorruption && corruptionLevel === "glitching" 
                        ? "text-green-500" 
                        : showCorruption && corruptionLevel === "destroyed" 
                        ? "text-red-500" 
                        : "text-blue-500"
                    }`} />
                    <span className={`text-sm ${baseStyles.text}`}>
                      {showCorruption ? corruptText(folder.name) : folder.name}
                    </span>
                  </div>
                  <div className={`col-span-2 text-sm ${
                    showCorruption && corruptionLevel === "glitching" 
                      ? "text-green-600" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "text-red-600" 
                      : "text-gray-500"
                  }`}>
                    {showCorruption && corruptionLevel === "glitching" 
                      ? "NULL" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "ERR" 
                      : "—"}
                  </div>
                  <div className={`col-span-2 text-sm ${
                    showCorruption && corruptionLevel === "glitching" 
                      ? "text-green-600" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "text-red-600" 
                      : "text-gray-500"
                  }`}>
                    {showCorruption && corruptionLevel === "glitching" 
                      ? "DIR" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "!DIR" 
                      : "—"}
                  </div>
                  <div className="col-span-2 flex items-center justify-end opacity-0 group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, 'folder'); }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {/* Files */}
              {filteredFiles.map((file) => (
                <div
                  key={file.id.toString()}
                  className={`group grid grid-cols-12 gap-4 px-6 py-3 cursor-pointer border-b ${baseStyles.border} ${
                    showCorruption && corruptionLevel === "glitching" 
                      ? "hover:bg-gray-900 text-green-400" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "hover:bg-red-950 text-red-400" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="col-span-6 flex items-center">
                    {getFileIcon(file)}
                    <span className={`text-sm ml-3 ${baseStyles.text}`}>
                      {showCorruption ? corruptText(file.name || "") : file.name}
                    </span>
                  </div>
                  <div className={`col-span-2 text-sm ${
                    showCorruption && corruptionLevel === "glitching" 
                      ? "text-green-600" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "text-red-600" 
                      : "text-gray-500"
                  }`}>
                    {showCorruption && corruptionLevel === "glitching" 
                      ? Math.floor(Math.random() * 999999) 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "ERROR" 
                      : "Recently"}
                  </div>
                  <div className={`col-span-2 text-sm ${
                    showCorruption && corruptionLevel === "glitching" 
                      ? "text-green-600" 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "text-red-600" 
                      : "text-gray-500"
                  }`}>
                    {showCorruption && corruptionLevel === "glitching" 
                      ? `0x${(file.size || 0).toString(16).toUpperCase()}` 
                      : showCorruption && corruptionLevel === "destroyed" 
                      ? "NULL" 
                      : formatFileSize(file.size || 0)}
                  </div>
                  <div className="col-span-2 flex items-center justify-end opacity-0 group-hover:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownload(file); }}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleShare(file); }}>
                          <Share className="w-4 h-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => { e.stopPropagation(); handleDelete(file.id, 'file'); }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-gray-400 mb-4">
                <Folder className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">{searchQuery ? "No files found" : "This folder is empty"}</p>
                <p className="text-sm">Add files to get started</p>
              </div>
              {!searchQuery && (
                <div className="mt-6 space-x-4">
                  <Button onClick={handleUploadClick} disabled={isUploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload files"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(true)}>
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Create folder
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Corruption overlay effect - red/green flashing for glitching state */}
      {showCorruption && corruptionLevel === "glitching" && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="w-full h-full bg-gradient-to-r from-red-500/20 via-transparent to-green-500/20 animate-pulse" />
          <div className="absolute inset-0 bg-red-500/10 animate-ping" />
          <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
        </div>
      )}
    </div>
  );
}
