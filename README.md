# 🌐 Drive Clone - Serial Experiments Lain Edition

A sophisticated Google Drive clone with hidden corruption mechanics inspired by Serial Experiments Lain.

## ✨ Features

### 🎭 Four-State UI System
1. **Clean Mode** - Normal Google Drive interface
2. **Subtle Corruption** - Minor visual corruption indicators
3. **Advanced Mode** - Terminal-style green interface (Konami code activated)
4. **Destroyed Mode** - Heavy corruption with ASCII art and system breakdown

### 🗄️ Database Integration
- **Primary**: SingleStore cloud database
- **Fallback**: Mock data system when database unavailable
- Real file upload with corruption probability (30% chance)
- CRUD operations for files and folders
- Corruption level tracking (0-3)

### 🔧 API Endpoints
- `GET /api/folder-contents?parent={id}` - Fetch folder contents
- `POST /api/upload` - Upload files with corruption tracking
- `GET /api/test-db` - Database connection testing
- Full REST API for files and folders

### 🎮 Easter Eggs & Progression
- **Konami Code**: ↑↑↓↓←→←→BA activates advanced mode
- **Stealth Progression**: Clicking corrupted files triggers state changes
- **Repair System**: Failed repair attempts lead to system destruction
- Hidden Lain-themed file structure and console messages

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Configure your SingleStore credentials

# Start development server
pnpm dev

# Open browser
open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main entry with 4-state system
│   ├── sandbox/page.tsx      # Database seeding tool
│   └── api/                  # REST API endpoints
├── components/
│   ├── DatabaseConnectedDriveUI.tsx  # Main drive interface
│   ├── SubtleCorruptionUI.tsx        # State 2 UI
│   ├── AdvancedUI.tsx               # State 3 UI (terminal)
│   ├── DestroyedUI.tsx              # State 4 UI (corrupted)
│   └── ui/                          # Shadcn components
├── lib/
│   ├── mockData.ts           # Lain-themed mock data
│   └── corruptionEffects.ts  # Text corruption algorithms
└── server/db/
    ├── schema.ts             # Database schema
    ├── queries.ts            # Database operations
    └── index.ts              # Connection management
```

## 🎯 Current Status

### ✅ COMPLETED
- [x] Database schema with corruption tracking
- [x] Four-state UI system implementation
- [x] Fallback system for database failures
- [x] Real file upload with corruption probability
- [x] Stealth progression system
- [x] Konami code detection
- [x] Terminal-style UI for advanced mode
- [x] ASCII art integration for destroyed mode
- [x] Complete REST API with fallback support

### 🚧 IN PROGRESS  
- [ ] URL-based folder navigation persistence
- [ ] File preview system with corruption effects
- [ ] Advanced visual corruption animations
- [ ] Authentication system

### 📋 TODO
- [ ] File sharing with proper links
- [ ] Search functionality across database  
- [ ] Screen distortion effects
- [ ] Color channel separation animations
- [ ] NAVI filesystem hidden layer

## 🗃️ Database Schema

### Files Table
```sql
files_table:
  - id: BigInt (auto-increment)
  - name: Text
  - size: Int
  - url: Text  
  - parent: BigInt (foreign key)
  - corrupted: Int (0-1)
  - corruptionLevel: Int (0-3)
  - fileType: Text
  - modified: Text
```

### Folders Table
```sql
folders_table:
  - id: BigInt (auto-increment)
  - name: Text
  - parent: BigInt (nullable)
  - corrupted: Int (0-1)
  - corruptionLevel: Int (0-3)
  - modified: Text
```

## 🎮 How to Trigger States

1. **Clean → Subtle**: Click 3+ corrupted files
2. **Clean → Advanced**: Enter Konami code (↑↑↓↓←→←→BA)
3. **Advanced → Destroyed**: Attempt 3+ file repairs
4. **Subtle → Advanced**: Click 5+ corrupted files

## 🌐 The Wired Integration

### Lain-Themed Content
- Folders: `wired`, `cyberia`, `knights_of_eastern_calculus`, `protocol_7`
- Files: `navi.exe`, `present_day_present_time.txt`, `bear_suit.jpg`
- Console messages with Lain references
- ASCII art in destroyed mode

### Corruption System
- **Level 1**: Basic character replacement (@, 3, 1, 0, $, 7)
- **Level 2**: Unicode glitch characters (ḩ, ë̴, l̶, ṗ̆)  
- **Level 3**: Heavy corruption symbols (█, ▓, ▒, ░, ╫, ╪)

## 🔧 Development

### Database Seeding
Visit `/sandbox` to seed the database with Lain-themed mock data.

### Testing
```bash
# Test database connection
curl http://localhost:3000/api/test-db

# Test folder contents
curl "http://localhost:3000/api/folder-contents?parent=root"

# Upload test file
curl -F "file=@test.txt" -F "parentId=root" http://localhost:3000/api/upload
```

## 🎨 Technical Features

- **TypeScript** with strict type checking
- **Next.js 15** with Turbopack
- **Drizzle ORM** for database operations
- **SingleStore** cloud database
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **Graceful fallback** system for offline operation

---

*"Present day... Present time... Ahahahaha!"*

🌐 **You have accessed Layer 14. Welcome to the Wired.**
