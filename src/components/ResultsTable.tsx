"use client";

import { useState, useMemo } from "react";
import { MatchResult } from "@models/match";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { ResultsRow } from "./ResultsRow";

type ResultsTableProps = {
  results: MatchResult[];
};

type SortDirection = "asc" | "desc";

export function ResultsTable({ results }: ResultsTableProps) {
  const [filterText, setFilterText] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSorted = useMemo(() => {
    let filtered = results;

    if (filterText.trim()) {
      const searchLower = filterText.toLowerCase();
      filtered = results.filter((result) => {
        const searchableText = [
          result.position.position_number.toString(),
          result.position.short_name_en,
          result.position.description_en,
          result.score.toFixed(2),
          result.why.matchedKeywords.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(searchLower);
      });
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortDirection === "desc") {
        return b.score - a.score;
      }
      return a.score - b.score;
    });

    return sorted;
  }, [results, filterText, sortDirection]);

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(filteredAndSorted, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "match-results.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSort = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No results found. Run matching to see results.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
        <div className="flex-1">
          <Input
            id="filter"
            type="text"
            label="Filter"
            placeholder="Search in results..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="flex gap-2 sm:shrink-0">
          <Button
            type="button"
            variant="secondary"
            onClick={toggleSort}
            className="whitespace-nowrap flex-1 sm:flex-none"
            aria-label={`Sort by score ${sortDirection === "desc" ? "descending" : "ascending"}`}
            aria-pressed={false}
          >
            Sort: {sortDirection === "desc" ? "High→Low" : "Low→High"}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleDownloadJSON}
            className="whitespace-nowrap flex-1 sm:flex-none"
            aria-label="Download results as JSON"
          >
            Download JSON
          </Button>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No results match the filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700 sm:rounded-lg">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                role="table"
                aria-label="Match results"
              >
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                    >
                      Position
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                    >
                      Short Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                    >
                      Score
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                    >
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSorted.map((result, index) => (
                    <ResultsRow
                      key={`${result.position.position_number}-${index}`}
                      result={result}
                      searchTerm={filterText}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
