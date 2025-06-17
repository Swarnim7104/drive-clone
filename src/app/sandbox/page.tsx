import { db } from "~/server/db";
import { mockFolders, mockFiles } from "~/lib/mockData";

export default function SandBoxPage() {
  return (
    <div className="flex flex-col gap-4">
      Seed Function
      <form
        action={async () => {
          "use server";
          console.log("yo whatsup");
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
