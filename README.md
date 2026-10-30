# ShopEase MoMo & Market

Build ShopEase, a phone-first operational web app for a Ghanaian mobile money (MoMo) attendant who also sells phone accessories. User's original existing code ZIP was requested to be uploaded, but if the attached ZIP is unavailable, create the app using the detailed requirements below and preserve the approach of an offline-first MVP.

Requirements:
- App name ShopEase. Responsive mobile-first interface designed for Android, clean professional warm-dark navy/teal or rich neutral visual design, not generic AI gradients.
- Sections: Dashboard, MoMo transactions (deposit, withdrawal, other), accessories/products inventory, sales, expenses, daily closing/reconciliation, and reports.
- Currency is Ghana cedi (GHS/GH₵), dates/times use Ghana local context.
- Track physical cash separately from electronic float. Deposits and withdrawals affect them in opposite directions. Track fees/commission as separate values. Do not conflate transaction volume with profit.
- Accessories catalog with quantity on hand, cost price, selling price; sales decrease stock and record gross margin.
- Expense records with category and note; daily closing shows expected cash/float versus counted amounts and variances.
- Quick task flow: record a transaction or sale in as few taps as possible, accessible forms, large touch targets, accessible labels.
- Offline-first behavior as far as reliable and safe in a browser: start with IndexedDB/local storage and show clearly whether data is local-only or synced. Avoid false claims of cloud sync. Make export/backup functionality and restore/import if practical. Explain data is device/browser local until backend configured.
- Dashboard overview for today's MoMo count/value split by type, accessory sales, expenses and stock alerts.
- Role design for Owner and Attendant, but do not pretend it is securely enforced unless real authentication/backend is configured.
- No direct mobile-money-provider integration. Never request/store wallet PINs, OTPs, account credentials or unnecessary customer personal information.
- Keep it a demonstrable MVP, not certified production finance software. Include clear warnings where records are local only and advise backup.
- Use full real working forms/state/persistence, not a static mockup. Add seeded demo data only if clearly labelled and removable.
- Inspect the app after building, fix TypeScript/runtime issues, make sure previews run on mobile. Avoid paid API keys or external services without approval.
First, build a cohesive working prototype quickly. If the attached file content can be accessed as a project attachment, inspect/reuse it. Otherwise make a fresh coherent implementation from this brief and tell me that the ZIP could not be imported rather than claim it was.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2fdb6d92-5c2f-4041-99b9-f90067941536).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
