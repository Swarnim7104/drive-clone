"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  Search,
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
  Settings,
} from "lucide-react"

// Import the new system
import { useKonamiCode } from "~/hooks/useKonamiCode"
import { transformMockDataToFileItems } from "~/lib/lainData"
import BasicDriveUI from "~/components/BasicUI"
import AdvancedDriveUI from "~/components/AdvancedUI"

interface FileItem {
  id: string
  name: string
  type: "folder" | "document" | "image" | "video" | "audio" | "archive"
  size?: string
  modified: string
  path: string
  parentPath: string
}

// Normal drive mock data (kept for regular mode)
const initialFileSystem: FileItem[] = [
  // Root level
  { id: "1", name: "Documents", type: "folder", modified: "2 days ago", path: "/Documents", parentPath: "/" },
  { id: "2", name: "Photos", type: "folder", modified: "1 week ago", path: "/Photos", parentPath: "/" },
  { id: "3", name: "Work", type: "folder", modified: "3 days ago", path: "/Work", parentPath: "/" },
  {
    id: "4",
    name: "Personal Notes.txt",
    type: "document",
    size: "2.4 KB",
    modified: "1 hour ago",
    path: "/Personal Notes.txt",
    parentPath: "/",
  },

  // Documents folder
  {
    id: "5",
    name: "Project Proposal.pdf",
    type: "document",
    size: "2.4 MB",
    modified: "3 hours ago",
    path: "/Documents/Project Proposal.pdf",
    parentPath: "/Documents",
  },
  {
    id: "6",
    name: "Meeting Notes.docx",
    type: "document",
    size: "156 KB",
    modified: "1 day ago",
    path: "/Documents/Meeting Notes.docx",
    parentPath: "/Documents",
  },
  {
    id: "7",
    name: "Contracts",
    type: "folder",
    modified: "1 week ago",
    path: "/Documents/Contracts",
    parentPath: "/Documents",
  },

  // Photos folder
  {
    id: "8",
    name: "Vacation 2024",
    type: "folder",
    modified: "2 weeks ago",
    path: "/Photos/Vacation 2024",
    parentPath: "/Photos",
  },
  {
    id: "9",
    name: "Screenshot 2024.png",
    type: "image",
    size: "1.2 MB",
    modified: "5 hours ago",
    path: "/Photos/Screenshot 2024.png",
    parentPath: "/Photos",
  },
  {
    id: "10",
    name: "Profile Picture.jpg",
    type: "image",
    size: "856 KB",
    modified: "1 month ago",
    path: "/Photos/Profile Picture.jpg",
    parentPath: "/Photos",
  },

  // Work folder
  { id: "11", name: "Projects", type: "folder", modified: "1 day ago", path: "/Work/Projects", parentPath: "/Work" },
  {
    id: "12",
    name: "Presentation.pptx",
    type: "document",
    size: "8.7 MB",
    modified: "4 days ago",
    path: "/Work/Presentation.pptx",
    parentPath: "/Work",
  },
  {
    id: "13",
    name: "Budget 2024.xlsx",
    type: "document",
    size: "245 KB",
    modified: "1 week ago",
    path: "/Work/Budget 2024.xlsx",
    parentPath: "/Work",
  },

  // Work/Projects folder
  {
    id: "14",
    name: "Website Redesign",
    type: "folder",
    modified: "2 days ago",
    path: "/Work/Projects/Website Redesign",
    parentPath: "/Work/Projects",
  },
  {
    id: "15",
    name: "Mobile App",
    type: "folder",
    modified: "1 week ago",
    path: "/Work/Projects/Mobile App",
    parentPath: "/Work/Projects",
  },
  {
    id: "16",
    name: "Project Timeline.pdf",
    type: "document",
    size: "1.8 MB",
    modified: "3 days ago",
    path: "/Work/Projects/Project Timeline.pdf",
    parentPath: "/Work/Projects",
  },

  // Documents/Contracts folder
  {
    id: "17",
    name: "Client Agreement.pdf",
    type: "document",
    size: "3.2 MB",
    modified: "2 weeks ago",
    path: "/Documents/Contracts/Client Agreement.pdf",
    parentPath: "/Documents/Contracts",
  },
  {
    id: "18",
    name: "NDA Template.docx",
    type: "document",
    size: "89 KB",
    modified: "1 month ago",
    path: "/Documents/Contracts/NDA Template.docx",
    parentPath: "/Documents/Contracts",
  },
]

export default function Component() {
  const { isUnlocked } = useKonamiCode()
  const [currentPath, setCurrentPath] = useState("/")
  const [uiMode, setUiMode] = useState<'normal' | 'advanced'>('normal')
  const [searchQuery, setSearchQuery] = useState("")
  const [fileSystem, setFileSystem] = useState<FileItem[]>(initialFileSystem)
  const [newFolderName, setNewFolderName] = useState("")
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set())
  const [sharingFile, setSharingFile] = useState<FileItem | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  // Get current file system based on unlock status and path
  const getCurrentFileSystem = (): FileItem[] => {
    if (isUnlocked && currentPath.startsWith("/NAVI")) {
      return transformMockDataToFileItems()
    }
    return fileSystem
  }

  // Enhanced breadcrumbs that show NAVI when unlocked
  const getBreadcrumbs = () => {
    const pathParts = currentPath.split('/').filter(Boolean)
    const breadcrumbs = []

    if (isUnlocked) {
      breadcrumbs.push({ name: 'NAVI', path: '/NAVI' })
    }

    if (!currentPath.startsWith('/NAVI')) {
      breadcrumbs.push({ name: 'Drive', path: '/' })
      
      let buildPath = ''
      pathParts.forEach((part) => {
        buildPath += `/${part}`
        breadcrumbs.push({ name: part, path: buildPath })
      })
    } else {
      // Handle NAVI paths
      let buildPath = '/NAVI'
      const naviParts = pathParts.slice(1) // Remove 'NAVI' from parts
      naviParts.forEach((part) => {
        buildPath += `/${part}`
        breadcrumbs.push({ name: part, path: buildPath })
      })
    }

    return breadcrumbs
  }

  // Switch to NAVI mode when Konami code is unlocked
  const handleNaviAccess = () => {
    if (isUnlocked && currentPath === "/") {
      setCurrentPath("/NAVI")
    }
  }

  // If we're in NAVI mode and using AdvancedUI, delegate to that component
  if (isUnlocked && currentPath.startsWith("/NAVI") && uiMode === 'advanced') {
    return <AdvancedDriveUI />
  }

  const getFileIcon = (type: string) => {
    const iconClass = isInNavi ? "w-4 h-4 text-green-400" : "w-4 h-4 text-gray-400"
    switch (type) {
      case "folder":
        return <Folder className={iconClass} />
      case "document":
        return <FileText className={iconClass} />
      case "image":
        return <ImageIcon className={iconClass} />
      case "video":
        return <Video className={iconClass} />
      case "audio":
        return <Music className={iconClass} />
      case "archive":
        return <Archive className={iconClass} />
      default:
        return <FileText className={iconClass} />
    }
  }

  const getFileType = (fileName: string): FileItem["type"] => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (!extension) return "document"

    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"]
    const videoExts = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"]
    const audioExts = ["mp3", "wav", "flac", "aac", "m4a", "ogg"]
    const archiveExts = ["zip", "rar", "7z", "tar", "gz"]

    if (imageExts.includes(extension)) return "image"
    if (videoExts.includes(extension)) return "video"
    if (audioExts.includes(extension)) return "audio"
    if (archiveExts.includes(extension)) return "archive"

    return "document"
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(bytes === 0 ? 0 : Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  // Get current folder contents
  const getCurrentFiles = () => {
    const currentFileSystem = getCurrentFileSystem()
    return currentFileSystem.filter((file) => file.parentPath === currentPath)
  }

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath)
  }

  const handleBreadcrumbClick = (path: string) => {
    setCurrentPath(path)
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      type: "folder",
      modified: "Just now",
      path: currentPath === "/" ? `/${newFolderName.trim()}` : `${currentPath}/${newFolderName.trim()}`,
      parentPath: currentPath,
    }

    setFileSystem([...fileSystem, newFolder])
    setNewFolderName("")
    setIsNewFolderDialogOpen(false)
  }

  const handleFileUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files)

    const newFiles: FileItem[] = fileArray.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: getFileType(file.name),
      size: formatFileSize(file.size),
      modified: "Just now",
      path: currentPath === "/" ? `/${file.name}` : `${currentPath}/${file.name}`,
      parentPath: currentPath,
    }))

    setFileSystem([...fileSystem, ...newFiles])
    setUploadedFiles([])
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleDelete = (fileId: string) => {
    setFileSystem(fileSystem.filter((file) => file.id !== fileId))
  }

  const handleDownload = (file: FileItem) => {
    setDownloadingFiles((prev) => new Set(prev).add(file.id))

    // Simulate download process
    setTimeout(() => {
      // Create a blob URL for download simulation
      const element = document.createElement("a")
      const blob = new Blob([`This is a simulated download of ${file.name}`], { type: "text/plain" })
      element.href = URL.createObjectURL(blob)
      element.download = file.name
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      URL.revokeObjectURL(element.href)

      setDownloadingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(file.id)
        return newSet
      })
    }, 1000)
  }

  const handleShare = (file: FileItem) => {
    setSharingFile(file)
    setShareDialogOpen(true)
  }

  const copyShareLink = () => {
    if (sharingFile) {
      const shareUrl = `${window.location.origin}/shared/${sharingFile.id}`
      navigator.clipboard.writeText(shareUrl)
      // You could add a toast notification here
      setShareDialogOpen(false)
      setSharingFile(null)
    }
  }

  const filteredFiles = getCurrentFiles().filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const breadcrumbs = getBreadcrumbs()

  // Apply NAVI styling when in NAVI mode
  const isInNavi = currentPath.startsWith("/NAVI")
  const containerClasses = isInNavi 
    ? `min-h-screen bg-black text-green-400 transition-colors ${isDragOver ? "bg-gray-900" : ""}`
    : `min-h-screen bg-white transition-colors ${isDragOver ? "bg-gray-50" : ""}`

  return (
    <div
      className={containerClasses}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">Share "{sharingFile?.name}"</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Share link</label>
              <div className="flex space-x-2">
                <Input
                  value={sharingFile ? `${window.location.origin}/shared/${sharingFile.id}` : ""}
                  readOnly
                  className="border-gray-200 bg-gray-50 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyShareLink}
                  className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                >
                  Copy
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareDialogOpen(false)}
                className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
              >
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

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 text-xs opacity-50 z-50 p-2 bg-white/10 rounded">
          <div>Unlocked: {isUnlocked ? 'Yes' : 'No'}</div>
          <div>Path: {currentPath}</div>
          <div>UI: {uiMode}</div>
          <div>Files: {getCurrentFiles().length}</div>
        </div>
      )}

      {/* Header */}
      <header className="px-12 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 mb-12">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && <ChevronRight className={`w-3 h-3 mx-3 ${isInNavi ? 'text-green-600' : 'text-gray-300'}`} />}
                <button
                  onClick={() => handleBreadcrumbClick(crumb.path)}
                  className={`text-sm transition-colors ${
                    index === breadcrumbs.length - 1 
                      ? isInNavi ? "text-green-400 font-medium" : "text-black font-medium"
                      : isInNavi ? "text-green-600 hover:text-green-300" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* NAVI Access Button (only show when unlocked and not in NAVI) */}
              {isUnlocked && !currentPath.startsWith("/NAVI") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-400 text-green-600 hover:text-green-800 hover:border-green-500"
                  onClick={handleNaviAccess}
                >
                  Enter NAVI
                </Button>
              )}

              {/* UI Mode Toggle (only show when in NAVI) */}
              {isUnlocked && currentPath.startsWith("/NAVI") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                  onClick={() => setUiMode(prev => prev === 'normal' ? 'advanced' : 'normal')}
                >
                  <Settings className="w-3 h-3 mr-2" />
                  {uiMode === 'normal' ? 'Advanced UI' : 'Normal UI'}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                onClick={handleUploadClick}
              >
                <Upload className="w-3 h-3 mr-2" />
                Upload
              </Button>

              <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                  >
                    <FolderPlus className="w-3 h-3 mr-2" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-medium">Create new folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateFolder()
                        }
                      }}
                      className="border-gray-200 focus:border-gray-400"
                      autoFocus
                    />
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsNewFolderDialogOpen(false)}
                        className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCreateFolder}
                        disabled={!newFolderName.trim()}
                        className="bg-black text-white hover:bg-gray-800"
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 border-0 bg-gray-50 text-sm placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-12 pb-12">
        <div className="max-w-6xl mx-auto">
          {filteredFiles.length > 0 ? (
            <div className="space-y-1">
              {filteredFiles.map((file, index) => (
                <div
                  key={file.id}
                  className={`group flex items-center py-4 px-4 -mx-4 rounded-lg cursor-pointer transition-colors ${
                    isInNavi ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => (file.type === "folder" ? handleFolderClick(file.path) : undefined)}
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isInNavi ? 'text-green-400' : 'text-black'}`}>
                        {file.name}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center space-x-8 text-xs ${isInNavi ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className="w-16 text-right">{file.size || "—"}</span>
                    <span className="w-20 text-right">{file.modified}</span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0 hover:bg-gray-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-3 h-3 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(file)
                          }}
                          disabled={downloadingFiles.has(file.id)}
                        >
                          <Download className="w-3 h-3 mr-2" />
                          {downloadingFiles.has(file.id) ? "Downloading..." : "Download"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShare(file)
                          }}
                        >
                          <Share className="w-3 h-3 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-xs text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
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
              <p className="text-sm text-gray-400">{searchQuery ? "No files found" : "This folder is empty"}</p>
              {!searchQuery && (
                <div className="mt-6 space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                    onClick={handleUploadClick}
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    Upload files
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-600 hover:text-black hover:border-gray-300"
                    onClick={() => setIsNewFolderDialogOpen(true)}
                  >
                    <FolderPlus className="w-3 h-3 mr-2" />
                    Create folder
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
