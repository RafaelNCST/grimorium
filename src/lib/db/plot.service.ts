import { IPlotArc, IPlotEvent } from "@/types/plot-types";

import { DBPlotArc, DBPlotEvent } from "./types";

import { getDB } from "./index";

// Convert IPlotArc to DBPlotArc
function arcToDBPlotArc(bookId: string, arc: IPlotArc): DBPlotArc {
  return {
    id: arc.id,
    book_id: bookId,
    name: arc.name,
    size: arc.size,
    focus: arc.focus,
    description: arc.description,
    progress: arc.progress,
    status: arc.status,
    order_index: arc.order,
    important_characters: arc.importantCharacters
      ? JSON.stringify(arc.importantCharacters)
      : undefined,
    important_factions: arc.importantFactions
      ? JSON.stringify(arc.importantFactions)
      : undefined,
    important_items: arc.importantItems
      ? JSON.stringify(arc.importantItems)
      : undefined,
    arc_message: arc.arcMessage,
    world_impact: arc.worldImpact,
    created_at: Date.now(),
    updated_at: Date.now(),
  };
}

// Convert DBPlotArc to IPlotArc
function dbPlotArcToArc(dbArc: DBPlotArc, events: IPlotEvent[]): IPlotArc {
  return {
    id: dbArc.id,
    name: dbArc.name,
    size: dbArc.size as IPlotArc["size"],
    focus: dbArc.focus,
    description: dbArc.description,
    progress: dbArc.progress,
    status: dbArc.status as IPlotArc["status"],
    order: dbArc.order_index,
    events,
    importantCharacters: dbArc.important_characters
      ? JSON.parse(dbArc.important_characters)
      : [],
    importantFactions: dbArc.important_factions
      ? JSON.parse(dbArc.important_factions)
      : [],
    importantItems: dbArc.important_items
      ? JSON.parse(dbArc.important_items)
      : [],
    arcMessage: dbArc.arc_message,
    worldImpact: dbArc.world_impact,
  };
}

// Convert IPlotEvent to DBPlotEvent
function eventToDBPlotEvent(arcId: string, event: IPlotEvent): DBPlotEvent {
  return {
    id: event.id,
    arc_id: arcId,
    name: event.name,
    description: event.description,
    completed: event.completed ? 1 : 0,
    order_index: event.order,
    created_at: Date.now(),
  };
}

// Convert DBPlotEvent to IPlotEvent
function dbPlotEventToEvent(dbEvent: DBPlotEvent): IPlotEvent {
  return {
    id: dbEvent.id,
    name: dbEvent.name,
    description: dbEvent.description,
    completed: dbEvent.completed === 1,
    order: dbEvent.order_index,
  };
}

// Get all arcs for a book
export async function getPlotArcsByBookId(bookId: string): Promise<IPlotArc[]> {
  const db = await getDB();
  const arcsResult = await db.select<DBPlotArc[]>(
    "SELECT * FROM plot_arcs WHERE book_id = $1 ORDER BY order_index ASC",
    [bookId]
  );

  const arcs: IPlotArc[] = [];

  for (const dbArc of arcsResult) {
    const eventsResult = await db.select<DBPlotEvent[]>(
      "SELECT * FROM plot_events WHERE arc_id = $1 ORDER BY order_index ASC",
      [dbArc.id]
    );
    const events = eventsResult.map(dbPlotEventToEvent);
    arcs.push(dbPlotArcToArc(dbArc, events));
  }

  return arcs;
}

// Get a single arc by ID
export async function getPlotArcById(arcId: string): Promise<IPlotArc | null> {
  const db = await getDB();
  const arcResult = await db.select<DBPlotArc[]>(
    "SELECT * FROM plot_arcs WHERE id = $1",
    [arcId]
  );

  if (arcResult.length === 0) return null;

  const eventsResult = await db.select<DBPlotEvent[]>(
    "SELECT * FROM plot_events WHERE arc_id = $1 ORDER BY order_index ASC",
    [arcId]
  );

  const events = eventsResult.map(dbPlotEventToEvent);
  return dbPlotArcToArc(arcResult[0], events);
}

// Create a new arc
export async function createPlotArc(
  bookId: string,
  arc: IPlotArc
): Promise<void> {
  const db = await getDB();
  const dbArc = arcToDBPlotArc(bookId, arc);

  await db.execute(
    `INSERT INTO plot_arcs (
      id, book_id, name, size, focus, description, progress, status,
      order_index, important_characters, important_factions, important_items,
      arc_message, world_impact, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
    [
      dbArc.id,
      dbArc.book_id,
      dbArc.name,
      dbArc.size,
      dbArc.focus,
      dbArc.description,
      dbArc.progress,
      dbArc.status,
      dbArc.order_index,
      dbArc.important_characters,
      dbArc.important_factions,
      dbArc.important_items,
      dbArc.arc_message,
      dbArc.world_impact,
      dbArc.created_at,
      dbArc.updated_at,
    ]
  );

  // Insert events
  for (const event of arc.events) {
    const dbEvent = eventToDBPlotEvent(arc.id, event);
    await db.execute(
      `INSERT INTO plot_events (id, arc_id, name, description, completed, order_index, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        dbEvent.id,
        dbEvent.arc_id,
        dbEvent.name,
        dbEvent.description,
        dbEvent.completed,
        dbEvent.order_index,
        dbEvent.created_at,
      ]
    );
  }
}

// Update an arc
export async function updatePlotArc(
  arcId: string,
  updates: Partial<IPlotArc>
): Promise<void> {
  const db = await getDB();
  const now = Date.now();

  // Get current arc to preserve book_id
  const current = await db.select<DBPlotArc[]>(
    "SELECT book_id FROM plot_arcs WHERE id = $1",
    [arcId]
  );

  if (current.length === 0) {
    throw new Error("Arc not found");
  }

  // Build a full arc object from updates
  const fullArc: IPlotArc = {
    id: arcId,
    name: updates.name || "",
    size: updates.size || "médio",
    focus: updates.focus || "",
    description: updates.description || "",
    progress: updates.progress || 0,
    status: updates.status || "planejamento",
    order: updates.order || 0,
    events: updates.events || [],
    importantCharacters: updates.importantCharacters || [],
    importantFactions: updates.importantFactions || [],
    importantItems: updates.importantItems || [],
    arcMessage: updates.arcMessage,
    worldImpact: updates.worldImpact,
  };

  const dbArc = arcToDBPlotArc(current[0].book_id, fullArc);
  dbArc.updated_at = now;

  await db.execute(
    `UPDATE plot_arcs SET
      name = $1, size = $2, focus = $3, description = $4, progress = $5,
      status = $6, order_index = $7, important_characters = $8,
      important_factions = $9, important_items = $10, arc_message = $11,
      world_impact = $12, updated_at = $13
    WHERE id = $14`,
    [
      dbArc.name,
      dbArc.size,
      dbArc.focus,
      dbArc.description,
      dbArc.progress,
      dbArc.status,
      dbArc.order_index,
      dbArc.important_characters,
      dbArc.important_factions,
      dbArc.important_items,
      dbArc.arc_message,
      dbArc.world_impact,
      dbArc.updated_at,
      arcId,
    ]
  );

  // Update events if provided
  if (updates.events !== undefined) {
    // Delete existing events
    await db.execute("DELETE FROM plot_events WHERE arc_id = $1", [arcId]);

    // Insert new events
    for (const event of updates.events) {
      const dbEvent = eventToDBPlotEvent(arcId, event);
      await db.execute(
        `INSERT INTO plot_events (id, arc_id, name, description, completed, order_index, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          dbEvent.id,
          dbEvent.arc_id,
          dbEvent.name,
          dbEvent.description,
          dbEvent.completed,
          dbEvent.order_index,
          dbEvent.created_at,
        ]
      );
    }
  }
}

// Delete an arc
export async function deletePlotArc(arcId: string): Promise<void> {
  const db = await getDB();
  // Events will be deleted automatically due to CASCADE
  await db.execute("DELETE FROM plot_arcs WHERE id = $1", [arcId]);
}

// Update event completion status
export async function updateEventCompletion(
  eventId: string,
  completed: boolean
): Promise<void> {
  const db = await getDB();
  await db.execute("UPDATE plot_events SET completed = $1 WHERE id = $2", [
    completed ? 1 : 0,
    eventId,
  ]);
}

// Reorder arcs
export async function reorderPlotArcs(
  arcs: Array<{ id: string; order: number }>
): Promise<void> {
  const db = await getDB();

  for (const arc of arcs) {
    await db.execute("UPDATE plot_arcs SET order_index = $1 WHERE id = $2", [
      arc.order,
      arc.id,
    ]);
  }
}

// Reorder events
export async function reorderPlotEvents(
  events: Array<{ id: string; order: number }>
): Promise<void> {
  const db = await getDB();

  for (const event of events) {
    await db.execute("UPDATE plot_events SET order_index = $1 WHERE id = $2", [
      event.order,
      event.id,
    ]);
  }
}
