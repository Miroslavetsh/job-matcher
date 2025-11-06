import { Position } from "@models/position";
import { tokenize } from "./normalize";

export function calculateKeywordScore(
  tokens: string[],
  position: Position
): number {
  const positionText = `${position.short_name_en} ${position.description_en}`;
  const positionTokens = tokenize(positionText);

  const matchedTokens = tokens.filter((token) =>
    positionTokens.includes(token)
  );

  const totalTokens = Math.max(tokens.length, positionTokens.length);
  if (totalTokens === 0) {
    return 0;
  }

  return matchedTokens.length / totalTokens;
}

