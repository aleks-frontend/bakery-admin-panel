# n8n Workflows

This directory contains all n8n webhook workflows that power the bakery ordering system. Import these into your n8n instance to get the full backend running.

## Workflows

| File | Method | Path | Description |
|------|--------|------|-------------|
| `🥖 Bakery order form [POST].json` | POST | `/webhook/bakery-order` | Public order form submission — validates bread availability, writes to orders sheet, sends email confirmation and Telegram notification to the bakery owner. Respects the `accepting_orders` config flag. |
| `🥖 Bakery orders webhook [GET].json` | GET | `/webhook/bread-orders` | Returns all orders from the Google Sheet for the admin panel. |
| `🥖 Bread types webhook [GET].json` | GET | `/webhook/bread-types` | Returns available bread types and prices, plus the `accepting_orders` flag. |
| `🥖 Update bakery order status [PATCH].json` | PATCH | `/webhook/bakery/orders/status` | Updates one or more order statuses. Accepts `{ orderId, status }` or `{ updates: [{ orderId, status }] }`. Allowed statuses: `Not received`, `In Progress`, `Delivered`. |
| `🥖 Admin bakery order [POST].json` | POST | `/webhook/admin/bakery-order` | Admin-only order creation — bypasses the `accepting_orders` check, no email or Telegram notifications. Used by the "Add Manual Order" feature in the admin panel. |
| `🥖 Archive bakery order [POST].json` | POST | `/webhook/bakery/orders/archive` | Moves one or more orders to the `Arhiva 2026.1` sheet tab, then removes them from `Sheet1`. Accepts `{ orderIds: [...] }`. Rows are processed bottom-to-top to avoid row-number shifting during batch operations. |
| `🥖 Delete bakery order [DELETE].json` | DELETE | `/webhook/bakery/orders` | Hard-deletes one or more orders from the Google Sheet. Accepts `{ orderIds: [...] }`. Rows are deleted bottom-to-top to avoid row-number shifting. |

## Keeping workflows in sync

When you modify a workflow in n8n:
1. Open the workflow → top-right menu → **Download**
2. Overwrite the corresponding file in this directory
3. Commit and push

When setting up on a new n8n instance:
1. Go to **Workflows → Import from file**
2. Import each JSON file
3. Re-link the Google Service Account and SMTP credentials (n8n will prompt you)
4. Activate each workflow
