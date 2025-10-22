import { IRaceGroup } from "@/pages/dashboard/tabs/races/types/race-types";

import { DBRaceGroup } from "./types";

import { getDB } from "./index";

// Convert IRaceGroup to DBRaceGroup
function raceGroupToDBRaceGroup(
  bookId: string,
  raceGroup: Omit<IRaceGroup, "races">
): DBRaceGroup {
  return {
    id: raceGroup.id,
    book_id: bookId,
    name: raceGroup.name,
    description: raceGroup.description,
    order_index: raceGroup.orderIndex,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
}

// Convert DBRaceGroup to IRaceGroup (without races - will be populated later)
function dbRaceGroupToRaceGroup(
  dbRaceGroup: DBRaceGroup
): Omit<IRaceGroup, "races"> {
  return {
    id: dbRaceGroup.id,
    name: dbRaceGroup.name,
    description: dbRaceGroup.description,
    orderIndex: dbRaceGroup.order_index,
  };
}

export async function getRaceGroupsByBookId(
  bookId: string
): Promise<Omit<IRaceGroup, "races">[]> {
  const db = await getDB();
  const result = await db.select<DBRaceGroup[]>(
    "SELECT * FROM race_groups WHERE book_id = $1 ORDER BY order_index ASC, created_at DESC",
    [bookId]
  );
  return result.map(dbRaceGroupToRaceGroup);
}

export async function getRaceGroupById(
  id: string
): Promise<Omit<IRaceGroup, "races"> | null> {
  const db = await getDB();
  const result = await db.select<DBRaceGroup[]>(
    "SELECT * FROM race_groups WHERE id = $1",
    [id]
  );
  return result.length > 0 ? dbRaceGroupToRaceGroup(result[0]) : null;
}

export async function createRaceGroup(
  bookId: string,
  raceGroup: Omit<IRaceGroup, "races">
): Promise<void> {
  const db = await getDB();
  const dbRaceGroup = raceGroupToDBRaceGroup(bookId, raceGroup);

  await db.execute(
    `INSERT INTO race_groups (
      id, book_id, name, description, order_index, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7
    )`,
    [
      dbRaceGroup.id,
      dbRaceGroup.book_id,
      dbRaceGroup.name,
      dbRaceGroup.description,
      dbRaceGroup.order_index,
      dbRaceGroup.created_at,
      dbRaceGroup.updated_at,
    ]
  );
}

export async function updateRaceGroup(
  id: string,
  updates: Partial<Omit<IRaceGroup, "id" | "races">>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Get current race group to preserve book_id
  const current = await db.select<DBRaceGroup[]>(
    "SELECT book_id FROM race_groups WHERE id = $1",
    [id]
  );

  if (current.length === 0) {
    throw new Error("Race group not found");
  }

  // Build full race group object from updates
  const fullRaceGroup: Omit<IRaceGroup, "races"> = {
    id,
    name: updates.name || "",
    description: updates.description || "",
    orderIndex: updates.orderIndex ?? 0,
    ...updates,
  };

  const dbRaceGroup = raceGroupToDBRaceGroup(current[0].book_id, fullRaceGroup);
  dbRaceGroup.updated_at = now;

  await db.execute(
    `UPDATE race_groups SET
      name = $1, description = $2, order_index = $3, updated_at = $4
    WHERE id = $5`,
    [
      dbRaceGroup.name,
      dbRaceGroup.description,
      dbRaceGroup.order_index,
      dbRaceGroup.updated_at,
      id,
    ]
  );
}

export async function deleteRaceGroup(id: string): Promise<void> {
  const db = await getDB();

  // First, set group_id to NULL for all races in this group
  await db.execute("UPDATE races SET group_id = NULL WHERE group_id = $1", [id]);

  // Then delete the group
  await db.execute("DELETE FROM race_groups WHERE id = $1", [id]);
}

// Reorder race groups
export async function reorderRaceGroups(
  bookId: string,
  groupOrders: Array<{ id: string; orderIndex: number }>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Update all group orders in a transaction-like manner
  for (const { id, orderIndex } of groupOrders) {
    await db.execute(
      "UPDATE race_groups SET order_index = $1, updated_at = $2 WHERE id = $3 AND book_id = $4",
      [orderIndex, now, id, bookId]
    );
  }
}
