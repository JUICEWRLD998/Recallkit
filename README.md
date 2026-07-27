# RecallKit

RecallKit is a code-first product-recall communication studio built with React, TypeScript, and [`@unlayer/react-elements`](https://www.npmjs.com/package/@unlayer/react-elements). It turns one structured incident record into three coordinated, production-oriented templates:

1. a customer recall email;
2. a printable retailer action bulletin; and
3. a responsive public recall web page.

Teams enter the recall information once and RecallKit keeps the content, affected batch numbers, status, severity, contact details, and brand colors consistent across every channel. Each template can be previewed in the browser and exported as standalone HTML or Unlayer design JSON.



## Why RecallKit exists

A product recall often requires several messages for different audiences. Writing each message separately is slow and makes it easy for important details to drift between channels. RecallKit uses a shared, validated data model so that a change to a batch number, instruction, deadline, support contact, or brand color is reflected immediately in all three outputs.

The project demonstrates how Unlayer Elements can be used as a code-first template system rather than a drag-and-drop editor. The templates remain ordinary typed React functions while Elements handles the channel-specific output structure.

## Features

- One guided editor for incident, product, response, contact, and theme data
- Live, isolated previews for email, document, and web outputs
- Desktop and mobile email preview widths
- A4 and US Letter document preview widths
- Full-width, tablet, and mobile web previews
- Shared color composer with Violet, Teal, Navy, and Crimson presets
- Product image upload and repeatable affected-batch fields
- Reorderable customer action steps
- Severity, status, remedy, deadline, and incident-count support
- Automatic draft saving to browser `localStorage`
- Field validation before export
- Standalone HTML download for the selected template
- Unlayer-compatible design JSON download
- One-click HTML copy
- Browser print workflow for the retailer bulletin
- Light and dark application themes

## The three template types

| Type | Template | Audience | Purpose | Preview modes | Available output |
| --- | --- | --- | --- | --- | --- |
| Email | **Customer Recall Email** | Customers who may own the recalled product | Explains the risk, helps customers identify affected units, and gives clear action and remedy steps | Desktop, Mobile | HTML, JSON, copied HTML |
| Document | **Retailer Action Bulletin** | Retail stores, managers, and operational staff | Provides quarantine, inventory, escalation, return, and staff acknowledgement instructions | A4, Letter | HTML, JSON, print/PDF workflow |
| Web | **Public Recall Notice** | The general public and product owners | Publishes a responsive status page with recall details, affected batches, actions, and support information | Full, Tablet, Mobile | HTML, JSON, copied HTML |

### Customer Recall Email

The email is designed for broad email-client compatibility. It includes inbox preview text, recall status and severity, product identification, affected batch codes, the risk summary, immediate instructions, ordered next steps, remedy details, and verified support links.

Its Elements root is `<Email>`, so rows and columns render as email-safe, table-based HTML suitable for clients such as Gmail, Outlook, and Yahoo.

Source: [`src/templates/email/CustomerRecallEmail.tsx`](./src/templates/email/CustomerRecallEmail.tsx)

### Retailer Action Bulletin

The bulletin is a print-oriented operational document. It includes a high-visibility recall identifier, product and batch details, a quarantine checklist, inventory disposition instructions, escalation triggers and contacts, and acknowledgement fields for staff.

Its Elements root is `<Document>`. RecallKit adds print-specific CSS after rendering to improve A4/Letter presentation, preserve colors, and reduce awkward page breaks. Selecting **Print** opens the browser print workflow, where the bulletin can also be saved as a PDF.

Sources: [`src/templates/document/RetailerActionBulletin.tsx`](./src/templates/document/RetailerActionBulletin.tsx) and [`src/templates/document/render-retailer-bulletin.ts`](./src/templates/document/render-retailer-bulletin.ts)

### Public Recall Notice

The web notice is a responsive public-facing page. It presents the current recall status, product and risk details, affected batches, action steps, remedy information, and support contacts in a layout that adapts from desktop to mobile.

Its Elements root is `<Page>`, which produces responsive web HTML using web-oriented layout primitives.

Source: [`src/templates/web/PublicRecallNotice.tsx`](./src/templates/web/PublicRecallNotice.tsx)

## Download the templates

The public download links will be added here when they are available.

| Template | HTML download | JSON download |
| --- | --- | --- |
| Customer Recall Email | _Link coming soon_ | _Link coming soon_ |
| Retailer Action Bulletin | _Link coming soon_ | _Link coming soon_ |
| Public Recall Notice | _Link coming soon_ | _Link coming soon_ |

The HTML files are complete, standalone documents that can be opened directly in a browser. The JSON files contain Unlayer-compatible design data for continued editing or integration into an Unlayer workflow.

## How Unlayer Elements is used

RecallKit uses `@unlayer/react-elements` as its template rendering layer. It does **not** embed the Unlayer visual editor. Instead, each template is authored directly in TSX with typed Elements components.

### 1. A mode-specific root selects the output channel

Each template starts with the root component for its target:

```tsx
<Email>...</Email>       // Email-safe, table-based HTML
<Document>...</Document> // Print/document-oriented HTML
<Page>...</Page>         // Responsive web HTML
```

This lets the three templates share the same development model while producing markup appropriate to their individual channels.

### 2. Templates use a strict row-and-column structure

All three outputs follow the Elements hierarchy:

```tsx
<Email>
  <Row layout={ColumnLayouts.OneColumn}>
    <Column>
      <Heading>Important recall information</Heading>
      <Paragraph text="Check your product's batch code." />
      <Button href="https://example.com/recall">Check my product</Button>
    </Column>
  </Row>
</Email>
```

- `Email`, `Document`, or `Page` is the root.
- `Row` components are direct children of the root.
- `Column` components are direct children of a row.
- Content such as `Heading`, `Paragraph`, `Image`, `Button`, `Divider`, and `Html` belongs inside columns.
- The number of columns matches the chosen `ColumnLayouts` value.

RecallKit uses this composition model for everything from single-column safety messages to two-column product and contact sections.

### 3. One typed incident record feeds every template

Each template is a React function that receives the same `RecallIncident` object:

```tsx
export interface CustomerRecallEmailProps {
  incident: RecallIncident
}

export function CustomerRecallEmail({ incident }: CustomerRecallEmailProps) {
  return <Email>{/* rows generated from incident data */}</Email>
}
```

The shared contract is defined with Zod in [`src/domain/recall-schema.ts`](./src/domain/recall-schema.ts). This prevents the email, bulletin, and page from developing separate or incompatible content models.

### 4. Shared design values keep all channels consistent

Shared color and typography helpers live under [`src/templates/shared`](./src/templates/shared). The selected accent and ink colors are converted into a complete template palette and reused across the three designs. Severity and status helpers also map operational meaning to consistent visual treatments.

The templates use Elements properties such as `backgroundColor`, `contentWidth`, `fontFamily`, `padding`, `borderRadius`, `fontSize`, and `lineHeight`. More specialized fragments use the `Html` component or the `html` property for controlled inline markup such as badges, batch plates, checklist boxes, and document acknowledgement fields.

### 5. Elements renders both HTML and design JSON

The app calls the two Elements renderers in [`src/App.tsx`](./src/App.tsx):

```tsx
const html = renderToHtml(CustomerRecallEmail({ incident }), {
  title: 'Customer Recall Email',
})

const json = renderToJson(CustomerRecallEmail({ incident }))
```

The template factory is called directly so the renderer receives the Elements root. The resulting HTML is shown inside an isolated iframe and can be copied or downloaded. The JSON is formatted and downloaded as an Unlayer design file.

### Rendering flow

```text
Guided editor
     │
     ▼
Validated RecallIncident
     │
     ├── CustomerRecallEmail ─── <Email> ─── HTML / JSON
     ├── RetailerActionBulletin ─ <Document> ─ HTML / JSON / Print
     └── PublicRecallNotice ───── <Page> ───── HTML / JSON
```

## Getting started

### Prerequisites

- Node.js 24 or a compatible current Node.js release
- npm 11 or a compatible current npm release

### Installation

```bash
git clone <repository-url>
cd recallkit
npm install
```

Replace `<repository-url>` with this repository's Git URL.

### Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

### Create a production build

```bash
npm run build
```

The optimized application is written to `dist/`.

### Preview the production build

```bash
npm run preview
```

## Using the application

1. Open RecallKit in the browser. A fictional sample incident is loaded automatically.
2. Edit the incident title, ID, announcement date, severity, and status.
3. Choose a color preset or set custom accent and ink colors.
4. Enter the company, product, model, product photo, and affected batches.
5. Add the risk details, immediate instruction, ordered action steps, remedy, and optional response deadline.
6. Add the verification URL, support phone number, and support email address.
7. Switch between **Email**, **Bulletin**, and **Web** to inspect each live preview.
8. Use the width controls to check the output at its relevant desktop, print, tablet, or mobile size.
9. Choose **Copy HTML**, **HTML**, or **JSON** to export the selected output. For the bulletin, choose **Print** to print it or save it as a PDF.

Edits are saved automatically in the current browser. **Reset** clears the saved draft and restores the included sample incident.

## Export behavior

RecallKit validates the current incident before exporting. If required data is invalid, export controls are disabled and the relevant editor fields show errors.

Downloaded files use this naming pattern:

```text
recallkit-{type}-{recall-id}-{YYYY-MM-DD}.{extension}
```

For example:

```text
recallkit-email-RK-2026-071-2026-07-27.html
recallkit-document-RK-2026-071-2026-07-27.json
recallkit-page-RK-2026-071-2026-07-27.html
```

| Format | What it contains | Typical use |
| --- | --- | --- |
| HTML | A complete rendered HTML document | Browser preview, hosting, email delivery integration, printing, or downstream processing |
| JSON | Unlayer-compatible design data | Importing, storing, or continuing an Unlayer-based design workflow |
| Print/PDF | The rendered retailer bulletin through the browser print dialog | Store distribution, operational handouts, or PDF archival |

## Data and persistence

The shared incident model includes:

- recall ID, title, announcement/update dates, severity, and status;
- brand accent and ink colors;
- company name and support information;
- product name, model, image, and affected batches;
- risk headline, description, incident count, and injury count; and
- immediate instructions, ordered steps, remedy, deadline, and return instructions.

Zod validates this data at the application boundary. Drafts are stored locally under a versioned `localStorage` entry and are not sent to a server by this project. If saved data is missing, outdated, or invalid, RecallKit safely falls back to the sample incident.

## Project structure

```text
src/
├── app/                    # Application shell, header, and output tabs
├── components/
│   ├── editor/             # Guided recall-data editor sections
│   ├── preview/            # Isolated HTML preview frames and width controls
│   └── ui/                 # Reusable form and interface components
├── data/                   # Fictional sample incident
├── domain/                 # Zod schema, validation, reducer, and selectors
├── lib/                    # Browser persistence, downloads, and printing
├── templates/
│   ├── email/              # Customer Recall Email
│   ├── document/           # Retailer Action Bulletin and print renderer
│   ├── web/                # Public Recall Notice
│   └── shared/             # Shared template colors and typography
├── App.tsx                 # Rendering, preview, persistence, and export flow
└── main.tsx                # React entry point

tests/unit/                 # Unit and template-rendering tests
docs/                       # Verification notes and screenshots
implementation.md           # Detailed product and implementation plan
```

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build |
| `npm run lint` | Run Oxlint |
| `npm run typecheck` | Run the TypeScript project build |
| `npm run check` | Run lint and the production build |
| `npm run preview` | Serve the production build locally |
| `npx vitest run` | Run the unit and template-rendering tests once |

## Quality checks

Before submitting a change, run:

```bash
npm run check
npx vitest run
```

The test suite covers the shared recall schema and validation, reducer behavior, persistence, batch matching, export filenames, preview isolation, and rendering behavior for all three Elements templates.

## Technology stack

- React 19
- TypeScript 6
- Vite 8
- `@unlayer/react-elements` 0.1.20
- Zod 4
- Vitest 4 with Happy DOM
- Oxlint
- Inter Variable and IBM Plex Mono
- Lucide React

## Customizing the templates

- Change the shared visual palette in [`src/templates/shared/colors.ts`](./src/templates/shared/colors.ts).
- Change shared font definitions in [`src/templates/shared/typography.ts`](./src/templates/shared/typography.ts).
- Update the default example content in [`src/data/sample-incident.ts`](./src/data/sample-incident.ts).
- Edit each channel independently in its corresponding folder under `src/templates/`.
- Extend [`src/domain/recall-schema.ts`](./src/domain/recall-schema.ts) first when adding a new shared field, then update the reducer, editor, validation, and relevant templates.

When editing Elements templates, preserve the required root → row → column → content hierarchy and keep each row's number of columns aligned with its `ColumnLayouts` value.

## Additional documentation

- [`implementation.md`](./implementation.md) — product goals, UX direction, template specifications, architecture, phases, and testing plan
- [`docs/phase-0-notes.md`](./docs/phase-0-notes.md) — initial Elements API and rendering verification notes

## License

No license has been added to this repository. Unless a license is provided, the project remains all rights reserved by its owner.
