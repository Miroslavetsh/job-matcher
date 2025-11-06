"use client";

import { useState, useEffect } from "react";
import { IntakeForm } from "@components/IntakeForm";
import { ResultsTable } from "@components/ResultsTable";
import { match } from "@lib/matcher";
import { loadCatalogue } from "@utils/data";
import { Catalogue } from "@models/catalogue";
import { MatchResult } from "@models/match";
import { IntakeFormData } from "@lib/validation/schemas/intake";

type PageState = "loading" | "error" | "empty" | "ready";

export function HomeComponent() {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageState("loading");
        const loadedCatalogue = await loadCatalogue();
        setCatalogue(loadedCatalogue);
        setPageState("ready");
      } catch (error) {
        setPageState("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load catalogue"
        );
      }
    };

    loadData();
  }, []);

  const handleFormSubmit = (data: IntakeFormData) => {
    if (!catalogue) {
      setPageState("error");
      setErrorMessage("Catalogue not loaded");
      return;
    }

    try {
      const matchedResults = match(data, catalogue);
      setResults(matchedResults);
      setPageState(matchedResults.length === 0 ? "empty" : "ready");
    } catch (error) {
      setPageState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to match"
      );
    }
  };

  const handleClear = () => {
    setResults([]);
    setPageState("ready");
  };

  if (pageState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading catalogue...</div>
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">Error: {errorMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Job Matcher
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Client Intake
            </h2>
            <IntakeForm onSubmit={handleFormSubmit} onClear={handleClear} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Results
            </h2>
            {pageState === "empty" && results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No results yet. Fill in the form and click "Run Matching".
              </div>
            ) : (
              <ResultsTable results={results} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

