/**
 * Visibility Helpers - Functions to manage field and section visibility
 */

export interface IFieldVisibility {
  [fieldName: string]: boolean;
}

export interface ISectionVisibility {
  [sectionName: string]: boolean;
}

/**
 * Check if at least one field in the list is visible
 *
 * @param fieldNames - Array of field names to check
 * @param fieldVisibility - Field visibility object
 * @returns true if at least one field is visible
 *
 * @example
 * ```ts
 * const advancedFields = ['biography', 'personality', 'goals'];
 * const hasVisible = hasVisibleFields(advancedFields, fieldVisibility);
 * // If all fields are hidden (false), returns false
 * // If at least one is visible (true or undefined), returns true
 * ```
 */
export function hasVisibleFields(
  fieldNames: string[],
  fieldVisibility: IFieldVisibility
): boolean {
  return fieldNames.some((fieldName) => fieldVisibility[fieldName] !== false);
}

/**
 * Check if a section is visible
 *
 * @param sectionName - Name of the section to check
 * @param sectionVisibility - Section visibility object
 * @returns true if section is visible (default: true if not set)
 *
 * @example
 * ```ts
 * const timelineVisible = isSectionVisible('timeline', sectionVisibility);
 * ```
 */
export function isSectionVisible(
  sectionName: string,
  sectionVisibility: ISectionVisibility
): boolean {
  // Default to visible if not explicitly set to false
  return sectionVisibility[sectionName] !== false;
}

/**
 * Toggle field visibility
 *
 * @param fieldName - Name of the field to toggle
 * @param currentVisibility - Current field visibility object
 * @returns New field visibility object with toggled field
 *
 * @example
 * ```ts
 * const newVisibility = toggleFieldVisibility('biography', fieldVisibility);
 * setFieldVisibility(newVisibility);
 * ```
 */
export function toggleFieldVisibility(
  fieldName: string,
  currentVisibility: IFieldVisibility
): IFieldVisibility {
  const isCurrentlyVisible = currentVisibility[fieldName] !== false;
  return {
    ...currentVisibility,
    [fieldName]: !isCurrentlyVisible,
  };
}

/**
 * Toggle section visibility
 *
 * @param sectionName - Name of the section to toggle
 * @param currentVisibility - Current section visibility object
 * @returns New section visibility object with toggled section
 *
 * @example
 * ```ts
 * const newVisibility = toggleSectionVisibility('timeline', sectionVisibility);
 * setSectionVisibility(newVisibility);
 * ```
 */
export function toggleSectionVisibility(
  sectionName: string,
  currentVisibility: ISectionVisibility
): ISectionVisibility {
  const isCurrentlyVisible = currentVisibility[sectionName] !== false;
  return {
    ...currentVisibility,
    [sectionName]: !isCurrentlyVisible,
  };
}

/**
 * Get list of all hidden fields
 *
 * @param fieldVisibility - Field visibility object
 * @returns Array of field names that are hidden
 */
export function getHiddenFields(fieldVisibility: IFieldVisibility): string[] {
  return Object.entries(fieldVisibility)
    .filter(([_, isVisible]) => isVisible === false)
    .map(([fieldName]) => fieldName);
}

/**
 * Get list of all hidden sections
 *
 * @param sectionVisibility - Section visibility object
 * @returns Array of section names that are hidden
 */
export function getHiddenSections(
  sectionVisibility: ISectionVisibility
): string[] {
  return Object.entries(sectionVisibility)
    .filter(([_, isVisible]) => isVisible === false)
    .map(([sectionName]) => sectionName);
}

/**
 * Reset all fields to visible
 *
 * @param fieldNames - Array of field names
 * @returns Field visibility object with all fields visible
 */
export function resetFieldsVisibility(fieldNames: string[]): IFieldVisibility {
  return fieldNames.reduce((acc, fieldName) => {
    acc[fieldName] = true;
    return acc;
  }, {} as IFieldVisibility);
}

/**
 * Reset all sections to visible
 *
 * @param sectionNames - Array of section names
 * @returns Section visibility object with all sections visible
 */
export function resetSectionsVisibility(
  sectionNames: string[]
): ISectionVisibility {
  return sectionNames.reduce((acc, sectionName) => {
    acc[sectionName] = true;
    return acc;
  }, {} as ISectionVisibility);
}
