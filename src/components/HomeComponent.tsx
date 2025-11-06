"use client";

import { IntakeForm } from "@components/IntakeForm";
import { ResultsTable } from "@components/ResultsTable";
import { Button } from "@components/ui/Button";
import { matchIntake } from "@utils/api";
import { useAppStore } from "@store/index";
import { IntakeFormData } from "@lib/validation/schemas/intake";

export function HomeComponent() {
  const {
    results,
    pageState,
    errorMessage,
    setResults,
    setPageState,
    setErrorMessage,
    clearResults,
  } = useAppStore();

  const handleFormSubmit = async (data: IntakeFormData) => {
    try {
      setPageState("loading");
      setErrorMessage("");
      const matchedResults = await matchIntake(data);
      setResults(matchedResults);
      setPageState("ready");

      setTimeout(() => {
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          resultsSection.focus();
          resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (error) {
      setPageState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to match"
      );
    }
  };

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-lg text-red-600 dark:text-red-400">
            Error: {errorMessage}
          </div>
          <Button
            onClick={() => {
              setPageState("ready");
              setErrorMessage("");
            }}
            variant="primary"
            className="mt-4"
            aria-label="Try again after error"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
          Job Matcher
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-gray-900">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
              Client Intake
            </h2>
            <IntakeForm
              onSubmit={handleFormSubmit}
              onClear={clearResults}
              isLoading={pageState === "loading"}
            />
          </div>
          <div
            id="results-section"
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md dark:shadow-gray-900"
            tabIndex={-1}
            aria-live="polite"
            aria-atomic="true"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
              Results
            </h2>
            {pageState === "loading" ? (
              <div
                className="text-center py-8 text-gray-500 dark:text-gray-400"
                role="status"
                aria-live="polite"
              >
                Processing match...
              </div>
            ) : pageState === "empty" && results.length === 0 ? (
              <div
                className="text-center py-8 text-gray-500 dark:text-gray-400"
                role="status"
              >
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
