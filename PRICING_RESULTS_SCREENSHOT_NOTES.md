# Pricing Results Page - Visual Screenshot Notes

Since I cannot provide actual screenshots, here are detailed visual descriptions of what you'll see at `/pricing/results`:

## Desktop View (1280px+)

### Top of Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Garden DTC                                                                   │
│ (White header, subtle shadow)                                               │
└─────────────────────────────────────────────────────────────────────────────┘

Light gray background (bg-gray-50)

┌───────────────────────────────────────┬───────────────────────────────────┐
│                                       │                                   │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃ GRADIENT GREEN CARD             ┃  │  ┃ WHITE CARD                  ┃  │
│  ┃ (Primary-600 to Primary-700)    ┃  │  ┃ (2px Primary Border)        ┃  │
│  ┃                                  ┃  │  ┃                             ┃  │
│  ┃ You Could Save                   ┃  │  ┃ Ready to Lock In            ┃  │
│  ┃                                  ┃  │  ┃ Your Savings?               ┃  │
│  ┃       $247                       ┃  │  ┃                             ┃  │
│  ┃    (HUGE WHITE TEXT)             ┃  │  ┃ Complete your application   ┃  │
│  ┃                                  ┃  │  ┃ in just 5 minutes...        ┃  │
│  ┃ per month                        ┃  │  ┃                             ┃  │
│  ┃ (Light green text)               ┃  │  ┃ ┏━━━━━━━━━━━━━━━━━━━━━━┓  ┃  │
│  ┃ ─────────────────────────────    ┃  │  ┃ ┃ Let's Start Now → ┃  ┃  │
│  ┃                                  ┃  │  ┃ ┃ (LARGE GREEN BUTTON)  ┃  ┃  │
│  ┃ [Shield] Same Policy             ┃  │  ┃ ┗━━━━━━━━━━━━━━━━━━━━━━┛  ┃  │
│  ┃ [Lock] Secure Funds              ┃  │  ┃                             ┃  │
│  ┃ [Chat] 24/7 Support              ┃  │  ┃ ┌─────────────────────────┐ ┃  │
│  ┃ (3 columns, white icons)         ┃  │  ┃ │ Talk to a Specialist    │ ┃  │
│  ┃                                  ┃  │  ┃ │ (GRAY BORDER BUTTON)    │ ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │  ┃ └─────────────────────────┘ ┃  │
│                                       │  ┃ ─────────────────────────────┃  │
│  ┌─────────────────────────────────┐  │  ┃ ✓ No Impact on Credit       ┃  │
│  │ WHITE CARD                      │  │  ┃   Check your rate...        ┃  │
│  │                                 │  │  ┃                             ┃  │
│  │ Your Savings Breakdown          │  │  ┃ ✓ Fast Processing           ┃  │
│  │                                 │  │  ┃   Most applications...      ┃  │
│  │ ┌──────────┬──────────┐        │  │  ┃                             ┃  │
│  │ │ Current  │ New      │        │  │  ┃ ✓ Expert Guidance           ┃  │
│  │ │ Payment  │ Payment  │        │  │  ┃   Dedicated support...      ┃  │
│  │ │ $2,847   │ $2,600   │        │  │  ┃ ─────────────────────────────┃  │
│  │ │ (Red)    │ (Green)  │        │  │  ┃ Recalculate with different  ┃  │
│  │ └──────────┴──────────┘        │  │  ┃ numbers (underlined link)   ┃  │
│  │ ┌──────────┬──────────┐        │  │  ┃                             ┃  │
│  │ │ Lifetime │ Closing  │        │  │  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
│  │ │ Savings  │ Costs    │        │  │                                   │
│  │ │ $88,920  │ $3,500   │        │  │  (This card stays fixed          │
│  │ │ (Green)  │ (Gray)   │        │  │   as you scroll down)             │
│  │ └──────────┴──────────┘        │  │                                   │
│  │                                 │  │                                   │
│  │ [Blue Box]                      │  │                                   │
│  │ Break-even point: 14 months...  │  │                                   │
│  └─────────────────────────────────┘  │                                   │
│                                       │                                   │
```

### Scrolling Down (Left Column Continues)

```
│  ┌─────────────────────────────────┐  │  [CTA Card remains sticky]
│  │ WHITE CARD WITH BORDER          │  │
│  │                                 │  │
│  │ ▶ Want to compare your monthly  │  │
│  │   payment too?                  │  │
│  │   Optional: Get help with...    │  │
│  │   [Chevron Down Icon]           │  │
│  │                                 │  │
│  │ (Collapsed accordion)           │  │
│  └─────────────────────────────────┘  │
└───────────────────────────────────────┴───────────────────────────────────┘
```

### When Accordion is Expanded

```
│  ┌─────────────────────────────────┐
│  │ ACCORDION HEADER (Clickable)    │
│  │ ▼ Want to compare your monthly  │
│  │   payment too?                  │
│  │                                 │
│  ├─────────────────────────────────┤
│  │ GRAY BACKGROUND CONTENT AREA    │
│  │                                 │
│  │ Choose an option:               │
│  │                                 │
│  │ ┌────────────┐ ┌────────────┐  │
│  │ │ I already  │ │ Request    │  │
│  │ │ have a     │ │ loan       │  │
│  │ │ lender     │ │ suggestions│  │
│  │ │            │ │            │  │
│  │ │ Enter your │ │ Get matched│  │
│  │ │ lender's...│ │ with a...  │  │
│  │ └────────────┘ └────────────┘  │
│  │ (White cards with hover effect) │
│  └─────────────────────────────────┘
```

### Lender Form View (After Clicking "I already have a lender")

```
│  │ GRAY BACKGROUND                 │
│  │                                 │
│  │ ← Back to options               │
│  │                                 │
│  │ Enter Your Lender's Terms       │
│  │                                 │
│  │ ┌──────────┬──────────┐        │
│  │ │ Lender   │ Loan     │        │
│  │ │ Name     │ Amount * │        │
│  │ │ [input]  │ [input]  │        │
│  │ └──────────┴──────────┘        │
│  │ ┌──────────┬──────────┐        │
│  │ │ Interest │ Loan     │        │
│  │ │ Rate % * │ Term *   │        │
│  │ │ [input]  │ [select] │        │
│  │ └──────────┴──────────┘        │
│  │                                 │
│  │ [Yellow disclaimer box]         │
│  │ Disclaimer: This is not a...    │
│  │                                 │
│  │ ┌─────────────────────────────┐ │
│  │ │ Calculate Estimate          │ │
│  │ │ (DARK GRAY BUTTON)          │ │
│  │ └─────────────────────────────┘ │
│  └─────────────────────────────────┘
```

## Visual Hierarchy at a Glance

### Size Hierarchy (largest to smallest):
1. **$247** - Savings amount (text-5xl md:text-7xl = 48-72px)
2. **"Let's Start Now →"** - Primary CTA (text-lg = 18px, bold)
3. **"Ready to Lock In Your Savings?"** - CTA headline (text-2xl = 24px)
4. **"You Could Save"** - Savings headline (text-2xl md:text-3xl = 24-30px)
5. **Payment amounts in breakdown** (text-2xl = 24px)
6. **Section headers** (text-2xl = 24px)
7. **Body text** (text-base = 16px)
8. **Trust bullet details** (text-xs = 12px)

### Color Hierarchy (most to least prominent):
1. **Primary Green** (#10b981) - Used for:
   - Savings card background (gradient)
   - "Let's Start Now" button
   - CTA card border
   - New payment amounts
   - Checkmark icons

2. **White** - Used for:
   - Card backgrounds
   - Text on green backgrounds
   - Button text

3. **Red** (#f87171 - red-400) - Used for:
   - Current payment (what they're leaving behind)

4. **Gray shades** - Used for:
   - Background (gray-50)
   - Body text (gray-600, gray-700, gray-900)
   - Secondary button border
   - Accordion tertiary buttons (gray-700)

### Button Hierarchy Visual Differences:

**Primary: "Let's Start Now →"**
```
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃                       ┃  ← Green background
┃ Let's Start Now →     ┃  ← White bold text
┃                       ┃  ← Shadow underneath
┗━━━━━━━━━━━━━━━━━━━━━━━┛
   (Full width, tall)
```

**Secondary: "Talk to a Specialist"**
```
┌─────────────────────────┐
│                         │  ← White background
│ Talk to a Specialist    │  ← Gray text, semibold
│                         │  ← Gray border, no shadow
└─────────────────────────┘
   (Full width, medium height)
```

**Tertiary: "Calculate Estimate"**
```
┌─────────────────────────┐
│                         │  ← Dark gray background
│ Calculate Estimate      │  ← White text, medium weight
│                         │  ← No shadow, no border
└─────────────────────────┘
   (Only visible in accordion)
```

## Mobile View (< 768px)

### Stacked Layout:
```
┌─────────────────────────┐
│ Garden DTC              │
└─────────────────────────┘

┌─────────────────────────┐
│ GRADIENT GREEN CARD     │
│                         │
│ You Could Save          │
│                         │
│    $247                 │
│                         │
│ per month               │
│ ─────────────────────── │
│ [Trust indicators]      │
│ (Stacked vertically)    │
└─────────────────────────┘

┌─────────────────────────┐
│ CTA CARD (Not sticky)   │
│                         │
│ Ready to Lock In...     │
│                         │
│ [Let's Start Now →]     │
│ [Talk to Specialist]    │
│                         │
│ ✓ Trust bullets...      │
└─────────────────────────┘

┌─────────────────────────┐
│ SAVINGS BREAKDOWN       │
│                         │
│ (2x2 grid)              │
│ ┌──────┬──────┐        │
│ │ Curr │ New  │        │
│ ├──────┼──────┤        │
│ │ Life │ Clos │        │
│ └──────┴──────┘        │
└─────────────────────────┘

┌─────────────────────────┐
│ MORTGAGE ACCORDION      │
│ (Full width)            │
└─────────────────────────┘
```

## Key Visual Indicators

### Trust Elements:
- **Shield icon** = Same Policy (Security)
- **Lock icon** = Secure Funds (Protection)
- **Chat bubbles icon** = 24/7 Support (Availability)
- **Checkmark icons** = Benefits (Confirmation)

### Color-Coded Payments:
- **Red border** = Current payment (what you pay now - bad)
- **Green border** = New payment & savings (what you'll pay - good)
- **Gray border** = Neutral info (closing costs)

### Interactive States:
- **Hover on primary button**: Darker green, larger shadow
- **Hover on secondary button**: Darker border, light gray background
- **Hover on accordion trigger**: Light gray background
- **Expanded accordion**: Chevron rotates 180° down to up

## Spacing & Layout Ratios

### Desktop Grid:
- Left column: 66.67% width (2 parts)
- Right column: 33.33% width (1 part)
- Gap between columns: 32px (gap-8)

### Card Padding:
- Savings card: 48px (p-12 on desktop)
- Breakdown card: 32px (p-8)
- CTA card: 32px (p-8)
- Accordion content: 24px (p-6)

### Border Weights:
- CTA card: 2px border (important)
- Accordion: 1px border (subtle)
- Payment borders: 4px left border (emphasis)

## What to Look For When Testing

1. **Above the fold** (without scrolling):
   - Can you see the big savings number?
   - Can you see the "Let's Start Now" button?
   - Is the trust strip visible?

2. **Scrolling behavior**:
   - Does the CTA card stay visible? (sticky)
   - Can you still see "Let's Start Now" button?

3. **Visual dominance**:
   - Is the green button the most eye-catching element?
   - Does your eye naturally flow: Savings → CTA?

4. **Accordion behavior**:
   - Starts collapsed
   - Chevron animates when clicked
   - Content slides open smoothly
   - Gray background differentiates it

5. **Mobile responsiveness**:
   - Does it stack properly?
   - Are buttons still easy to tap?
   - Is text still readable?

## Expected User Journey

**Visual Path**:
1. Eyes land on **$247** (biggest, green, centered)
2. Read "You Could Save" context
3. Glance at trust indicators (quick credibility check)
4. Eyes move right to **"Let's Start Now"** button
5. Scan trust bullets for reassurance
6. Click primary CTA

**OR** (if they want details):
1. Scroll down to see breakdown
2. Compare current vs new payments
3. Return to top (CTA still visible - sticky)
4. Click "Let's Start Now"

## Summary

The page is designed with a **clear visual funnel**:
- **Attention grabber**: Big green card with huge savings number
- **Trust builder**: Two layers of trust indicators
- **Action driver**: Prominent, always-visible CTA button
- **Details provider**: Clean breakdown for those who need it
- **Optional path**: Hidden accordion that doesn't distract

**Color story**: Green = Good/Savings, Red = Current/Bad, White = Clean/Trust, Gray = Neutral/Secondary

**Hierarchy story**: Primary button dominates, secondary is available, tertiary is hidden unless needed
