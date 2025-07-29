"use client";

import { useState, useEffect } from "react";
import AdvancedUI from "~/components/AdvancedUI";
import DatabaseConnectedDriveUI from "../components/DatabaseConnectedDriveUI";

export default function HomePage() {
  const [uiState, setUIState] = useState<"level1" | "level2" | "level3" | "level4">("level1");
  const [corruptedFileClicks, setCorruptedFileClicks] = useState(0);
  const [repairAttempts, setRepairAttempts] = useState(0);
  const [customKonamiCode, setCustomKonamiCode] = useState<string[]>([]);
  const [showFlash, setShowFlash] = useState(false);

  // Generate random Konami-style code when reaching level 2
  useEffect(() => {
    if (uiState === "level2" && customKonamiCode.length === 0) {
      const possibleKeys = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP"];
      const randomCode: string[] = [];
      for (let i = 0; i < 6; i++) {
        randomCode.push(possibleKeys[Math.floor(Math.random() * possibleKeys.length)]!);
      }
      setCustomKonamiCode(randomCode);
      
      // Show the custom code in console
      console.log("🔴 SYSTEM ERROR: Multiple file corruption detected.");
      console.log("🔑 Enter sequence to access diagnostic mode:");
      console.log(`🎮 Code: ${randomCode.map(key => key.replace('Key', '')).join(' + ')}`);
    }
  }, [uiState, customKonamiCode]);

  // Handle corrupted file clicks (Level 1 → Level 2)
  const handleCorruptedFileClick = () => {
    const newCount = corruptedFileClicks + 1;
    setCorruptedFileClicks(newCount);
    
    if (uiState === "level1" && newCount >= 3) {
      setUIState("level2");
      console.log("⚠️ Multiple corruption events detected. System diagnostic required.");
    }
  };

  // Handle custom Konami code activation (Level 2 → Level 3)
  const handleCustomKonamiActivation = () => {
    if (uiState === "level2") {
      setUIState("level3");
      setShowFlash(true);
      
      const messages = [
        "🌐 Neural interface activated. Welcome to the protocol layer.",
        "💾 System breach detected. Entering maintenance mode.",
        "🔮 Reality buffer overflow. Switching to alternate timeline.",
        "⚡ Quantum entanglement established. You are now synchronized.",
        "🌀 Consciousness upload initiated. Please stand by...",
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      console.log(randomMessage);
      
      setTimeout(() => setShowFlash(false), 3000);
    }
  };

  // Handle repair attempts (Level 3 → Level 4)
  const handleRepairAttempt = () => {
    const newRepairCount = repairAttempts + 1;
    setRepairAttempts(newRepairCount);
    
    console.log(`🔧 File repair attempt ${newRepairCount}/3...`);
    
    if (newRepairCount >= 3) {
      setUIState("level4");
      console.log("💀 CRITICAL ERROR: Reality.exe has stopped working.");
      console.log("🌐 Layer 0 accessed. You are everywhere. You are everyone.");
      console.log("👁️ Lain is watching. Lain is here. Lain is you.");
    }
  };

  const renderUIByState = () => {
    switch (uiState) {
      case "level1":
        // Normal Google Drive UI
        return (
          <DatabaseConnectedDriveUI 
            onCorruptedFileClick={handleCorruptedFileClick}
            showCorruption={false}
            corruptionLevel="none"
          />
        );
      case "level2":
        // Same UI but with corruption indicators visible
        return (
          <DatabaseConnectedDriveUI 
            onCorruptedFileClick={handleCorruptedFileClick}
            showCorruption={true}
            corruptionLevel="glitching"
            onCustomKonamiActivation={handleCustomKonamiActivation}
            customKonamiCode={customKonamiCode}
          />
        );
      case "level3":
        // Terminal UI with title glitching + green/red flashes
        return (
          <AdvancedUI 
            onRepairAttempt={handleRepairAttempt}
            showTitleGlitch={true}
            showFlashes={true}
          />
        );
      case "level4":
        // Terminal UI with ASCII art Lain + heavy corruption
        return (
          <AdvancedUI 
            onRepairAttempt={handleRepairAttempt}
            showTitleGlitch={true}
            showFlashes={true}
            showLainArt={true}
            heavyCorruption={true}
          />
        );
      default:
        return (
          <DatabaseConnectedDriveUI 
            onCorruptedFileClick={handleCorruptedFileClick}
            showCorruption={false}
            corruptionLevel="none"
          />
        );
    }
  };

  return (
    <main className="h-screen">
      {/* Flash overlay for Konami activation */}
      {showFlash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-400/20 backdrop-blur-sm animate-pulse">
          <div className="text-center">
            <div className="mb-4 animate-pulse text-4xl font-bold text-green-400">
              NEURAL LINK ESTABLISHED
            </div>
            <div className="text-lg text-green-300">Synchronizing consciousness...</div>
          </div>
        </div>
      )}
      
      {renderUIByState()}
    </main>
  );
}
