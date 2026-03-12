export const content = `
Twelve months ago I was skeptical of AI coding assistants. I'd tried Copilot, found it useful for boilerplate but unreliable for anything complex, and largely moved on. Then I started using agentic AI—systems that don't just suggest code but plan, execute, and iterate across an entire task. My workflow has never been the same.

## What Agentic AI Actually Is

The distinction matters: autocomplete tools suggest the next line. Agentic AI systems take a goal—"add authentication to this Express app" or "find and fix the memory leak in this service"—and execute it across multiple files, running tests, checking errors, and iterating until the task is done.

The practical difference is enormous. Instead of reviewing suggestions line by line, you're reviewing diffs and test results. Instead of writing the code, you're directing it.

## What Changed in My Workflow

**The biggest shift: I write less code and review more.** For feature work, I now describe what I want, let the agent draft it, then review the implementation against my intent. This catches architectural issues I might have introduced myself while writing, and it's faster.

**Testing improved dramatically.** I was honest with myself: I wrote tests inconsistently. Now I instruct the agent to write tests as part of every feature implementation. My test coverage went from ~40% to ~75% in three months without meaningfully more time investment.

**Documentation went from never to always.** Same principle. "Document this module" as part of the prompt means it actually happens.

## Where I Still Don't Trust It

Complex distributed systems work, anything involving subtle concurrency, and security-sensitive code. The agent will produce confident-looking code that has race conditions or incorrect permission logic. My review attention is highest in these areas.

I also don't trust it to understand context it doesn't have. If a decision depends on a conversation I had with a product manager six months ago, the agent doesn't know that. Judgment and context are still mine.

## The Honest ROI

I estimate I'm shipping roughly 40% more feature work per week than I was a year ago. More importantly, the work I'm doing is higher-level—architecture, user experience decisions, cross-system thinking—rather than implementation mechanics.

There's no going back.
`;
