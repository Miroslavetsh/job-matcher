const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "he",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "that",
  "the",
  "to",
  "was",
  "were",
  "will",
  "with",
  "the",
  "this",
  "but",
  "they",
  "have",
  "had",
  "what",
  "said",
  "each",
  "which",
  "their",
  "if",
  "do",
  "how",
  "up",
  "out",
  "many",
  "then",
  "them",
  "these",
  "so",
  "some",
  "her",
  "would",
  "make",
  "like",
  "into",
  "him",
  "time",
  "has",
  "look",
  "two",
  "more",
  "write",
  "go",
  "see",
  "no",
  "way",
  "could",
  "my",
  "than",
  "first",
  "been",
  "call",
  "who",
  "its",
  "now",
  "find",
  "down",
  "day",
  "did",
  "get",
  "come",
  "made",
  "may",
  "part",
]);

const SYNONYMS = new Map<string, string>([
  ["installation", "install"],
  ["installing", "install"],
  ["mount", "install"],
  ["mounting", "install"],
  ["setup", "install"],
  ["renovation", "renovate"],
  ["renovating", "renovate"],
  ["repair", "repair"],
  ["repairing", "repair"],
  ["fix", "repair"],
  ["fixing", "repair"],
  ["painting", "paint"],
  ["painted", "paint"],
  ["electrical", "electric"],
  ["plumbing", "plumb"],
  ["demolition", "demolish"],
  ["demolishing", "demolish"],
  ["dismantling", "demolish"],
  ["dismantle", "demolish"],
  ["tiles", "tile"],
  ["windows", "window"],
  ["walls", "wall"],
  ["floors", "floor"],
  ["flooring", "floor"],
  ["sockets", "socket"],
  ["switches", "switch"],
  ["fixtures", "fixture"],
  ["sinks", "sink"],
  ["toilets", "toilet"],
  ["bathtubs", "bathtub"],
  ["partitions", "partition"],
]);

function removeDiacritics(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function removePunctuation(text: string): string {
  return text.replace(/[^\w\s]/g, " ");
}

export function normalizeText(text: string): string {
  let normalized = text.toLowerCase();
  normalized = removeDiacritics(normalized);
  normalized = removePunctuation(normalized);
  normalized = normalized.replace(/\s+/g, " ").trim();
  return normalized;
}

function applySynonyms(token: string): string {
  return SYNONYMS.get(token) || token;
}

export function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  const tokens = normalized
    .split(/\s+/)
    .filter((token) => token.length > 1)
    .map(applySynonyms)
    .filter((token) => !STOP_WORDS.has(token));

  return Array.from(new Set(tokens));
}
