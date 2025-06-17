import {
  int,
  bigint,
  text,
  index,
  singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator(
  (name) => `drive-clone_${name}`,
);
export const files = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name"),
    size: int("size"),
    url: text("url"),
    parent: bigint("parent", { mode: "bigint" }).notNull(),
  },
  (t) => {
    return [index("parent_index").on(t.parent)];
  },
);

export const folders = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "bigint" }).primaryKey().autoincrement(),
    name: text("name").notNull(),
    parent: bigint("parent", { mode: "bigint" }),
  },
  (t) => {
    return [index("parent_index").on(t.parent)];
  },
);
