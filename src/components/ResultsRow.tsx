"use client";

import { MatchResult } from "@models/match";
import { highlightText } from "@utils/highlight";

type ResultsRowProps = {
  result: MatchResult;
  searchTerm?: string;
};

export function ResultsRow({ result, searchTerm = "" }: ResultsRowProps) {
  const reasons: string[] = [];

  if (result.why.matchedKeywords.length > 0) {
    reasons.push(`Keywords: ${result.why.matchedKeywords.join(", ")}`);
  }

  if (result.why.fuzzyMatch) {
    reasons.push("Fuzzy match");
  }

  if (result.why.categoryBoost) {
    reasons.push("Category boost");
  }

  return (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      role="row"
    >
      <td
        className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100"
        role="cell"
      >
        {highlightText(result.position.position_number.toString(), searchTerm)}
      </td>
      <td
        className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
        role="cell"
      >
        <div className="max-w-xs truncate sm:max-w-none sm:whitespace-normal">
          {highlightText(result.position.short_name_en, searchTerm)}
        </div>
      </td>
      <td
        className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100"
        role="cell"
      >
        {highlightText(result.score.toFixed(2), searchTerm)}
      </td>
      <td
        className="px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
        role="cell"
      >
        <div className="space-y-1">
          {reasons.map((reason, idx) => (
            <div key={idx}>{highlightText(reason, searchTerm)}</div>
          ))}
        </div>
      </td>
    </tr>
  );
}
