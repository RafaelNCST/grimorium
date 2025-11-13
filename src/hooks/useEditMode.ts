import { useState, useCallback, useMemo } from 'react';

export interface UseEditModeOptions<T> {
  initialData: T | null;
  onSave?: (data: T) => Promise<void>;
  onCancel?: () => void;
  compareFunction?: (a: T, b: T) => boolean;
}

export interface UseEditModeReturn<T> {
  isEditing: boolean;
  isSaving: boolean;
  editData: T;
  hasChanges: boolean;
  startEditing: () => void;
  stopEditing: () => void;
  saveChanges: () => Promise<void>;
  cancelEditing: () => void;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  updateEditData: (data: T | ((prev: T) => T)) => void;
  resetToInitial: () => void;
}

/**
 * Hook for managing edit mode with dirty checking
 * @param options - Configuration options
 * @returns Edit mode state and functions
 */
export function useEditMode<T>({
  initialData,
  onSave,
  onCancel,
  compareFunction,
}: UseEditModeOptions<T>): UseEditModeReturn<T> {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<T>(initialData || ({} as T));

  // Check if there are changes between initial data and edit data
  const hasChanges = useMemo(() => {
    if (!isEditing || !initialData) return false;

    // Use custom compare function if provided
    if (compareFunction) {
      return !compareFunction(initialData, editData);
    }

    // Default: deep comparison using JSON stringify
    try {
      return JSON.stringify(initialData) !== JSON.stringify(editData);
    } catch (error) {
      console.warn('[useEditMode] Failed to compare data:', error);
      return false;
    }
  }, [initialData, editData, isEditing, compareFunction]);

  // Start editing mode
  const startEditing = useCallback(() => {
    if (initialData) {
      setEditData(initialData);
    }
    setIsEditing(true);
  }, [initialData]);

  // Stop editing mode without saving
  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Save changes
  const saveChanges = useCallback(async () => {
    if (!onSave) {
      console.warn('[useEditMode] No onSave function provided');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('[useEditMode] Failed to save changes:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [editData, onSave]);

  // Cancel editing and revert to initial data
  const cancelEditing = useCallback(() => {
    if (initialData) {
      setEditData(initialData);
    }
    setIsEditing(false);

    if (onCancel) {
      onCancel();
    }
  }, [initialData, onCancel]);

  // Update a specific field in edit data
  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Update edit data with a new object or updater function
  const updateEditData = useCallback((data: T | ((prev: T) => T)) => {
    setEditData(data);
  }, []);

  // Reset to initial data
  const resetToInitial = useCallback(() => {
    if (initialData) {
      setEditData(initialData);
    }
  }, [initialData]);

  return {
    isEditing,
    isSaving,
    editData,
    hasChanges,
    startEditing,
    stopEditing,
    saveChanges,
    cancelEditing,
    updateField,
    updateEditData,
    resetToInitial,
  };
}
