# Monera — collaboration rules

## Commits

- Commit subject: **short**, imperative, strictly about what the change does. One line, ≤60 chars. No body unless truly necessary (breaking change, migration note).
- **Never** add `Co-Authored-By: Claude` / `Generated with Claude Code` / any AI-attribution trailer. Commits go out under the user's identity only.
- Follow Conventional Commits style loosely (verb-first: `Add`, `Fix`, `Refactor`, `Swap`, `Remove`). No scoping prefixes unless the repo already uses them.
- Use a single `-m "..."` — no HEREDOC for multi-paragraph messages unless asked.

## Code comments

- Default to **no comments**. Well-named identifiers explain the _what_.
- Only add a comment when the _why_ is non-obvious (hidden constraint, workaround, surprising behavior).
- Never reference the current task, PR, ticket, or author in comments (`// added for X`, `// Claude: ...`). That belongs in the commit/PR description.
- No multi-line comment blocks or docstrings unless the user asks.

## File changes

- Prefer `Edit` over `Write` for existing files.
- Do not create `*.md` (docs, READMEs, plans) unless explicitly asked.
