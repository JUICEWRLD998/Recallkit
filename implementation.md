# RecallKit Implementation Plan

## 1. Project Summary

**RecallKit** is a product-recall communication studio built around Unlayer
Elements. A user enters one recall incident and receives three coordinated,
production-quality outputs:

1. A responsive customer recall email.
2. A print-ready retailer action bulletin.
3. A public recall status page with an affected-batch checker.

The project is designed for the Unlayer Build with Elements Challenge ending
July 31, 2026. The goal is not to make another newsletter template. RecallKit
should demonstrate how Elements can power a complete, realistic communication
workflow from one source of truth.

The judged version will be a static, client-side application. It will require no
login, backend, paid service, or API key.

## 2. Winning Thesis

RecallKit is intended to score strongly against every judging category:

| Judging category | RecallKit response |
| --- | --- |
| Originality | An operational recall workflow instead of a generic marketing email or report generator. |
| Design quality | A custom safety-communication visual system, polished editor, realistic product imagery, responsive email, and controlled print typography. |
| Practical value | Customer support, retail operations, and public communications all use the same verified incident data. |
| Effective Elements use | Dedicated Email, Document, and Web output trees, reusable tools, responsive behavior, static rendering, and JSON export. |
| Overall execution | Live demo, sample case, exports, validation, tests, screenshots, GIF, architecture explanation, and public deployment. |

The memorable demonstration will be changing a batch number or safety action
once and watching it update correctly in the email, retailer bulletin, and
public notice.

## 3. Product Goals

### Primary goals

- Make Elements visibly central to the project.
- Produce templates that look credible enough for a real product operations
  team.
- Make the demo understandable within 20 seconds without instructions.
- Keep all three communication outputs visually related but appropriately
  adapted to their channel.
- Make the repository exceptionally easy for judges to run and inspect.
- Complete the core implementation early enough to reserve time for visual
  polish, screenshots, and submission quality.

### Non-goals

- Sending real email.
- Offering a drag-and-drop template editor.
- Providing legal or regulatory compliance advice.
- Connecting to inventory, CRM, or commerce systems.
- Supporting real customer records or personally identifiable information.
- Generating arbitrary PDFs through a hosted service.
- Making generative AI part of the judged workflow.
- Building authentication, a database, or a backend.

## 4. Target User and Core Scenario

The target user is an operations or communications manager at a consumer
product company.

The preloaded demo case will describe a clearly fictional portable power bank
recall. The case will contain:

- A fictional company and product name.
- A realistic product packshot created specifically for the project.
- A high-severity overheating risk.
- Several affected batch identifiers.
- Clear stop-use and return instructions.
- Refund or replacement information.
- A fictional verification URL, support number, and recall ID.

Every screen, screenshot, and README section must label the case as fictional.
No real company, certification, regulator, or product claim will be implied.

## 5. User Experience

### First viewport

The application opens directly into the working studio. There is no marketing
landing page.

Desktop layout:

- Compact header with RecallKit identity, case status, reset, and export menu.
- Fixed-width editor rail on the left.
- Large preview workspace on the right.
- Segmented output tabs for Email, Retailer Bulletin, and Public Notice.
- Preview controls for desktop/mobile width where relevant.

Mobile layout:

- Header remains compact.
- Editor and preview become top-level tabs.
- Form fields use the full viewport width.
- Preview widths are constrained without causing horizontal page overflow.
- Export actions live in a bottom sheet or compact menu.

### Primary workflow

1. The user opens the app and immediately sees a complete sample recall.
2. The user edits structured incident fields in the left rail.
3. All affected templates update without a manual save action.
4. The user switches between the three output tabs.
5. The user tests a batch number on the public notice.
6. The user exports HTML or JSON, or opens the print workflow.
7. The app restores the latest draft after a refresh.

### Editor sections

The form will use an accordion or section navigation with these groups:

1. **Incident**
   - Recall title
   - Recall ID
   - Announcement date
   - Severity: Critical, High, or Advisory
   - Current status: Active, Updated, or Resolved

2. **Product**
   - Company name
   - Product name
   - Model
   - Product image URL
   - Affected batch identifiers

3. **Risk**
   - Short risk headline
   - Plain-language risk description
   - Optional reported incident count
   - Optional injury count

4. **Customer action**
   - Immediate action
   - Ordered action steps
   - Remedy type
   - Refund amount or replacement description
   - Optional response deadline

5. **Support**
   - Verification URL
   - Support phone
   - Support email
   - Support hours
   - Return instructions

### Interaction requirements

- All controls must have visible labels.
- Severity and status use segmented controls, not text fields.
- Batch identifiers use a repeatable list control.
- Ordered action steps can be added, edited, reordered, and removed.
- Destructive actions require confirmation.
- Reset restores the original fictional sample.
- Autosave is debounced and visibly confirmed without toasts on every edit.
- Validation appears next to the relevant field.
- Export actions are disabled only when required information is invalid.
- Keyboard focus and hover states must be clearly visible.
- Motion must be subtle and respect `prefers-reduced-motion`.

## 6. Visual Direction

### Design character

The visual language should feel precise, calm, and operational under pressure.
It must not resemble a generic SaaS dashboard or a marketing landing page.

The chosen direction is an editorial safety system influenced by product
manuals, incident-control documents, and high-quality industrial packaging:

- Strong information hierarchy.
- Thin rules and disciplined alignment.
- Large incident identifiers and batch codes.
- Limited use of warning color.
- Clear action numbering.
- High-contrast product photography.
- Dense but readable retailer documentation.

### Color system

Use a neutral foundation with functional accents:

- Ink: near-black charcoal.
- Paper: cool off-white.
- Surface: white.
- Critical: safety red.
- Warning: amber.
- Confirmed/safe: teal.
- Muted text: neutral gray.
- Borders: cool light gray.

Red must be reserved for genuine risk or destructive actions. The application
must not become a monochromatic red interface.

### Typography

- App interface: a locally bundled, highly legible variable sans-serif.
- IDs and batch codes: a locally bundled monospace face.
- Email output: email-safe system font stack.
- Document output: conservative sans-serif stack with controlled print sizes.
- No viewport-width font scaling.
- Letter spacing remains zero except where a short uppercase incident label
  requires a small positive value.

### Layout and component rules

- Use an 8px maximum corner radius.
- Avoid floating page-section cards and nested cards.
- Use cards only for individual repeated records or genuinely framed tools.
- Use Lucide icons for familiar actions.
- Icon-only buttons require accessible labels and tooltips.
- Maintain fixed control heights to prevent layout movement.
- Keep the primary preview unframed except for the actual email or paper edge.
- Use subtle borders and surface changes instead of excessive shadows.
- Never place help text in the UI that explains obvious functionality.

### Image assets

Create a realistic fictional power-bank product packshot using the `imagegen`
skill during implementation. Required outputs:

- Primary front three-quarter product image.
- Transparent or clean light-gray background.
- High enough resolution for retina web and print screenshots.
- No real logos, certifications, or copied product design.
- Optional close-up crop showing where a batch number would be found.

The actual product must be clearly visible in every main output. Atmospheric
stock imagery is not appropriate for this project.

## 7. Template Specifications

### 7.1 Customer Recall Email

Purpose: communicate urgency without panic and make the required action
impossible to miss.

Required structure:

1. Hidden preheader text.
2. Company wordmark and recall status.
3. Severity banner.
4. Plain-language recall headline.
5. Product image and model information.
6. Affected batch panel.
7. Risk summary.
8. Numbered immediate-action steps.
9. Refund or replacement panel.
10. Primary verification call to action.
11. Support details.
12. Legal/disclaimer footer.

Email-specific constraints:

- Build the output with the Elements Email root and email primitives.
- Use table-safe rows and columns.
- Do not rely on flexbox, grid, `gap`, JavaScript, forms, or complex selectors.
- Keep the main content at a conventional email width.
- Include meaningful alt text.
- Ensure the message remains understandable when images do not load.
- Test the narrow version at approximately 320px and the standard version at
  approximately 600px.
- Export complete email-ready HTML, not only the inner React markup.

### 7.2 Retailer Action Bulletin

Purpose: give store and warehouse staff a printable operational checklist.

Required structure:

1. Recall ID, issue date, status, and severity.
2. Product image and identification table.
3. Affected models and batches.
4. Immediate quarantine checklist.
5. Instructions for handling customer questions.
6. Return and inventory disposition instructions.
7. Escalation contacts.
8. Staff acknowledgement area.
9. Fictional-data disclaimer.

Document-specific constraints:

- Use the Elements Document root and document primitives.
- Target A4 first and confirm acceptable US Letter behavior.
- Keep critical identification content on the first page.
- Control page breaks around tables and action groups.
- Avoid clipped content, orphaned headings, and color-dependent meaning.
- Provide a clean browser print/PDF flow.
- Print without application chrome, controls, or background artifacts.

### 7.3 Public Recall Status Page

Purpose: provide the authoritative public summary and let a customer check a
batch identifier.

Required structure:

1. Current status strip.
2. Recall title and announcement metadata.
3. Product image and identification.
4. Risk summary.
5. Interactive batch checker.
6. Immediate action steps.
7. Remedy information.
8. Frequently asked questions.
9. Support and verification links.
10. Last-updated timestamp and fictional-data disclaimer.

Batch checker behavior:

- Normalize spaces, casing, and common separators.
- Return one of three states: affected, not found, or invalid.
- Never state that “not found” proves a product is safe.
- Give the user a support escalation path for uncertain results.
- Keep the checker fully client-side and driven by the current form state.

Web-specific constraints:

- Use the Elements Web root and web primitives for the generated page.
- Ensure correct responsive stacking.
- Use semantic headings and landmarks.
- Keep status meaning available to assistive technology.
- Support keyboard-only use.

## 8. Shared Data Contract

Create a single typed domain object:

```ts
type RecallSeverity = "critical" | "high" | "advisory";
type RecallStatus = "active" | "updated" | "resolved";
type RemedyType = "refund" | "replacement" | "repair";

interface RecallIncident {
  id: string;
  title: string;
  announcedAt: string;
  updatedAt: string;
  severity: RecallSeverity;
  status: RecallStatus;
  company: {
    name: string;
    supportEmail: string;
    supportPhone: string;
    supportHours: string;
    verificationUrl: string;
  };
  product: {
    name: string;
    model: string;
    imageUrl: string;
    affectedBatches: string[];
  };
  risk: {
    headline: string;
    description: string;
    reportedIncidents?: number;
    reportedInjuries?: number;
  };
  action: {
    immediateInstruction: string;
    steps: string[];
    remedyType: RemedyType;
    remedyDescription: string;
    responseDeadline?: string;
    returnInstructions: string;
  };
}
```

Implementation rules:

- Validate the object with a Zod schema.
- Store dates in ISO format and format them only at render boundaries.
- Keep all template props JSON-serializable.
- Keep channel-specific presentation logic out of the form state.
- Derive labels, formatted dates, and severity colors through selectors.
- Do not duplicate incident content separately for each template.

## 9. Technical Architecture

### Stack

- Vite
- React
- TypeScript with strict mode
- `@unlayer/react-elements`
- Zod
- Lucide React
- CSS Modules plus global design tokens
- Vitest and Testing Library
- Playwright
- ESLint and Prettier
- npm and a committed lockfile

Do not add a global state framework. Use `useReducer`, typed context where
needed, and localStorage persistence.

### Rendering boundaries

The application shell may use ordinary React and CSS. Every generated
communication artifact must use the appropriate Elements root and primitives.

Keep separate output entry components:

- `CustomerRecallEmail`
- `RetailerActionBulletin`
- `PublicRecallNotice`

Share data selectors, design tokens, and small channel-compatible content
helpers. Do not force one identical layout tree across email, print, and web;
each medium has different constraints.

### Preview strategy

- Email preview: render generated markup into a sandboxed `iframe` using
  `srcDoc`.
- Document preview: render a paper-sized preview and print only its isolated
  output.
- Web preview: render the Elements tree directly inside a constrained preview
  surface.
- Do not inject unsanitized arbitrary HTML from form values.

### Export strategy

- Email: download complete `.html`.
- All outputs: download the Elements JSON tree where supported.
- Incident data: download a reusable `.json` case file.
- Document: open browser print with print-specific styles.
- Copy HTML: use the Clipboard API and provide an explicit success state.

### Suggested source organization

```text
src/
  app/
  components/
    editor/
    preview/
    ui/
  data/
    sample-incident.ts
  domain/
    recall-schema.ts
    recall-selectors.ts
  templates/
    email/
    document/
    web/
    shared/
  lib/
    elements-rendering.ts
    export.ts
    persistence.ts
  styles/
    tokens.css
    global.css
tests/
  unit/
  e2e/
public/
  assets/
```

## 10. Installed Skill Workflow

The following skills have been installed and must be read at the start of the
implementation turn:

1. `frontend-design`
   - Establish the distinctive visual concept before writing UI code.
   - Prevent generic dashboard styling and weak default composition.

2. `web-design-guidelines`
   - Audit accessibility, interaction states, responsive behavior, forms,
     content overflow, and common interface failures.

3. `unlayer-elements`
   - Follow the official Elements component hierarchy, prop contracts,
     serialization rules, rendering functions, and custom-tool patterns.

The official Elements skill takes precedence for Elements API usage. The local
project requirements in this document take precedence for product scope and
submission strategy.

## 11. Implementation Phases

### Phase 0: Repository and API Spike

**Estimate:** 2 hours

Tasks:

- Initialize the Vite React TypeScript project.
- Initialize Git and establish the public-repository-ready branch structure.
- Install the minimum dependencies.
- Read all three installed skills.
- Render one small Email, Document, and Web example.
- Confirm browser-compatible static markup generation.
- Confirm JSON export behavior.
- Confirm the supported print path.
- Record any package-specific constraints in code comments or project notes.
- Pin the working Elements version in the lockfile because the package is in
  active development.

Exit criteria:

- All three Elements roots render successfully.
- One email HTML export downloads and opens.
- One document preview prints without app chrome.
- No architectural uncertainty remains around the package APIs.

### Phase 1: Domain Model and Sample Incident

**Estimate:** 2 hours

Tasks:

- Implement the `RecallIncident` TypeScript type and Zod schema.
- Add the complete fictional sample incident.
- Add selectors for formatted dates, severity labels, status labels, batch
  normalization, and optional-field visibility.
- Implement affected-batch matching with tests.
- Implement reducer actions for all editable fields.
- Add versioned localStorage persistence and safe fallback to sample data.

Exit criteria:

- Invalid saved data cannot crash the application.
- The sample incident validates without warnings.
- Batch matching handles case, spaces, and separators correctly.

### Phase 2: App Shell and Guided Editor

**Estimate:** 4 hours

Tasks:

- Build the responsive application shell.
- Add header identity and high-value actions.
- Build the editor section navigation.
- Implement all form controls and repeatable list controls.
- Add inline validation and dirty/saved state.
- Add reset confirmation.
- Build output tabs and preview-width controls.
- Establish tokens, typography, icon sizing, focus rings, and control heights.

Exit criteria:

- Every incident field is editable.
- Preview state updates immediately.
- The shell works at 375px, 768px, and 1440px widths.
- No content overlaps or causes page-level horizontal scrolling.

### Phase 3: Shared Elements and Visual System

**Estimate:** 3 hours

Tasks:

- Define channel-aware severity treatments.
- Implement reusable product identity, batch identification, action step,
  remedy, and support sections.
- Keep props serializable and compatible with the Elements tree rules.
- Add consistent spacing, type scales, rules, labels, and status language.
- Generate and integrate the fictional product imagery.
- Ensure every output still works when the image fails to load.

Exit criteria:

- Shared data produces consistent language across all outputs.
- Each output looks related without sharing an inappropriate identical layout.
- Product identity and immediate action are visible without scrolling in each
  primary preview.

### Phase 4: Customer Email Template

**Estimate:** 4 hours

Tasks:

- Implement the complete email structure.
- Add preheader and image fallback behavior.
- Build email-safe action steps and remedy callout.
- Add responsive column stacking.
- Add plain-text-equivalent content ordering.
- Integrate HTML and JSON export.
- Inspect generated markup for invalid or unsupported styling.

Exit criteria:

- Email is readable at 320px and polished at 600px.
- The action, affected batches, remedy, and support path are unambiguous.
- Exported HTML opens independently and reflects the latest editor state.

### Phase 5: Retailer Bulletin

**Estimate:** 4 hours

Tasks:

- Implement A4 document composition.
- Add product and batch tables.
- Add quarantine and escalation checklists.
- Add staff acknowledgement fields.
- Add print-only and screen-preview styles.
- Tune page-break behavior for typical and long data.
- Test US Letter as a compatibility case.

Exit criteria:

- Critical identification content appears on page one.
- No important block is split incoherently.
- The bulletin is useful in grayscale.
- Browser print produces a clean document with no application UI.

### Phase 6: Public Notice and Batch Checker

**Estimate:** 4 hours

Tasks:

- Implement the responsive public notice.
- Add the interactive batch checker and all three result states.
- Add FAQ content derived from the incident.
- Add accessible status announcements for checker results.
- Add link, phone, and email handling.
- Verify keyboard navigation and small-screen layout.

Exit criteria:

- Known affected batches return the affected state.
- Unknown batches use cautious language and direct users to support.
- Invalid input receives actionable validation.
- The generated public notice is complete without relying on app chrome.

### Phase 7: Export, Persistence, and Failure States

**Estimate:** 3 hours

Tasks:

- Complete HTML, JSON, case-data, copy, and print actions.
- Add export filenames containing the sanitized recall ID and date.
- Add graceful failures for clipboard, storage, image, and rendering errors.
- Add loading states only where an action can take noticeable time.
- Verify that no secret or network dependency exists.

Exit criteria:

- Every export has meaningful content and a predictable filename.
- Refresh restores valid work.
- Corrupted storage resets safely.
- Export errors do not destroy the current draft.

### Phase 8: Visual Polish and Design Review

**Estimate:** 4 hours

Tasks:

- Apply the `frontend-design` skill review.
- Tighten spacing, alignment, typography, icons, and state transitions.
- Remove generic cards, unnecessary labels, and decorative effects.
- Check the longest realistic field values.
- Verify image cropping and retina quality.
- Add polished empty, invalid, saved, and export-success states.
- Confirm consistent severity semantics across app, email, document, and web.

Exit criteria:

- The first viewport looks submission-ready at desktop and mobile sizes.
- No text is clipped or visually cramped.
- The interface has a recognizable RecallKit identity.
- Screenshots require no special cropping to appear polished.

### Phase 9: Automated and Manual Quality Assurance

**Estimate:** 4 hours

Tasks:

- Add unit tests for schema, selectors, batch matching, and export filenames.
- Add component tests for conditional fields and severity content.
- Add Playwright coverage for the primary editing and export workflow.
- Capture desktop, mobile, email, and document visual snapshots.
- Run the `web-design-guidelines` audit.
- Test keyboard-only operation.
- Test reduced motion.
- Run Lighthouse against the production build.
- Inspect browser console output.
- Verify all public assets and links.

Quality gates:

- TypeScript, lint, unit tests, and production build pass.
- No uncaught console errors.
- No incoherent overlap at supported viewports.
- Accessibility Lighthouse target: 95 or higher.
- Best Practices Lighthouse target: 95 or higher.
- Core functionality remains usable without persisted localStorage.

### Phase 10: README, Demo, and Submission

**Estimate:** 4 hours

Tasks:

- Write a concise, judge-oriented README.
- Explain the problem before discussing implementation details.
- Include an Elements usage matrix.
- Include architecture and data-flow diagrams.
- Add exact install, run, test, build, and deployment commands.
- Add four strong screenshots and a short GIF.
- Explain the fictional sample and non-compliance disclaimer.
- Deploy to GitHub Pages and test the production URL.
- Verify the repository is public and contains all source code.
- Add repository topics, description, social preview image, and license.
- Prepare the official form response and `#BuiltWithElements` post.
- Manually support/star the official Elements repository.

Exit criteria:

- A judge can understand the value in under 30 seconds.
- A developer can run the project using only the README.
- Every challenge qualification item is visibly satisfied.
- The submission form and public post are completed before July 31, 2026.

## 12. Testing Matrix

| Area | Required cases |
| --- | --- |
| Validation | Empty required fields, malformed URLs, invalid dates, empty batches, excessively long values |
| Severity | Critical, High, Advisory across all outputs |
| Status | Active, Updated, Resolved |
| Optional data | No incident count, no injuries, no deadline, no refund amount |
| Batch checker | Exact match, lowercase, extra spaces, hyphens, unknown value, blank value |
| Email | 320px, 600px, blocked images, long batch list |
| Document | A4, US Letter, two-page case, grayscale, long instructions |
| Web | 375px, 768px, 1440px, keyboard navigation, screen-reader result announcement |
| Persistence | Fresh visit, saved draft, corrupted data, schema version mismatch |
| Export | HTML, Elements JSON, case JSON, clipboard, print cancellation, export failure |

## 13. README Structure

The final README will use this order:

1. Product name, one-sentence value proposition, and best screenshot.
2. Live demo link.
3. The problem RecallKit solves.
4. The three generated outputs.
5. Short demo GIF.
6. Why Elements is core to the implementation.
7. Elements usage matrix.
8. Architecture and data flow.
9. Local setup.
10. Available commands.
11. Testing and quality notes.
12. Project structure.
13. Fictional-data and legal disclaimer.
14. Challenge attribution and license.

Avoid a long origin story. The first screen of the README must show the actual
product and rendered templates.

## 14. Submission Assets

Required final assets:

- Main studio desktop screenshot.
- Mobile editor screenshot.
- Customer email screenshot at realistic email width.
- Retailer bulletin print screenshot.
- Public notice and batch-checker screenshot.
- A 10-15 second GIF showing one edit updating all three outputs.
- GitHub social preview image.
- Short public launch post.
- Longer submission-form description.

The GIF sequence:

1. Open on the customer email.
2. Change an affected batch in the editor.
3. Switch to the retailer bulletin.
4. Switch to the public page.
5. Enter the changed batch and show the affected result.

## 15. Delivery Schedule

### Saturday, July 25

- Complete Phases 0 and 1.
- Begin the app shell.

### Sunday, July 26

- Complete Phase 2.
- Complete the shared Elements system.

### Monday, July 27

- Complete the customer email.
- Begin retailer bulletin.

### Tuesday, July 28

- Complete retailer bulletin and public notice.

### Wednesday, July 29

- Complete exports, persistence, and visual polish.

### Thursday, July 30

- Complete automated testing, accessibility review, screenshots, GIF, README,
  and deployment.

### Friday, July 31

- Perform only final fixes.
- Audit qualification requirements.
- Submit the form and publish the social post early, leaving time for deployment
  or form failures.

## 16. Risks and Mitigations

### Elements API changes

Risk: the library is evolving and APIs may differ from examples.

Mitigation: complete the three-root rendering spike first, use the official
skill, pin the installed version, and avoid upgrading after templates are
stable.

### Email-client limitations

Risk: a visually ambitious design may fail in real email markup.

Mitigation: use Elements email primitives, conservative styles, table-safe
layout, meaningful text ordering, and blocked-image testing.

### Print overflow

Risk: long content may create awkward page breaks.

Mitigation: establish realistic field limits, test a deliberately long case,
and apply explicit print break rules to grouped content.

### Scope pressure

Risk: exports and app polish can consume the time reserved for the submission.

Mitigation: keep the app static, exclude AI and backend work, finish all core
templates by July 28, and treat README/screenshots as required product work.

### Generic visual result

Risk: default form controls and card-heavy layouts can make the project look
like a quick hackathon dashboard.

Mitigation: use the installed frontend-design skill before implementation,
establish the visual system in Phase 2, use custom imagery, and reserve a full
polish phase.

## 17. Definition of Done

RecallKit is complete only when:

- Elements is the rendering foundation for all three generated outputs.
- The email, document, and web templates are visibly polished.
- The sample case is complete and clearly fictional.
- Editing one incident updates every output.
- The batch checker works and uses cautious status language.
- HTML, JSON, case-data, and print exports work.
- The app is responsive and keyboard accessible.
- Automated checks and the production build pass.
- The repository contains complete source code and a strong README.
- Screenshots and a GIF show the rendered templates.
- The application is publicly deployed.
- The Elements repository has been supported/starred.
- The submission form and public `#BuiltWithElements` post are completed before
  the July 31, 2026 deadline.
