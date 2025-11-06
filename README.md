# Job Matcher

Smart job matching system that converts client intake into a ranked list of recommended positions from a trade catalogue.

## Prerequisites
- node@22+, also available via nvm
```bash
nvm install
# OR (if installed)
nvm use
```

## Quick Start

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Open http://localhost:3000
```

**Quick test:** Click "Load Example" button in the intake form to pre-fill sample data, then click "Run Matching" to see results immediately.

## Scoring Formula

The matching algorithm uses a weighted scoring system:

```
score = w1 × keywordScore + w2 × fuzzyScore + w3 × categoryBoost
```

**Weights:**

- `w1 = 0.6` - Keyword overlap (token matching)
- `w2 = 0.3` - Fuzzy matching (Fuse.js similarity)
- `w3 = 0.1` - Category boost (difficult access flag)

**Scoring details:**

- **Keyword score**: Token overlap ratio between intake text and position fields (`short_name_en`, `description_en`)
- **Fuzzy score**: Fuse.js similarity (threshold: 0.6) between intake text and position text
- **Category boost**: +0.2 if `difficultAccess` is true (applied to all positions)

Results are deduplicated by `position_number`, sorted by score (descending), and limited to top 15.

## Text Normalization

All text processing uses the following normalization pipeline:

1. **Lowercase conversion**
2. **Diacritics removal** (é → e, ü → u)
3. **Punctuation removal** (replaced with spaces)
4. **Stop words filtering** (common words like "the", "and", "is")
5. **Synonym mapping** (see below)

## Synonyms

Common synonym mappings (full list in `src/lib/matcher/normalize.ts`):

- `installation` / `installing` → `install`
- `repair` / `repairing` → `fix`
- `window` / `windows` → `window`
- `door` / `doors` → `door`

## Tech Stack

- **React Hook Form** - Form state management with minimal re-renders
- **Zod** - Type-safe schema validation, integrated with RHF
- **Tailwind CSS** - Utility-first styling with dark mode support
- **Zustand** - Lightweight state management for app state
- **Fuse.js** - Fuzzy string matching for similarity scoring
- **Next.js 16** - App Router with API routes for server-side matching

## Architecture

- **Frontend**: Client components for UI, server components for pages
- **Backend**: API route (`/api/match`) handles matching logic and catalogue loading
- **Algorithm**: Deterministic scoring (no LLM) - see `src/lib/matcher/`
- **Data**: 
  - Catalogue: `public/assets/sample/service_catalog_en.json`
  - Example intake: `public/assets/sample/intake.json`
