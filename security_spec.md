# Security Specification & Test Payloads

## 1. Data Invariants
- Reports can be created by any user or guest, but updates to official notes, status, or resolution must be protected.
- Upvote count increments are permitted.
- Comments and Verifications belong to specific reports.
- User profile editing is restricted to the account owner (`request.auth.uid == userId`).

## 2. Dirty Dozen Payloads & Test Scenarios
1. **Unauthenticated User Profile Mutation**: An unauthenticated request attempting to write to `/users/{userId}` -> PERMISSION_DENIED.
2. **User Profile Owner Spoofing**: User `user-A` attempting to modify `/users/user-B` -> PERMISSION_DENIED.
3. **Invalid Report Schema**: Report missing required `title` or `category` -> PERMISSION_DENIED.
4. **Oversized String Injection**: Report `description` exceeding 2000 chars -> PERMISSION_DENIED.
5. **Path Variable ID Injection**: Document ID containing illegal SQL/Script injection chars -> PERMISSION_DENIED.
6. **Unauthenticated Comment Creation**: Unauthorized attempt to create a comment with falsified roles -> PERMISSION_DENIED.
7. **Comment Owner Impersonation**: User creating a comment under someone else's UID -> PERMISSION_DENIED.
8. **Invalid Status Transition Injection**: Setting a report status to an undefined string -> PERMISSION_DENIED.
9. **Hashtag System Manipulation**: Direct client update to arbitrary hashtag counters without valid formatting -> PERMISSION_DENIED.
10. **Shadow Key Update**: Injecting unauthorized fields into a report update -> PERMISSION_DENIED.
11. **Verification Impersonation**: Submitting a verification report for another user UID -> PERMISSION_DENIED.
12. **Blanket Query Scraping**: Listing user profiles without auth or filtering -> PERMISSION_DENIED.
