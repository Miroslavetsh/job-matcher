# Job Matcher - Technical Proposal

## Architecture

```
UI (Client) → API Route (/api/match) → Matching Service → Data Store (JSON)
```

**Current implementation:**

- **UI**: React components with Zustand for state management
- **API**: Next.js API route (`app/api/match/route.ts`) handles POST requests
- **Matching Service**: Deterministic algorithm in `src/lib/matcher/`
- **Data Store**: JSON file (`public/assets/sample/service_catalog_en.json`) with in-memory caching

**Future evolution:**

- Move catalogue to database (PostgreSQL/MongoDB)
- Add caching layer (Redis) for frequently accessed data
- Implement rate limiting and request validation middleware

## Matching Evolution

**Current (v1):** Rule-based deterministic matching

- Keyword tokenization with synonyms
- Fuzzy matching (Fuse.js)
- Category-based boosting
- **NO LLM in ranking path** - fully explainable scores

**Future (v2):** Embeddings-based matching (explainable)

- Use sentence transformers (e.g., `sentence-transformers/all-MiniLM-L6-v2`)
- Vector similarity search (e.g., Pinecone, Weaviate, or pgvector)
- **Explainability**: Return top matching tokens/segments that contributed to score
- Hybrid approach: combine embeddings with keyword matching for transparency

**Key principle:** All ranking decisions must be explainable. No black-box LLM calls in the matching pipeline.

## Export Formats

**PDF:**

- Library: `pdfkit` or `@react-pdf/renderer`
- Why: Server-side generation, good for reports

**DOCX:**

- Library: `docx` (npm)
- Why: Native Word format, preserves formatting

**XLSX:**

- Library: `xlsx` (SheetJS)
- Why: Lightweight, handles large datasets, client-side generation possible

**Implementation approach:**

- Add export buttons in ResultsTable
- Generate files server-side via API routes
- Stream to client for download

## Operations

**Logging:**

- Structured logging (Winston/Pino) for API routes
- Log: request ID, intake hash (no PII), match duration, result count
- Log levels: ERROR, WARN, INFO

**Metrics:**

- Request rate, match duration (p50, p95, p99)
- Error rate, cache hit rate
- Track via Prometheus or simple counters

**Error Handling:**

- API: Try-catch with proper HTTP status codes
- Client: User-friendly error messages, retry logic
- Validation: Zod schemas on both client and server

**Privacy:**

- No PII in logs (hash email/phone)
- Catalogue data stays on server
- Client only receives match results (no raw catalogue)

**SLI/SLO:**

- **SLI**: Match API response time < 500ms (p95), error rate < 1%
- **SLO**: 99.5% uptime, < 1s match time for 99% of requests

## Risks & Trade-offs

**Current simplifications:**

1. **In-memory catalogue caching**

   - Risk: Memory usage grows with catalogue size
   - Hardening: Move to Redis, implement TTL, add cache invalidation

2. **No rate limiting**

   - Risk: API abuse, DoS
   - Hardening: Add rate limiting middleware (e.g., `@upstash/ratelimit`)

3. **Single JSON file data source**

   - Risk: No versioning, hard to update
   - Hardening: Database with versioning, admin API for updates

4. **No authentication**

   - Risk: Unauthorized access
   - Hardening: Add API keys or OAuth, role-based access control

5. **Client-side form validation only**
   - Risk: Invalid data reaches API
   - Hardening: Server-side validation with Zod (already partially done)

**Future considerations:**

- Horizontal scaling: Stateless API, shared cache
- Monitoring: APM tools (Sentry, Datadog)
- Testing: Unit tests for scoring, integration tests for API

## Technology Choices

**Why deterministic matching:**

- Predictable results, easy to debug
- No external API dependencies
- Fast execution (< 100ms for typical catalogue)
- Fully explainable to users

**Why Next.js API routes:**

- Server-side execution for sensitive logic
- Built-in request handling
- Easy deployment (Vercel/self-hosted)

**Why Zustand over Redux:**

- Minimal boilerplate
- Simple state shape (results, loading, error)
- No need for complex middleware
