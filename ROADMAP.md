# Roadmap / Todo

Forward-looking items to track. Add, edit, or check off directly. Newest at top.

---

## Open

### 1. Broker savings in reply copy
When replying to brokers, include the savings amount and frame it so the broker can pass it through to their buyer/borrower:
> "Tell your buyer you saved them $X."

Make savings explicit and pass-through-able in all broker outreach/reply templates.

- [ ] Audit existing broker reply templates
- [ ] Add savings amount + pass-through framing
- [ ] Apply to resolute outreach tone (already used in share modal)

---

### 2. Garden TPS ↔ BetterClose order/status webhooks
Wire Garden TPS to notify BetterClose on order lifecycle events.

**On order opened in TPS:**
- TPS sends BetterClose the order details
- BetterClose alerts the buyer/borrower that their dashboard is ready to view

**On TPS status changes (e.g., closing, etc.):**
- TPS pings BetterClose
- BetterClose updates the dashboard and alerts the user

- [ ] Define exact trigger actions with Garden staff (closing + others TBD)
- [ ] Spec the TPS → BetterClose payload
- [ ] Build webhook receiver on BetterClose
- [ ] Wire dashboard update + user alert flows

---

### 3. Vendor portal
A portal for brokers, agents, and other vendors to:
- Get detailed quotes
- Place orders
- (Other features TBD)

- [ ] Define vendor roles (broker, agent, …)
- [ ] Quote flow for vendors
- [ ] Order placement
- [ ] Auth / account model

---

## Done

_(none yet)_
