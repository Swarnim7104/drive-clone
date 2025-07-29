export interface FileItem {
  id: string;
  name: string;
  type: "file";
  parentId: string;
  size: string;
  modified: string;
  fileType: string;
  url: string;
  corrupted?: boolean;
  corruptionLevel?: number;
}

export type Folder = {
  id: string;
  name: string;
  type: "folder";
  parentId: string | null;
  modified: string;
  corrupted?: boolean;
  corruptionLevel?: number;
};

export const mockFolders: Folder[] = [
  {
    id: "root",
    name: "lain_drive://",
    type: "folder",
    parentId: null,
    modified: "",
  },

  // Normal folders for level 1 (clean state)
  {
    id: "normal_1",
    name: "Documents",
    type: "folder",
    parentId: "root",
    modified: "2024.01.15",
  },
  {
    id: "normal_2", 
    name: "Images",
    type: "folder",
    parentId: "root",
    modified: "2024.01.12",
  },
  {
    id: "normal_3",
    name: "Work Files",
    type: "folder", 
    parentId: "root",
    modified: "2024.01.10",
  },

  // Lain/corrupted folders for level 2+ (corruption state)
  {
    id: "1",
    name: "wired",
    type: "folder",
    parentId: "root",
    modified: "1998.07.06",
  },
  {
    id: "2",
    name: "cyberia",
    type: "folder",
    parentId: "root",
    modified: "1998.07.05",
  },
  {
    id: "3",
    name: "knights_of_eastern_calculus",
    type: "folder",
    parentId: "root",
    modified: "1998.07.04",
  },
  {
    id: "4",
    name: "protocol_7",
    type: "folder",
    parentId: "root",
    modified: "1998.07.03",
    corrupted: true,
    corruptionLevel: 1,
  },
  {
    id: "8",
    name: "layer_01",
    type: "folder",
    parentId: "1",
    modified: "1998.06.29",
  },
  {
    id: "9",
    name: "layer_02",
    type: "folder",
    parentId: "1",
    modified: "1998.06.28",
  },
  {
    id: "10",
    name: "layer_13",
    type: "folder",
    parentId: "1",
    modified: "1998.06.27",
    corrupted: true,
    corruptionLevel: 3,
  },

  {
    id: "13",
    name: "rave_kids",
    type: "folder",
    parentId: "2",
    modified: "1998.06.24",
  },

  {
    id: "17",
    name: "masami_eiri",
    type: "folder",
    parentId: "3",
    modified: "1998.06.20",
    corrupted: true,
    corruptionLevel: 2,
  },
  {
    id: "18",
    name: "tachibana_labs",
    type: "folder",
    parentId: "3",
    modified: "1998.06.19",
  },
];
export const mockFiles: FileItem[] = [
  // --- NORMAL FILES FOR LEVEL 1 (clean state) ---
  {
    id: "normal_file_1",
    name: "Meeting Notes.docx",
    type: "file",
    parentId: "root",
    size: "245 KB",
    modified: "2024.01.15",
    fileType: "document",
    url: "#",
  },
  {
    id: "normal_file_2", 
    name: "Quarterly Report.pdf",
    type: "file",
    parentId: "root",
    size: "1.2 MB",
    modified: "2024.01.12",
    fileType: "pdf",
    url: "#",
  },
  {
    id: "normal_file_3",
    name: "Budget Spreadsheet.xlsx",
    type: "file",
    parentId: "root", 
    size: "89 KB",
    modified: "2024.01.10",
    fileType: "spreadsheet",
    url: "#",
  },

  // --- LAIN/CORRUPTED FILES FOR LEVEL 2+ (corruption state) ---
  // ROOT LEVEL ITEMS (parentId: 'root-drive')
  // The primary "My Drive" equivalent folder

  // Items previously under "/" now have parentId: "root-drive"
  {
    id: "5",
    name: "present_day_present_time.txt",
    type: "file",
    parentId: "root",
    size: "1.33 KB",
    modified: "1998.07.02",
    fileType: "text",
    url: "#",
  },
  {
    id: "6",
    name: "bear_suit.jpg",
    type: "file",
    parentId: "root",
    size: "2.4 MB",
    modified: "1998.07.01",
    fileType: "image",
    url: "#",
  },
  {
    id: "7",
    name: "navi.exe",
    type: "file",
    parentId: "root",
    size: "666 KB",
    modified: "1998.06.30",
    fileType: "code",
    url: "#",
    corrupted: true,
    corruptionLevel: 2,
  },

  // --- ITEMS UNDER "/wired" (parentId: "1") ---
  {
    id: "11",
    name: "god_in_the_wired.md",
    type: "file",
    parentId: "1",
    size: "4.7 KB",
    modified: "1998.06.26",
    fileType: "text",
    url: "#",
    corrupted: true,
    corruptionLevel: 2,
  },
  {
    id: "12",
    name: "close_the_world.wav",
    type: "file",
    parentId: "1",
    size: "13.3 MB",
    modified: "1998.06.25",
    fileType: "audio",
    url: "#",
  },

  // --- ITEMS UNDER "/cyberia" (parentId: "2") ---
  {
    id: "14",
    name: "accela.zip",
    type: "file",
    parentId: "2",
    size: "7.77 MB",
    modified: "1998.06.23",
    fileType: "archive",
    url: "#",
    corrupted: true,
    corruptionLevel: 1,
  },
  {
    id: "15",
    name: "psyche_processor.dll",
    type: "file",
    parentId: "2",
    size: "512 KB",
    modified: "1998.06.22",
    fileType: "code",
    url: "#",
    corrupted: true,
    corruptionLevel: 3,
  },
  {
    id: "16",
    name: "reality_distortion.glsl",
    type: "file",
    parentId: "2",
    size: "2.1 KB",
    modified: "1998.06.21",
    fileType: "code",
    url: "#",
  },

  // --- ITEMS UNDER "/knights_of_eastern_calculus" (parentId: "3") ---
  {
    id: "19",
    name: "schumann_resonance.dat",
    type: "file",
    parentId: "3",
    size: "8.88 MB",
    modified: "1998.06.18",
    fileType: "text",
    url: "#",
  },
  {
    id: "20",
    name: "love_machine.exe",
    type: "file",
    parentId: "3",
    size: "1.21 MB",
    modified: "1998.06.17",
    fileType: "code",
    url: "#",
    corrupted: true,
    corruptionLevel: 1,
  },

  // --- ITEMS UNDER "/protocol_7" (parentId: "4") ---
  {
    id: "21",
    name: "ipv7_implementation.c",
    type: "file",
    parentId: "4",
    size: "15.5 KB",
    modified: "1998.06.16",
    fileType: "code",
    url: "#",
    corrupted: true,
    corruptionLevel: 3,
  },
  {
    id: "22",
    name: "network_topology.svg",
    type: "file",
    parentId: "4",
    size: "3.3 KB",
    modified: "1998.06.15",
    fileType: "image",
    url: "#",
  },
  {
    id: "23",
    name: "omnipresence_protocol.pdf",
    type: "file",
    parentId: "4",
    size: "2.22 MB",
    modified: "1998.06.14",
    fileType: "text",
    url: "#",
    corrupted: true,
    corruptionLevel: 2,
  },

  // --- Further Nested Items (Example - you can add more based on your full structure) ---
  // If you had items inside 'layer_01' (which has id: "8"), they would have parentId: "8"
  // { id: "24", name: "sub_layer_file.txt", type: "file", parentId: "8", size: "0.1 MB", modified: "1998.06.13", fileType: "text", url: "#" },
];
