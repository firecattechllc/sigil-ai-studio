# Sigil AI Studio Prototype Safety Boundary

## Status

This repository is a disposable visual and component prototype.

It is not the production Sigil application. It does not define Sigil runtime
behavior, authority, financial state, broker connectivity, reconciliation,
execution, governance, or AI-provider architecture.

## Fixture-only content

All balances, positions, proposals, receipts, hashes, venues, brokers, worker
nodes, custody systems, intelligence feeds, and system states are invented
fixtures.

## Prohibited production reuse

The following prototype behavior must not be copied into production:

- direct broker or provider calls;
- portfolio mutation in renderer state;
- proposal creation outside governed backend contracts;
- simulated execution handlers acting as runtime truth;
- autonomous or semi-autonomous execution authority;
- broker-connected or live-execution claims;
- reconciliation or ledger synchronization actions;
- runtime state overrides;
- Gemini API routes or API-key handling;
- hard-coded financial values or fallback state;
- authorization language implying broker submission.

## Permitted reuse

The production project may adapt:

- layout composition;
- spacing and typography;
- responsive grids;
- card presentation;
- navigation appearance;
- modal and drawer presentation;
- tables, filters, and visual status treatments.

All production components must bind to the existing Electron preload bridge,
governed backend state, confirmation flows, disabled reasons, audit evidence,
paper-only boundary, and broker-submission prohibition.
