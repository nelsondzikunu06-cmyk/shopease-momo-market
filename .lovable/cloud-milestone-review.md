# ShopEase cloud milestone review — 2026-10-30

## Verified live
- Public tables, columns, RLS policies and selected RPC definitions inspected using read-only database tools.
- RLS enabled on all ten public application tables. Businesses and memberships have member-scoped SELECT policies.
- SELECT grants confirmed via `has_table_privilege` for authenticated users. The information-schema grant query returned no rows under the inspection role; direct ACL inspection confirmed grants.
- Browser URL and anon/public key present; no secret values printed.
- `record_sale(target_business, target_product, sold_quantity, override_unit_price)` checks membership and stock, locks the product row and records the sale plus stock decrement atomically. This does not provide request idempotency; repeated requests can still create duplicate sales when stock permits.

## Security blockers — no risky writes wired
- `create_shop_business(business_name)` is executable by authenticated users and assigns the caller owner. No controlled provisioning check exists.
- `claim_attendant_invitation(invitation_token)` checks a hashed token, email, expiration, revocation and prior claim, and locks its row. However, it reactivates inactive attendants, violating the requirement to reject every existing membership.
- Claim checks that JWT email is nonempty, not independently that the account email is confirmed. Hosted auth settings remain unverified.
- Concurrent claims for different invitations to the same new member also need live regression testing and unique membership constraint review.
- No SQL or permissions were changed. These vulnerabilities remain in the live database; UI disconnection does not remove RPC exposure.

## Delivered boundary
- Added library dependency, public-only lazy typed browser client, defensive tenant-scoped read adapter and configuration validation tests.
- These are scaffolding only: no auth calls, remote fetches, cloud mutations, migrations, financial reads, or selection UI invoked by the application.
- Cloud status appears under More and labels configuration separately from sync. Demo role remains local convenience only.
- Original store/key, backups, financial operations and local records unchanged.
- Repaired existing strict TypeScript issues in store demo indexing and financial form return/optional-property handling without changing ledger rules; formatted touched files and supplied explicit social metadata on all eight existing content routes.

## Validation
- 13 tests passed: seven cloud configuration/read-scoping tests, five ledger tests, one route test.
- All touched code passed targeted ESLint. Final whole-project lint failed with 606 formatting errors and seven warnings in remaining untouched files; no broad formatting rewrite performed.
- Automatic preview checks reported `build OK` at 00:54:47 and 00:55:08 UTC. No manually invoked production build: platform-managed build/typecheck workflow used; published runtime not verified.
- Browser checks visited all eight routes, verified desktop/mobile status and demo view switching, and completed local product creation, sale/stock decrement, MoMo entry, expense, report, backup export and reload persistence. Zero cloud data/auth requests and zero page errors were observed; no mobile horizontal overflow.
- Closing forms, backup restore and authenticated cloud behavior were not exercised end-to-end in this milestone.

## Deferred
- Profile decision required before authentication implementation; auth settings verification and sign-in/session/private-gate testing not completed.
- Live business selection, provisioning and invitations await follow-up security remediation.
- Auth gate, live cross-tenant denial, invitation edge cases and duplicate-request/atomic-stock integration tests cannot be claimed verified by the pure scaffolding tests.
- Financial cloud history, void-and-replace and synchronization remain unimplemented.
- No publishing requested or performed.