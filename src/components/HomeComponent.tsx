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
      setErrorMessage("");
      setPageState("loading");
      const matchedResults = await matchIntake(data);
      setResults(matchedResults);

      setTimeout(() => {
        const resultsSection = document.getElementById("results-section");
        if (resultsSection) {
          resultsSection.focus();
          resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to match"
      );
    }
  };

  if (pageState === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-red-600 dark:text-red-400 mb-6">
            {errorMessage}
          </p>
          <Button
            onClick={() => {
              setPageState("ready");
              setErrorMessage("");
            }}
            variant="primary"
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
                className="flex flex-col items-center justify-center py-12"
                role="status"
                aria-live="polite"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Processing match...
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This may take a few seconds
                </p>
              </div>
            ) : pageState === "empty" && results.length === 0 ? (
              <div
                className="text-center py-12"
                role="status"
              >
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                  <svg
                    className="h-6 w-6 text-gray-400 dark:text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  No results yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Fill in the form and click "Run Matching"
                </p>
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
