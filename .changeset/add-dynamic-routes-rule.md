---
'@refyne/eslint-plugin': minor
---

Add new ESLint rule `dynamic-routes-at-end` to ensure dynamic routes (with path parameters) are placed at the end of route handler classes. This prevents dynamic routes from shadowing static routes across multiple TypeScript routing frameworks (NestJS, Express-like, and custom implementations). Includes comprehensive test coverage with 15 test cases.
