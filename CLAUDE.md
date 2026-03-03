# CLAUDE.md

Mobile-first React web app for splitting restaurant bills among a group, handling shared items, per-person quantities, and proportional tax/tip.

## Commands

- **Dev server**: `npm run dev` (Vite, localhost:5173)
- **Build**: `npm run build` (runs `tsc && vite build`)
- **Type check only**: `npx tsc --noEmit`
- **Preview production build**: `npm run preview`

No test framework is configured.

## Architecture

### State Management

Single `useReducer` + React Context. All app state lives in `AppState` (defined in `src/types/index.ts`), dispatched through actions in `src/state/actions.ts`, handled by `src/state/reducer.ts`, and provided via `src/context/AppContext.tsx`.

The reducer handles cascading cleanup: removing a person cleans their entries from all assignments; removing an item deletes its assignment; changing an item's quantity resets its assignment to avoid invalid states.

### Step Wizard

The app is a 4-step wizard: **People** → **Items** → **Assign** → **Results**. Step components live in `src/components/steps/`. Navigation is managed by `NEXT_STEP`/`PREV_STEP` actions. Each step renders its own `NavButtons` with validation logic (e.g., People step requires ≥1 person).

### Assignment Model (the core complexity)

Items have two assignment modes based on quantity:

- **qty = 1**: Uses `sharedPersonIds[]` — item cost split equally among selected people (toggle UI)
- **qty > 1**: Uses `quantities: Record<personId, number>` — each person claims a count (stepper UI)

### Calculation Logic (`src/utils/calculations.ts`)

Pure functions. Tax and tip are prorated only over the _assigned_ portion of the bill. If 70% of item subtotals are assigned, only 70% of tax/tip is distributed. Unassigned amounts (items + proportional tax/tip) are tracked separately and shown as warnings. Penny correction adjusts the person with the highest subtotal to eliminate floating-point rounding drift.

## Conventions

- **Dark mode**: Tailwind `darkMode: 'media'` — follows system preference. Every UI element needs both light and `dark:` variant classes.
- **Currency input**: Cents-based integer entry (typing `250` shows `$2.50`). Value stored as dollars (float). Uses `inputMode="numeric"`.
- **IDs**: Generated with `nanoid()`.
- **Colors**: 10-color palette in `src/utils/colors.ts`, assigned by index to people.
- **Initials**: Single-word names show up to 3 characters (e.g., "Peter" → "PET"); multi-word names use first letter of first two words.
- **Mobile-first**: `max-w-md mx-auto` container, sticky bottom nav with `env(safe-area-inset-bottom)` for iOS.
- **TypeScript**: Strict mode with `noUnusedLocals` and `noUnusedParameters` enabled.
