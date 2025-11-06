import { IntakeData } from "@models/intake";
import { Catalogue } from "@models/catalogue";
import { Position } from "@models/position";
import { MatchResult, MatchReason } from "@models/match";
import { extractSignals } from "./signals";
import {
  calculateKeywordScore,
  calculateFuzzyScore,
  calculateCategoryBoost,
} from "./score";
import { tokenize } from "./normalize";

interface PositionWithTradeCode {
  position: Position;
  tradeCode: string;
}

const WEIGHTS = {
  keyword: 0.6,
  fuzzy: 0.3,
  categoryBoost: 0.1,
};

function flattenCatalogue(catalogue: Catalogue): PositionWithTradeCode[] {
  const positions: PositionWithTradeCode[] = [];

  for (const trade of catalogue.trades) {
    for (const position of trade.positions) {
      positions.push({
        position,
        tradeCode: trade.code,
      });
    }
  }

  return positions;
}

function generateMatchReason(
  tokens: string[],
  position: Position,
  keywordScore: number,
  fuzzyScore: number,
  categoryBoost: number
): MatchReason {
  const positionText = `${position.short_name_en} ${position.description_en}`;
  const positionTokens = tokenize(positionText);

  const matchedKeywords = tokens.filter((token) =>
    positionTokens.includes(token)
  );

  return {
    matchedKeywords,
    fuzzyMatch: fuzzyScore > 0,
    categoryBoost: categoryBoost > 0,
  };
}

function deduplicateByPositionNumber(
  results: MatchResult[]
): MatchResult[] {
  const seen = new Set<number>();
  const unique: MatchResult[] = [];

  for (const result of results) {
    if (!seen.has(result.position.position_number)) {
      seen.add(result.position.position_number);
      unique.push(result);
    }
  }

  return unique;
}

export function match(
  intake: IntakeData,
  catalogue: Catalogue,
  topN: number = 15
): MatchResult[] {
  const signals = extractSignals(intake);
  const intakeText = [
    intake.name,
    intake.company,
    intake.address,
    intake.description,
  ]
    .filter(Boolean)
    .join(" ");

  const positionsWithTrade = flattenCatalogue(catalogue);
  const results: MatchResult[] = [];

  for (const { position, tradeCode } of positionsWithTrade) {
    const keywordScore = calculateKeywordScore(signals.tokens, position);
    const fuzzyScore = calculateFuzzyScore(intakeText, position);
    const categoryBoost = calculateCategoryBoost(signals.difficultAccess);

    const finalScore =
      WEIGHTS.keyword * keywordScore +
      WEIGHTS.fuzzy * fuzzyScore +
      WEIGHTS.categoryBoost * categoryBoost;

    const why = generateMatchReason(
      signals.tokens,
      position,
      keywordScore,
      fuzzyScore,
      categoryBoost
    );

    results.push({
      position,
      score: finalScore,
      why,
    });
  }

  const deduplicated = deduplicateByPositionNumber(results);

  const sorted = deduplicated.sort((a, b) => b.score - a.score);

  return sorted.slice(0, topN);
}

