import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mockData";
import { files, folders } from "~/server/db/schema";

export default function SandboxPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold">Database Seeding Tool</h1>
      <p>Use this page to seed the database with mock data for testing.</p>
      
      <form
        action={async () => {
          "use server";

          console.log("Seeding database with mock data...");

          try {
            // First insert folders, starting with root
            const folderInsert = await db.insert(folders).values(
              mockFolders.filter(f => f.id !== "root").map((folder, index) => ({
                name: folder.name,
                parent: folder.parentId && folder.parentId !== "root" ? BigInt(1) : null,
                corrupted: folder.corrupted ? 1 : 0,
                corruptionLevel: folder.corruptionLevel || 0,
                modified: folder.modified,
              })),
            );
            console.log("Inserted folders:", folderInsert);

            // Then insert files
            const fileInsert = await db.insert(files).values(
              mockFiles.map((file, index) => ({
                name: file.name,
                size: parseInt(file.size.replace(/[^\d]/g, '')) || 1000, // Extract numbers from size string
                url: file.url,
                parent: BigInt((index % 3) + 1), // Assign files to folders in a round-robin manner
                corrupted: file.corrupted ? 1 : 0,
                corruptionLevel: file.corruptionLevel || 0,
                fileType: file.fileType,
                modified: file.modified,
              })),
            );
            console.log("Inserted files:", fileInsert);

            console.log("✅ Database seeding completed successfully!");
          } catch (error) {
            console.error("❌ Error seeding database:", error);
          }
        }}
      >
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Seed Database
        </button>
      </form>
    </div>
  );
}
