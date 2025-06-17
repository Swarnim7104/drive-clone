const corruptChars = [
  "█",
  "▓",
  "▒",
  "░",
  "◆",
  "◇",
  "◈",
  "◉",
  "●",
  "○",
  "▪",
  "▫",
  "■",
  "□",
  "▲",
  "△",
  "▼",
  "▽",
  "◀",
  "▷",
  "◁",
  "▶",
];
const glitchChars = [
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "?",
  "<",
  ">",
  "|",
  "~",
  "`",
];

export const corruptText = (
  text: string,
  level: number,
  isActive: boolean,
): string => {
  if (!isActive) return text;

  let corrupted = text;
  const corruptionRate = level * 0.15; // 15%, 30%, 45% corruption based on level

  for (let i = 0; i < corrupted.length; i++) {
    if (Math.random() < corruptionRate) {
      if (level >= 3) {
        corrupted =
          corrupted.substring(0, i) +
          corruptChars[Math.floor(Math.random() * corruptChars.length)] +
          corrupted.substring(i + 1);
      } else if (level >= 2) {
        corrupted =
          corrupted.substring(0, i) +
          glitchChars[Math.floor(Math.random() * glitchChars.length)] +
          corrupted.substring(i + 1);
      } else {
        // Level 1: just replace with similar looking characters
        const currentChar = corrupted[i];
        if (typeof currentChar === "string") {
          const char = currentChar.toLowerCase();

          const replacements: Record<string, string> = {
            a: "@",
            e: "3",
            i: "1",
            o: "0",
            s: "$",
            t: "7",
            l: "1",
          };
          if (replacements[char]) {
            corrupted =
              corrupted.substring(0, i) +
              replacements[char] +
              corrupted.substring(i + 1);
          }
        }
      }
    }
  }

  return corrupted;
};

export const getCorruptionClasses = (
  level: number,
  isActive: boolean,
): string => {
  if (!isActive) return "";

  const baseClasses = "transition-all duration-100";

  switch (level) {
    case 1:
      return `${baseClasses} text-red-400/80`;
    case 2:
      return `${baseClasses} text-red-400 animate-pulse`;
    case 3:
      return `${baseClasses} text-red-500 animate-pulse bg-red-500/10 px-1 -mx-1 rounded`;
    default:
      return baseClasses;
  }
};
