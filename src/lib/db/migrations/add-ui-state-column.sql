-- Migration: Add ui_state column to all entity tables
-- Date: 2026-01-05
-- Purpose: Migrate UI preferences from localStorage to database per-entity

-- Add ui_state to characters table
ALTER TABLE characters ADD COLUMN ui_state TEXT;

-- Add ui_state to regions table (keep section_visibility for backwards compatibility)
ALTER TABLE regions ADD COLUMN ui_state TEXT;

-- Add ui_state to plot_arcs table (keep field_visibility for backwards compatibility)
ALTER TABLE plot_arcs ADD COLUMN ui_state TEXT;

-- Note: factions, items, and races tables are created dynamically in index.ts
-- The CREATE TABLE statements have been updated to include ui_state column from the start.

-- For existing databases, add ui_state to items and races tables
-- Also add missing item_usage column to items table

-- Items table
ALTER TABLE items ADD COLUMN item_usage TEXT;
ALTER TABLE items ADD COLUMN ui_state TEXT;

-- Races table
ALTER TABLE races ADD COLUMN ui_state TEXT;

-- Note: Factions table already has ui_state column
