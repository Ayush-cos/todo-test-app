<!-- # Redux Slice Creation Guide
Use this prompt to generate a new Redux Toolkit slice that mirrors the structure and
conventions of our codebase (modeled after `src/store/slices/partner-locator` and
`src/store/slices/insights`), but WITHOUT any transformers. It must include the same
file layout, endpoint-constant pattern, axios cancel tokens, and `condition` guards
on thunks.
```text
You are generating a new Redux Toolkit slice for a Next.js/TypeScript project.
Follow these exact conventions from our codebase. Create the slice in the slices folder:
src/store/slices/<slice-name>/
Create exactly these files (inside the slice's directory):
1) interface.ts
2) requests.ts
3) extra-reducers.ts
4) index.ts
General rules:
- Use TypeScript and Redux Toolkit.
- Import `service, { HttpMethod }` from `@/services/http` and use it for all API calls.
- Put API endpoint constants at the TOP of `requests.ts` and name them in UPPER_SNAKE_CAS
- Every async thunk uses axios CancelToken and a `condition` guard to prevent concurrent
calls if a corresponding `isLoading*` flag is true.
- Handle axios errors via `thunkAPI.rejectWithValue` with the same message fallback patte
- No transformer imports or logic. Assign payloads to state directly.
- State shape rules by HTTP method:
- GET endpoints: maintain three states per entity —

data, `isLoading<Entity>`, `error<Entity>`.
- POST/PUT endpoints: maintain only `isLoading<Action>` flags
(no success data or error flags in state).
- Keep selected filters and simple pagination where relevant.
- Group state by API in both the interface and initialState,
and separate groups with a blank line for readability.
- Export thunks from `requests.ts` via the slice `index.ts`.
- Export action creators from `index.ts` for updating selections and pagination.
- Import and mount the reducer in `src/store/slices/index.ts` under a sensible key.
Naming placeholders (replace everywhere):
- <SliceNamePascal> e.g., `SiteInsights`
- <sliceNameCamel> e.g., `siteInsights`
- <slice-name-kebab> e.g., `site-insights`
- <ENTITY_A>, <ENTITY_B> represent your domain pieces (e.g., `metrics`, `sites`).
```

---
## File: interface.ts (types and state)
- Define request/response interfaces for each endpoint.
- Define the slice state interface with:
- For GET endpoints: data buckets (nullable or arrays), boolean loading flags
`isLoading<Entity>`, and nullable error fields `error<Entity>`.
- For POST/PUT endpoints: only boolean loading flags `isLoading<Action>`.
- selection fields (e.g., `selectedFoo`) as needed
- `uiPagination: { currentPage: number; limit: number }` if pagination is needed
- Order and group the fields by API, keeping a blank line between API groups.
```ts
export interface <SliceNamePascal>State {
// GET /<slice-name-kebab>/entity-a
entityA: <EntityA>Response | null;
isLoadingEntityA: boolean;
errorEntityA: string | null;
// POST/PUT actions (loading flags only)
isLoadingCreateEntity: boolean;
// UI State
selectedFoo: string | null;
uiPagination: UiPagination;
}
```

---
## File: requests.ts (thunks with endpoint constants and condition guards)

```ts
const GET_ENTITY_A_ENDPOINT = '/service/api/v1/<slice-name-kebab>/entity-a';
export const fetchEntityA = createAsyncThunk<
EntityAResponse, FetchEntityAParams, { state: RootState }
>(
GET_ENTITY_A_ENDPOINT,
async (payload, thunkAPI) => {
const source = axios.CancelToken.source();
thunkAPI.signal.addEventListener('abort', () => source.cancel());
try {
const resp = await service({
method: HttpMethod.GET, url: GET_ENTITY_A_ENDPOINT,
params: payload, cancelToken: source.token,
});
return resp.data as EntityAResponse;
} catch (error: unknown) {
if (axios.isAxiosError(error)) {
return thunkAPI.rejectWithValue(
error.response?.data?.message ??
error.response?.data?.error ??
error.message
);
}
return thunkAPI.rejectWithValue(error);
}
},
{ condition: (_p, { getState }) => !getState().sliceName.isLoadingEntityA }
);
```

---
## File: extra-reducers.ts (builder handlers only)
```ts
export function handleFetchEntityA(
builder: ActionReducerMapBuilder<SliceState>
) {
builder
.addCase(fetchEntityA.pending, (state) => {
state.isLoadingEntityA = true;
state.errorEntityA = null;
})
.addCase(fetchEntityA.fulfilled, (state, action) => {
state.isLoadingEntityA = false;
state.entityA = action.payload;
state.errorEntityA = null;

})
.addCase(fetchEntityA.rejected, (state, action) => {
state.isLoadingEntityA = false;
state.errorEntityA = action.payload as string;
});
}
```

---
## File: selectors.ts (memoized selectors with createSelector)
```ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
const selectSliceState = (state: RootState) => state.sliceName;
const selectComponentAState = createSelector(
[selectSliceState],
(state) => ({
entityA: state.entityA,
isLoadingEntityA: state.isLoadingEntityA,
})
);
export { selectSliceState, selectComponentAState };
```

---
## File: index.ts (slice, initialState, actions, exports)
```ts
const slice = createSlice({
name: 'sliceName',
initialState,
reducers: { /* sync actions */ },
extraReducers: (builder) => {
handleFetchEntityA(builder);
},
});
export const { ...actions } = slice.actions;
export { fetchEntityA } from './requests';
export { selectSliceState, selectComponentAState } from './selectors';
export type { SliceState } from './interface';
export default slice.reducer;
```

---
## Checklist
- [ ] Directory: `src/store/slices/<slice-name-kebab>/`
- [ ] Files: interface.ts, requests.ts, extra-reducers.ts, selectors.ts, index.ts
- [ ] Endpoint constants at top of requests.ts in UPPER_SNAKE_CASE
- [ ] Each thunk uses axios CancelToken and condition guard
- [ ] GET: Pending/Fulfilled/Rejected handlers set isLoading, error, and data
- [ ] POST/PUT: only toggle isLoading
- [ ] State groups organized by API with blank lines
- [ ] Error fields use `error<Entity>: string | null` (not `is<Entity>Error: boolean`)
- [ ] selectors.ts has base + component-specific selectors using createSelector
- [ ] index.ts exports: actions, reducer (default), thunks, selectors, types
- [ ] Reducer wired in src/store/slices/index.ts -->