# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Scaler Knowledge Hub is a searchable Q&A knowledge base built with Next.js 14. It features:
- Server-side rendered content for SEO optimization
- Dual data source architecture (Google Sheets + Sanity CMS)
- Community voting system (PostgreSQL backend)
- Lead generation with Google Sheets integration
- Modal-based question viewing with URL state management

## Common Commands

```bash
# Development
npm run dev                 # Start Next.js dev server (runs on localhost:3000)
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Sanity CMS
npm run sanity             # Start Sanity Studio (runs on localhost:3333)
npm run sanity:build       # Build Sanity Studio
npm run sanity:deploy      # Deploy Sanity Studio to Sanity.io
```

## Architecture Overview

### Dual Content Source Pattern

The application has TWO content sources that coexist:

1. **Google Sheets (Active)**: Primary data source via `fetchQuestionsFromSheet()` in `src/lib/sheets.ts`
   - CSV export fetched from public Google Sheets URL
   - Used by main page (`src/app/page.tsx`)
   - Real-time updates with 60-second cache

2. **Sanity CMS (Configured but not active)**: Full CMS schema defined but not currently used
   - Schema: `src/sanity/schemas/question.ts`
   - Queries: `src/lib/sanity.ts`
   - Detail pages (`src/app/[category]/[slug]/page.tsx`) still use mock data

**Important**: When adding features, check which data source is being used. The main listing page uses Google Sheets, while detail pages use `mockQuestions` from `src/lib/mockData.ts`.

### Routing Structure

- `/` - Main knowledge hub page with search, filters, and question cards
- `/[category]/[slug]` - Individual question detail pages (currently uses mock data)
- `/api/vote` - POST endpoint for voting (returns 401 - auth not implemented)
- `/api/submit-lead` - POST endpoint to submit lead forms to Google Sheets webhook

### Modal vs Direct Navigation

The app uses a **modal-first approach** for question viewing:
- Clicking a question opens `QuestionModal` component
- URL updates to `?q={slug}` for SEO and shareability
- Direct links to `?q={slug}` automatically open modal on page load
- The `/[category]/[slug]` route exists but is not actively used

### Component Architecture

**Client-Side State Management**:
- `src/app/page.tsx` - Main page wraps content in `<Suspense>` for search params
- Uses `useSearchParams()` for filter/search state
- Questions loaded from Google Sheets on component mount
- All filtering/sorting happens client-side

**Key Components**:
- `QuestionCard` - Displays question summary in list view
- `QuestionModal` - Full question/answer modal with PortableText rendering
- `LeadFormModal` - Lead capture form that submits to Google Sheets webhook
- `VoteButtons` - Voting UI (calls `/api/vote` which currently returns 401)
- `PortableTextComponents` - Custom renderers for Sanity's rich text format

### Data Types

Core types in `src/lib/types.ts`:
- `Question` - Main content type with title, slug, body, answer, votes
- `Answer` - Contains body (rich text) and optional resources
- `Vote` - User vote record (userId, questionId, voteType)
- `CATEGORIES` - Hard-coded category labels (fees, placements, curriculum, etc.)

### Voting System (Partial Implementation)

- **Database**: PostgreSQL schema defined in `src/lib/db.ts`
  - Table: `votes` with (user_id, question_id, vote_type, timestamps)
  - Unique constraint on (user_id, question_id)
- **API**: `/api/vote` route exists but returns 401 (auth not implemented)
- **UI**: `VoteButtons` component shows upvote/downvote but doesn't persist

### Lead Generation Flow

1. User clicks CTA button (injected into header or in page CTAs)
2. `LeadFormModal` opens with form fields
3. On submit, POST to `/api/submit-lead`
4. Backend makes GET request to Google Apps Script webhook URL with query params
5. Google Sheets captures lead data

**Environment Variable**: `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`

### Styling System

- **Tailwind CSS** with custom Scaler brand colors
- **No border radius** - `borderRadius.DEFAULT: '0'` in config
- **Color palette**:
  - `scaler-blue` (#2563EB) - Primary CTA color
  - `scaler-dark` (#1A1A2E) - Headers, dark text
  - `scaler-gray` / `scaler-gray-light` - Body text
- **Font**: Plus Jakarta Sans

### Base Path Configuration

The app is deployed with `basePath: "/scaler-knowledge-hub"` in `next.config.js`. All routes are prefixed with this path in production.

## Development Notes

### Adding New Questions

**Via Google Sheets** (Current Method):
1. Edit the source Google Sheet (URL in `src/lib/sheets.ts`)
2. Ensure CSV columns match: id, title, slug, category, tags, excerpt, body, answer, upvotes, downvotes, publishedAt
3. Changes reflect within 60 seconds due to cache revalidation

**Via Sanity CMS** (Available but not used):
1. Run `npm run sanity` to start Sanity Studio
2. Create question with required fields (title, slug, category, body, answer)
3. Update code to use Sanity queries instead of Google Sheets

### Adding New Categories

1. Update `CATEGORIES` object in `src/lib/types.ts`
2. Update Sanity schema in `src/sanity/schemas/question.ts` (category field options)
3. Categories are displayed in left sidebar filter

### Environment Setup

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID (optional if using Google Sheets)
- `NEXT_PUBLIC_SANITY_DATASET` - Sanity dataset name (default: production)
- `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` - Google Apps Script webhook for lead capture
- `DATABASE_URL` - PostgreSQL connection string (for voting system when implemented)

### SEO Considerations

- Questions should have descriptive titles for search ranking
- `slug` fields must be URL-friendly and keyword-rich
- Modal URL pattern (`?q={slug}`) allows direct linking and indexing
- QAPage schema markup is intended but not currently implemented

### Known Limitations

1. **Voting not functional** - API returns 401, no user authentication
2. **Detail pages use mock data** - Not connected to Google Sheets or Sanity
3. **No server-side search** - All filtering happens client-side after fetch
4. **Hard-coded tags** - "Popular Tags" section uses static list, not derived from data
