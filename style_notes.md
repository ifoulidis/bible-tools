# Scoping notes

It's important to internalise these points, as I'll send code back for revision if it doesn't follow the below style guide.

### For me to approve and pay for a project, it must:

- Follow the below style guide points
- Pass linting checks
- Type-check
- Have my approval for any uses of `any` or unsafe expressions like Svelte's `{ @html }` (very rare to approve this, so best to avoid this the first time round to save refactoring effort)
- Have passing unit and/or e2e tests for complex logic, that cover both the "happy path" and edge cases

### My biggest motivation for bringing in contractors is to save my time, so:

- I'm happy to give a bonus for code that just works first time

- Test your code thoroughly (manual testing in addition to the unit and e2e tests) to ensure that it all works as expected

---

# TypeScript

1. Prefer string states to enums (e.g. )

```typescript
type Stage = 'dimensions' | 'location' | 'showProducts' | 'form'
```

2. Prefer string (or object) states to multiple booleans

   - String states are like Note 1 above
   - Object states are like this:

   ```typescript
   type State =
     | { loading: true; data: null; error: null }
     | { loading: false; data: null; error: { message: string } }
     | { loading: false; data: Client; error: null }
   ```

   - Can use derived boolean properties based on the state like `$: isError = !!state.error`, these just can't be the core state (as you could e.g. get `isLoading=true` and `isError=true`)

3. Don't use `any` as it's gaslighting the type checker.

- This is a general rule covering 99% of code in my projects, that if you're using `any` then I'll ask you to refactor.

- There are a few niche situtations where the type logic is too complex to define clearly. In those cases, it's conceptually similar to an `unsafe` blcok of code: it's up to you to ensure that the type logic is enforced at runtime. The clearest way to do this is to use many assertions at the start of the relevant function, or in the relevant code branches: we want any potential bugs to be easily and clearly caught in dev. We don't want surprising `x is not a property of undefined` runtime errors in dev that take time to debug, and we cannot have runtime errors in prod.

4. Complex pure functions must be accompanied by unit tests to prove that the function works as expected for both normal inputs and edge cases

5. Complex functions shouldn't perform IO; refactor out the complexity to a pure function (that can be tested per point 4) and then handle the various cases with IO as required. Model the domain in TypeScript to constrain possible states so the IO handling step is as simple as possible. This ensures that the complex part is provably correct, and the part that's harder to test is simple.

6. Flatten control flow logic where possible: e.g. for data validation, instead of putting a big block of logic inside an `if` block that checks whether data validation passes, instead check if validation failed and return early, and then the processing logic doesn't have to be nested. TypeScript will narrow types here for you so this is type-safe.

Required reading:

- [Make illegal states unrepresentable](https://fsharpforfunandprofit.com/posts/designing-with-types-making-illegal-states-unrepresentable/)
- [Parse don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/)
- [Indirection isn't an abstraction](https://fhur.me/posts/2024/thats-not-an-abstraction). Great read on patterns to avoid: just adding indirection doesn't make an abstraction, it actually makes the code worse on several dimensions.

---

# Backend

For a sample data model with users, for example.

1. Use `prisma.users.findUnique` rather than `prisma.users.findFirst`, as the intent is clearer to the reader/reviewer

2. Use `createMany` (or `createManyAndReturn` if you need the response data) instead of creating items in a loop.

- If you need to create a list of parent items and for each of those, create another list of child items, `flatMap` over the parent items so you can create child items in one `createMany` call instead of having to `map` over parent items to create child items (use 1 query for all child items instead of `n` queries)

3. Use a transaction when batch-creating related records to prevent invalid states (like a form being set up but the questions are missing); either it all succeeds or all fails.

- In specific cases where it's better to save some values even if others fail, this needs to be noted in comments (the default is transactions for consistency)

4. When using external APIs, put a link to the relevant documentation above the function or API call, for easy future reference

5. If we're accepting data from an external API (we built the endpoint), define a schema with Zod and parse the data, so we can either return a 4XX error that their format is invalid, or we now have type safety when using that data: parse untrusted data at the edges so code within the application has types that are guaranteed to be correct.

6. Performance bugs are bugs too

- Avoid making more database queries than necessary, as every round trip adds latency. Use `include` to include related tables to reduce queries

- Avoid accidentally quadratic algorithms (often from situations like nested loops)

7. Using `select` for specific columns in Prisma queries is typically not required; typically just adds some code clutter but doesn't help performance much (unless there are many rows or the table has many columns).
