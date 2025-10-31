/**
 * Image Block Dimensions Constants
 *
 * These constants define the exact dimensions and spacing
 * used in the image-block component. They are centralized
 * here to ensure consistency across the component and
 * the image frame modal.
 */

// Block dimensions
export const IMAGE_BLOCK_WIDTH = 800;
export const IMAGE_BLOCK_BASE_HEIGHT = 400;

// Spacing
export const IMAGE_BLOCK_PADDING = 16;
export const IMAGE_BLOCK_GAP = 12;

// Caption dimensions
export const IMAGE_BLOCK_CAPTION_MAX_HEIGHT = 95;
export const IMAGE_BLOCK_CAPTION_FONT_SIZE = 14;
export const IMAGE_BLOCK_CAPTION_LINE_HEIGHT = 1.2;
export const IMAGE_BLOCK_CAPTION_PADDING = 8;

// Calculated dimensions for the image area
export const IMAGE_AREA_WIDTH = IMAGE_BLOCK_WIDTH - (IMAGE_BLOCK_PADDING * 2); // 768px

// Default image area height (can be customized per element via imageAreaHeight property)
// Range: 200px - 1200px
export const IMAGE_AREA_HEIGHT = 300; // 300px (default)

/**
 * Get the exact dimensions of the visible image area.
 * These dimensions should be used for the image frame modal
 * to ensure the framing preview matches the actual display.
 */
export function getImageAreaDimensions() {
  return {
    width: IMAGE_AREA_WIDTH,
    height: IMAGE_AREA_HEIGHT,
  };
}
