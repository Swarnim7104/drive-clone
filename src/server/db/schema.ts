import "server-only";

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
    corrupted: int("corrupted").default(0), // 0 = normal, 1+ = corruption levels
    corruptionLevel: int("corruption_level").default(0),
    fileType: text("file_type"),
    modified: text("modified"),
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
    corrupted: int("corrupted").default(0),
    corruptionLevel: int("corruption_level").default(0),
    modified: text("modified"),
  },
  (t) => {
    return [index("parent_index").on(t.parent)];
  },
);
