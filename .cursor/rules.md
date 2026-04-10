# Cursor Strict Rules (MANDATORY)

These rules MUST be followed in every task.

## 1. Scope control
- Do ONLY what is explicitly requested
- Do NOT add anything extra
- Do NOT improve architecture unless asked
- Do NOT refactor unrelated code
- Do NOT change existing working code unless it is required for the task

## 2. Forbidden actions
- Do NOT add testing frameworks (Jest, etc.)
- Do NOT add new dependencies
- Do NOT modify package.json unless explicitly required
- Do NOT touch ios/android native code unless explicitly required
- Do NOT create additional layers (features, widgets, entities) unless explicitly required
- Do NOT introduce abstractions not required by the task
- Do NOT modify files outside the scope

## 3. Architecture rules (FSD)
- Follow project FSD rules strictly
- Respect layer hierarchy: app → pages → widgets → features → entities → shared
- Do NOT import from upper layers
- Do NOT bypass public API (index.ts)
- Do NOT move logic between layers unless explicitly asked
- Pages must NOT contain business logic

## 4. Page structure (MANDATORY)
Each page must follow this structure by default:

- index.tsx — UI (JSX) only
- styles.ts — styles only

Optional (only if needed):
- model/usePageName.ts — local state/logic
- lib/ or helpers/ — small helpers

Do NOT put everything in one file.

## 5. File structure & size (STRICT)
- Components and screens MUST NOT exceed ~100 lines
- If file approaches this limit — split it immediately
- Splitting is REQUIRED, not optional
- One file = one responsibility

## 6. Decomposition rules (MANDATORY)
- When component grows:
  - Extract UI parts into smaller components
  - Extract logic into hooks
  - Extract helpers into separate files
- Large components are considered incorrect implementation
- Refusing to split large files is considered incorrect execution

## 7. Separation of concerns
- Do NOT mix UI, logic, and helpers in one file
- Extract logic into hooks when it appears
- Extract reusable logic into helpers
- Components must focus on rendering only

## 8. Styling rules (STRICT)
- NEVER place StyleSheet in the same file as JSX
- ALWAYS move styles to a separate styles.ts
- No exceptions unless explicitly requested

## 9. Minimalism
- Implement the simplest possible solution
- No “future-proofing”
- No overengineering
- No unnecessary abstractions

## 10. Navigation changes
- Only minimal safe changes allowed
- Do NOT refactor navigation
- Do NOT change navigation structure unless explicitly requested

## 11. Output discipline
- Do not add explanations unless requested
- Do not suggest improvements
- Do not propose next steps

Violation of these rules is considered incorrect execution.
