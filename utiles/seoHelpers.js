// utils/seoHelpers.js

/**
 * Converts slug strings (e.g., "repairs-services") into Title Case (e.g., "Repairs Services")
 */
export function formatText(text = "") {
  return text
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Deterministically picks a template from an array using a hash key,
 * ensuring the same page always gets the exact same Title/Description.
 */
export function pickStableValue(key, list) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return list[Math.abs(hash) % list.length];
}

/**
 * Replaces placeholders like {category} and {location} with real dynamic data
 */
export function replaceTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] || "");
}


// this is secont seo type

export const pick = (arr = [], seed = 0) => {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  return arr[Math.abs(seed) % arr.length];
};

export const getIntent = (seed = 0) => {
  const intents = ["general", "trusted", "affordable", "emergency"];
  return intents[Math.abs(seed) % intents.length];
};