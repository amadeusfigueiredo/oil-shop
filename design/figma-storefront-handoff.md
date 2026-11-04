# Oylo storefront: Figma design and implementation handoff

## Shared reference and current status

[Figma — Oil Shop / Storefront & Design System](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx)

The file contains editable foundations, component masters, wireframes, and ten catalog-based desktop/mobile screens. It is an implementation reference with the limitations below; it is not a completed production UI or payment integration.

The GitHub baseline inspected for this handoff is `2776086848a7c9f80325d98f21eaa20f4e5bd828`. The separate “Set up oil-shop” cloud chat reported local component refactoring, but its host was unavailable on 4 November 2026 and those changes were not found on GitHub main. Recover and inspect that work before creating a competing refactor.

Figma tool access stopped at the account's Starter-plan call limit. The last requested refinement did not run. Continue from the existing nodes; do not create a duplicate file or duplicate screens.

## Direction

Premium botanical commerce with warm ivory surfaces, plum purchase actions, sage accents, editorial headings, readable product information, and restrained decoration. Merchandise and buying decisions take priority over promotional ornament.

Use the actual catalog and existing shopping behavior. Do not fabricate certifications, reviews, discounts, stock claims, shipping guarantees, product benefits, or completed payments.

## Screen map

All screen links below point to page `13:20` (“03 — Storefront design”). The separate wireframe page is `9:16`; foundations and masters are on `0:1`.

| Screen | Desktop (1440px) | Mobile (390px) |
| --- | --- | --- |
| Home | [13:21](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-21) | [13:109](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-109) |
| Collection | [13:164](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-164) | [13:247](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-247) |
| Product — Lavender | [13:313](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-313) | [13:345](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-345) |
| Cart | [13:375](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-375) | [13:404](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-404) |
| Demo checkout | [13:431](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-431) | [13:473](https://www.figma.com/design/oouxziUmbVruwr5VZEKNGx?node-id=13-473) |

There are 19 main-flow prototype links. These simulate navigation, not cart mutation, form validation, or payment. Currently the different product cards lead to the single Lavender detail example. Before presenting a complete interactive prototype, add product-specific destinations or limit the linked path to Lavender. Search, account, secondary navigation, and review-order completion are not fully prototyped.

## Foundations and code mapping

There are 26 local variables and five text styles. Semantic colors alias primitives; layout tokens and component colors use bindings.

| Role | Value / design choice | Proposed CSS mapping |
| --- | --- | --- |
| Page | #FAF8F4 | --color-surface-page |
| Card | #FFFFFF | --color-surface-card |
| Strong text | #2E1935 | --color-text-primary |
| Supporting text | #726777 | --color-text-secondary |
| Primary action | #721970 | --color-action |
| Action hover | #571254 | --color-action-hover |
| Inverse text | #FFFFFF | --color-text-inverse |
| Botanical accent | #B5CFAA | --color-surface-accent |
| Border | #E4DFE2 | --color-border-control |
| Error | #B42338 | --color-danger |
| Control radius | 8px | --radius-control |
| Card radius | 16px | --radius-card |
| Spacing | 8 / 16 / 24 / 32px | --space-2 / --space-4 / --space-6 / --space-8 |

These mappings are encoded in Figma's WEB syntax. Confirm them against the recovered refactor before implementation; reuse its established names and keep one semantic source of truth.

Typography: Lato Regular/Bold for body and controls; Cormorant Garamond Medium for editorial headings. Cormorant is a proposed refinement over the app's platform-serif fallbacks. Bundle or load it deliberately and preserve readable fallbacks. The design styles are Display 64/68, Heading 40/46, Body 16/24, Label 14/20, and Small 12/18. Adapt display sizes for mobile.

Computed sRGB contrast for the actual palette: ink on ivory 15.15:1, muted on ivory 5.05:1, white on plum 10.06:1. Sage on ivory is only 1.59:1; use sage as an accent surface, not small text or the sole interactive boundary.

## Reusable component inventory

| Component | Figma master / set | Implementation expectation |
| --- | --- | --- |
| Primary button | 5:82 | Default, hover, disabled, loading; keep native button semantics and visible focus |
| Labeled field | 5:96 | Default, focus, error; label association, inline help/error, preserved value |
| Header desktop/mobile | 11:21 / 11:29 | Separate accessible navigation actions; keyboard behavior and mobile menu |
| Product card: Lavender | 10:16 | Data-driven name, brand, size, localized price, image and destination |
| Product card: Grapefruit | 10:24 | Same shared code component |
| Product card: Eucalyptus Blue | 10:32 | Same shared code component; resolve photo/size discrepancy below |
| Product card: Angelica | 10:40 | Same shared code component |

The four product masters are filled catalog examples of one intended code component, not a reason to build four React components. Shared image fallback, money formatting, quantities, filter controls, search, and feedback should remain reusable. The cloud chat reported work on these; reconcile its changes first.

## Catalog assets and content

Source: `backend/seeders/productsSeed.js` at the inspected baseline. Prices are demo seed values, not guaranteed live offers.

| Product | Brand | Seed size | Seed price |
| --- | --- | --- | --- |
| Lavender | Young Living | 15 ml | €22.44 |
| Grapefruit | Young Living | 15 ml | €17.25 |
| Eucalyptus Blue | Young Living | 15 ml | €16.45 |
| Angelica | Young Living | 5 ml | €15.88 |

The design reuses the repository's `frontend/public/assets/home.png` hero and the catalog's existing S3 product photos. No new product imagery or reviews were fabricated.

**Content discrepancy:** the Eucalyptus Blue photo visibly says 5 ml while the seed record and filename say 15 ml. Confirm the correct asset/size before release; do not silently change commercial data to match a photo.

Several source descriptions are placeholders. Use factual brand/category/size information while awaiting approved product copy. Do not expand placeholder descriptions into health or certification claims.

## Remaining design corrections

- Desktop four-column grids currently use 304px cards and 24px gaps inside 1280px: total 1288px. Set card width to 302px or use fractional columns so the final card cannot clip.
- Mobile currently uses a tall single-column list. Test a two-column collection grid at 390px (163px cards, 16px gap inside 342px), with wrapped names and a usable action. Keep product details in one column. Verify at 320px and 768px before choosing the breakpoint.
- Product-detail imagery is enlarged beyond the small source photo's useful resolution. Center a bounded photograph inside the gallery stage or obtain higher-resolution catalog assets; do not upscale until labels blur.
- Header bag counts and product-specific prototype routes need proper state coverage. Checkout remains explicitly a demo.
- Complete search, account, filter/selection, feedback, empty, loading, and recoverable-error views from actual app behavior. The main-flow screenshots do not prove those states are implemented.
- Finish Figma component review and screenshots for the affected mobile/product/cart/checkout compositions after access is restored. Do not treat the failed refinement as applied.

## Verification and implementation sequence

1. Recover the existing cloud checkout and inspect its uncommitted work. Reconcile its token/component inventory with this handoff.
2. Apply the remaining Figma corrections when tool access is restored, preserving existing IDs and instances.
3. Implement targeted changes against the shared components. Preserve routes, localization, catalog data, quantity/cart behavior, authentication, and existing demo checkout semantics.
4. Check rendered desktop, 768px, 390px, and narrow-phone layouts. Exercise keyboard focus, menus, search, filters, quantity updates, add/remove feedback, validation, and recoverable failures.
5. Run the repository's relevant lint, type, build, and existing tests. Record actual results and publish a reachable app preview if available.

Completed design checks: editable text/instance/frame hierarchy and content-image nodes were inspected; font families were verified as Lato and Cormorant Garamond; screenshots revealed the remaining grid/image issues above. No code tests were run for this documentation-only handoff. No app deployment or merge is implied.
