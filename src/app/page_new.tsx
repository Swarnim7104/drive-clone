"use client";

import { useState, useEffect } from "react";
import { useKonamiCode } from "~/hooks/useKonamiCode";
import SimpleBasicUI from "~/components/SimpleBasicUI";
import AdvancedUI from "~/components/AdvancedUI";

export default function HomePage() {
  const konamiActivated = useKonamiCode();
  const [uiState, setUIState] = useState<"simple" | "advanced">("simple");

  useEffect(() => {
    if (konamiActivated) {
      setUIState("advanced");
    }
  }, [konamiActivated]);

  return (
    <main className="h-screen">
      {uiState === "simple" ? <SimpleBasicUI /> : <AdvancedUI />}
    </main>
  );
}
