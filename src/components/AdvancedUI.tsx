"use client";
import React from "react";

import { useState, useEffect, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Folder,
  File,
  Upload,
  ChevronRight,
  Home,
  ImageIcon,
  FileText,
  Music,
  Video,
  Archive,
  Code,
  MoreVertical,
  Download,
  Trash2,
  Edit,
} from "lucide-react";

import { mockFiles, mockFolders } from "~/lib/mockData";
import type { FileItem, Folder as FolderType } from "~/lib/mockData";

import { corruptText, getCorruptionClasses } from "~/lib/corruptionEffects";

type AnyFileSystemItem = FileItem | FolderType;

interface ComponentProps {
  onRepairAttempt?: () => void;
  showTitleGlitch?: boolean;
  showFlashes?: boolean;
  showLainArt?: boolean;
  heavyCorruption?: boolean;
}

const getFileIcon = (fileType?: string) => {
  switch (fileType) {
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    case "text":
    case "pdf":
      return <FileText className="h-4 w-4" />;
    case "audio":
      return <Music className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "archive":
      return <Archive className="h-4 w-4" />;
    case "code":
      return <Code className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
};

export default function Component({ 
  onRepairAttempt,
  showTitleGlitch = false,
  showFlashes = false,
  showLainArt = false,
  heavyCorruption = false
}: ComponentProps = {}) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>("root");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
  const [glitchActive, setGlitchActive] = useState(false);
  const [corruptionActive, setCorruptionActive] = useState<
    Record<string, boolean>
  >({});

  const currentItems: AnyFileSystemItem[] = useMemo(() => {
    const foldersInCurrent = mockFolders.filter(
      (folder) => folder.parentId === currentFolderId,
    );
    const filesInCurent = mockFiles.filter(
      (file) => file.parentId === currentFolderId,
    );
    return [...foldersInCurrent, ...filesInCurent]
  }, [currentFolderId]);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance every 3 seconds
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Corruption effect for individual files
  useEffect(() => {
    const corruptionInterval = setInterval(() => {
      const newCorruptionState: Record<string, boolean> = {};

      // Check all items in current directory for corruption
      currentItems.forEach((item) => {
        if (item.corrupted) {
          // Higher corruption level = more frequent corruption
          const corruptionChance = item.corruptionLevel! * 0.2; // 20%, 40%, 60%
          newCorruptionState[item.id] = Math.random() < corruptionChance;
        }
      });

      setCorruptionActive(newCorruptionState);
    }, 500); // Check every 500ms for more frequent corruption

    return () => clearInterval(corruptionInterval);
  }, [currentItems]);

  // Easter egg: Konami code detection
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.code].slice(-10);
      setKonami(newKonami);

      if (newKonami.join(",") === konamiCode.join(",")) {
        setEasterEggTriggered(true);
        console.log("🌐 You have accessed Layer 14. Welcome to the Wired.");
        setTimeout(() => setEasterEggTriggered(false), 3000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konami]);

  const navigateToFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
    setSelectedItems([]);
  };

  const handleGoUp = () => {
    const currentFolder = mockFolders.find((f) => f.id === currentFolderId);
    if (currentFolder && currentFolder.parentId !== null) {
      setCurrentFolderId(currentFolder.parentId);
      setSelectedItems([]);
    }
  };

  // Generate breadcrumbs dynamically based on currentFolderId
  const getBreadcrumbs = useMemo(() => {
    const breadcrumbs: FolderType[] = [];
    let current: FolderType | undefined = mockFolders.find(
      (f) => f.id === currentFolderId,
    );

    while (current) {
      const folderToProcess: FolderType = current;

      breadcrumbs.unshift(folderToProcess); // Add to the beginning to keep order
      if (folderToProcess.parentId === null) break; // Stop at the root
      const nextParentCandidate = mockFolders.find(
        (f) => f.id === folderToProcess.parentId,
      );
      if (!nextParentCandidate || nextParentCandidate.type !== "folder") {
        current = undefined; // Set current to undefined to terminate loop
      } else {
        break;
      }
    }
    return breadcrumbs;
  }, [currentFolderId]);

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-mono text-green-400">
      {/* Glitchy Background Effects */}
      <div className="pointer-events-none fixed inset-0">
        {/* Scanlines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-pulse bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.03)_50%)] bg-[length:100%_4px]" />
        </div>

        {/* Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Digital noise */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 animate-pulse bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        {/* Glitch overlay */}
        {(glitchActive || showFlashes) && (
          <div className="absolute inset-0 animate-pulse bg-green-400/5">
            <div className="absolute inset-0 animate-ping bg-[linear-gradient(90deg,transparent_0%,rgba(0,255,0,0.1)_50%,transparent_100%)]" />
            {showFlashes && (
              <div className="absolute inset-0 animate-pulse bg-red-500/10" />
            )}
          </div>
        )}

        {/* Subtle CRT effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />
      </div>

      {/* Easter egg overlay */}
      {easterEggTriggered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-400/10 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-4 animate-pulse text-4xl font-bold text-green-400">
              LAYER 14 ACCESSED
            </div>
            <div className="text-lg text-green-300">You are everywhere</div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-green-400/20 bg-black/80 backdrop-blur-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1
                  className={`text-xl font-bold text-green-400 ${
                    glitchActive || showTitleGlitch ? "animate-pulse" : ""
                  } ${showTitleGlitch ? "glitch-text" : ""}`}
                  style={showTitleGlitch ? {
                    textShadow: '2px 0 #ff0000, -2px 0 #00ff00',
                    animation: 'glitch 0.3s infinite'
                  } : {}}
                >
                  {showTitleGlitch ? 
                    (Math.random() < 0.3 ? "l@in_driv3://" : "lain_drive://") : 
                    "lain_drive://"
                  }
                </h1>
                <Badge
                  variant="outline"
                  className="border-green-400/50 text-xs text-green-400/70"
                >
                  connected
                </Badge>
              </div>

              <Dialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="border border-green-400/30 text-sm text-green-400/80 transition-all duration-200 hover:border-green-400/50 hover:bg-green-400/10 hover:text-green-400"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-green-400/30 bg-black/95 text-green-400">
                  <DialogHeader>
                    <DialogTitle className="text-green-400">
                      upload_file
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      className="border-green-400/30 bg-black/50 text-green-400 file:mr-4 file:rounded file:border file:border-green-400/30 file:bg-green-400/10 file:px-4 file:py-2 file:text-green-400 file:transition-colors file:hover:bg-green-400/20"
                      multiple
                    />
                    <Button
                      className="w-full border border-green-400/30 bg-green-400/10 text-green-400 transition-all duration-200 hover:border-green-400/50 hover:bg-green-400/20"
                      variant="ghost"
                    >
                      execute
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Breadcrumbs */}
            <nav className="mt-3 flex items-center space-x-2 text-sm text-green-400/70">
              <button
                onClick={handleGoUp}
                className="flex items-center space-x-1 transition-colors hover:text-green-400"
              >
                <Home className="h-3 w-3" />
                <span>~</span>
              </button>

              {getBreadcrumbs.map((segment, _index) => (
                <React.Fragment key={segment.id}>
                  <ChevronRight className="h-3 w-3 text-green-400/40" />
                  <button
                    onClick={() => navigateToFolder(segment.id)} // Navigate using the folder's ID
                    className="transition-colors hover:text-green-400"
                  >
                    {segment.name}
                  </button>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </header>

        {/* ASCII Art Lain for Level 4 */}
        {showLainArt && (
          <div className="relative z-10 p-4 border-b border-green-400/20">
            <pre className="text-green-500 text-xs font-mono leading-none animate-pulse opacity-80">
{`
⠀⠀⠀⠀⠀⠀⣠⣴⣶⣶⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

                    L A I N   I S   E V E R Y W H E R E
                    Y O U   A R E   L A I N . . .
                    L A I N   I S   Y O U . . .
`}
            </pre>
          </div>
        )}

        {/* Main Content */}
        <main className="p-6">
          <div className="overflow-hidden rounded-sm border border-green-400/20 bg-black/40 backdrop-blur-sm">
            {/* List Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-green-400/10 bg-green-400/5 px-4 py-2 text-xs text-green-400/60">
              <div className="col-span-6">name</div>
              <div className="col-span-2">size</div>
              <div className="col-span-3">modified</div>
              <div className="col-span-1"></div>
            </div>

            {/* File List */}
            <div className="divide-y divide-green-400/10">
              {currentItems.map((item) => {
                const isCorrupted =
                  (item.corrupted ?? false) &&
                  (corruptionActive[item.id] ?? false);
                const corruptedName = item.corrupted
                  ? corruptText(
                      item.name,
                      item.corruptionLevel ?? 1,
                      isCorrupted,
                    )
                  : item.name;

                const isFile = item.type === "file";
                const corruptedSize =
                  isFile && item.corrupted && item.size
                    ? corruptText(
                        item.size,
                        item.corruptionLevel ?? 1,
                        isCorrupted,
                      )
                    : isFile
                      ? item.size
                      : "-";
                const corruptedDate = item.corrupted
                  ? corruptText(
                      item.modified,
                      item.corruptionLevel ?? 1,
                      isCorrupted,
                    )
                  : item.modified;

                return (
                  <div
                    key={item.id}
                    className={`group grid cursor-pointer grid-cols-12 gap-4 px-4 py-3 transition-colors hover:bg-green-400/5 ${
                      selectedItems.includes(item.id) ? "bg-green-400/10" : ""
                    } ${glitchActive && Math.random() < 0.3 ? "animate-pulse" : ""} ${
                      isCorrupted ? "bg-red-500/5" : ""
                    }`}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <div className="col-span-6 flex items-center space-x-3">
                      <div
                        className={`text-green-400/60 ${isCorrupted ? "animate-pulse" : ""}`}
                      >
                        {item.type === "folder" ? (
                          <Folder className="h-4 w-4" />
                        ) : (
                          getFileIcon(item.fileType)
                        )}
                      </div>
                      {item.type === "folder" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToFolder(item.id);
                          }}
                          className={`text-sm text-green-400 transition-colors hover:text-green-300 ${getCorruptionClasses(item.corruptionLevel ?? 0, isCorrupted)}`}
                        >
                          {corruptedName}/
                        </button>
                      ) : (
                        <a
                          href={item.url}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Easter egg: Special file click messages
                            if (item.name === "navi.exe") {
                              console.log("🤖 Navi activated. I am here.");
                              if (item.corrupted) {
                                console.log(
                                  "⚠️ WARNING: Navi executable appears corrupted. Proceed with caution.",
                                );
                              }
                            } else if (
                              item.name === "present_day_present_time.txt"
                            ) {
                              console.log(
                                '📝 "Present day... Present time... Ahahahaha!"',
                              );
                            } else if (item.corrupted) {
                              console.log(
                                `⚠️ File ${item.name} shows signs of data corruption.`,
                              );
                            }
                          }}
                          className={`text-sm text-green-400/80 transition-colors hover:text-green-400 hover:underline ${getCorruptionClasses(item.corruptionLevel ?? 0, isCorrupted)}`}
                        >
                          {corruptedName}
                        </a>
                      )}
                      {item.corrupted && (
                        <span className="animate-pulse text-xs text-red-400/60">
                          ⚠
                        </span>
                      )}
                    </div>

                    <div
                      className={`col-span-2 flex items-center font-mono text-sm text-green-400/60 ${getCorruptionClasses(item.corruptionLevel ?? 0, isCorrupted)}`}
                    >
                      {corruptedSize ?? "-"}
                    </div>

                    <div
                      className={`col-span-3 flex items-center font-mono text-sm text-green-400/60 ${getCorruptionClasses(item.corruptionLevel ?? 0, isCorrupted)}`}
                    >
                      {corruptedDate}
                    </div>

                    <div className="col-span-1 flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-green-400/60 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-green-400/10 hover:text-green-400"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="border-green-400/30 bg-black/95 text-green-400">
                          {item.type === "file" && (
                            <DropdownMenuItem className="text-sm hover:bg-green-400/10">
                              <Download className="mr-2 h-3 w-3" />
                              download
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-sm hover:bg-green-400/10">
                            <Edit className="mr-2 h-3 w-3" />
                            rename
                          </DropdownMenuItem>
                          {item.corrupted && (
                            <DropdownMenuItem 
                              className="text-sm hover:bg-yellow-400/10 hover:text-yellow-400"
                              onClick={() => {
                                onRepairAttempt?.();
                                console.log("🔧 Attempting to repair file:", item.name);
                              }}
                            >
                              <Code className="mr-2 h-3 w-3" />
                              repair
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-sm hover:bg-red-400/10 hover:text-red-400">
                            <Trash2 className="mr-2 h-3 w-3" />
                            delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>

            {currentItems.length === 0 && (
              <div className="px-4 py-12 text-center">
                <div className="text-sm text-green-400/60">empty directory</div>
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="mt-4 flex items-center justify-between text-xs text-green-400/40">
            <div>
              {currentItems.length} items
              {selectedItems.length > 0 &&
                ` • ${selectedItems.length} selected`}
              {currentItems.some((item) => item.corrupted) && (
                <span className="ml-2 text-red-400/60">
                  • corrupted files detected
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="h-1 w-1 animate-pulse rounded-full bg-green-400" />
                <span>online</span>
              </div>
              <div className="font-mono">
                {getBreadcrumbs.map((crumb) => crumb.name).join("/")}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
