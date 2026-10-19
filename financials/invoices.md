# Invoicing & Payments

The **Invoices** module enables you to bill customers quickly, track receivable aging, and accept credit card payments online.

## Generating Invoices

Invoices can be created in three primary ways:

### 1. From Completed Work Orders
- Once field crews complete a job or work order milestone, click **Generate Invoice**.
- PrairieHQ pulls in the customer billing profile, tax settings, and line items (with quantities, unit prices, and discounts).

### 2. Batch Billing for Recurring Contracts
- At the end of each billing cycle (e.g., end of month), go to **Financials → Invoices → Batch Generate**.
- PrairieHQ identifies all active recurring contracts due for billing and generates monthly installment invoices in one action.

### 3. Manual Invoices
- Click **+ New Invoice** to create an ad-hoc bill with custom line items.

---

## Sending Invoices to Clients

- **Email Delivery**: Send an automated email with an attached PDF and a secure link to the [Client Portal](/portal/overview).
- **Payment Link**: Clients can click the link and pay immediately via credit card or ACH (powered by Stripe).
- **Tracking**: View when an invoice was emailed, opened, and paid.

---

## Managing Payments & Account Aging

- Record manual checks, bank transfers, or cash payments under **Record Payment**.
- Filter the invoice table by status: `Draft`, `Sent`, `Paid`, `Partially Paid`, or `Overdue`.
- Generate Accounts Receivable (A/R) aging reports to identify overdue accounts (30, 60, 90+ days).
