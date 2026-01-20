/**
 * External URLs configuration
 * All external links are centralized here using environment variables
 * Update .env file to change URLs without modifying code
 */

export const EXTERNAL_URLS = {
  // Purchase
  purchase: import.meta.env.VITE_PURCHASE_URL || "https://example.com/buy-grimorium",

  // Support & Community (can be a form, Discord, GitHub, etc.)
  support: import.meta.env.VITE_SUPPORT_URL || "https://example.com/support",
  bugReport: import.meta.env.VITE_BUG_REPORT_URL || "https://example.com/report-bug",
  suggestions: import.meta.env.VITE_SUGGESTIONS_URL || "https://example.com/suggestions",

  // Legal Pages
  privacyPolicy: import.meta.env.VITE_PRIVACY_POLICY_URL || "https://example.com/privacy-policy",
  termsOfUse: import.meta.env.VITE_TERMS_OF_USE_URL || "https://example.com/terms-of-use",
} as const;

export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;
