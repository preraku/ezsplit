# EZSplit iOS — Implementation Plan

Native iOS app that is a full-featured port of the EZSplit React web app.

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| UI Framework | SwiftUI | Mirrors React's declarative model; fully declarative on iOS 26 |
| Min OS | iOS 26+ | Latest design language (Liquid Glass), newest SwiftUI APIs, zero legacy conditionals |
| Location | `ios/` subfolder of this monorepo | Keeps web and iOS logic references in sync |
| Extras | Haptic feedback | Subtle tactile reinforcement for user actions |
| State management | `@Observable` class (`AppStore`) | Clean `@Observable` with no back-compat workarounds |

---

## Project Structure

```
ios/
├── EZSplit.xcodeproj/
└── EZSplit/
    ├── App.swift                  # @main entry, injects AppStore into environment
    ├── Models/
    │   ├── Person.swift           # Identifiable, Codable
    │   ├── LineItem.swift         # Identifiable, Codable
    │   ├── ItemAssignment.swift   # sharedPersonIds + quantities
    │   └── AppState.swift         # Flat state struct (Step enum, people, items, etc.)
    ├── Store/
    │   └── AppStore.swift         # @Observable class; all mutations live here
    ├── Views/
    │   ├── Steps/
    │   │   ├── PeopleStepView.swift
    │   │   ├── ItemsStepView.swift
    │   │   ├── AssignStepView.swift
    │   │   └── ResultsStepView.swift
    │   ├── Components/
    │   │   ├── PersonCircleView.swift    # Colored circle with initials
    │   │   ├── CurrencyInputView.swift   # Cents-based numeric input → $X.XX
    │   │   ├── QuantityStepper.swift     # −/+ stepper with count display
    │   │   ├── WarningBannerView.swift   # Yellow alert for unassigned items
    │   │   ├── StepHeaderView.swift      # Progress dots + step title
    │   │   └── NavButtonsView.swift      # Sticky bottom Back/Next/Reset bar
    │   ├── Assign/
    │   │   ├── AssignItemCard.swift      # Routes to toggle or qty UI per item
    │   │   ├── TogglePersonRow.swift     # Tap-to-toggle for qty=1 items
    │   │   └── PerPersonQtyRow.swift     # Stepper per person for qty>1 items
    │   └── Results/
    │       ├── PersonResultCard.swift    # Per-person breakdown with color header
    │       └── ShareLineView.swift       # Single label + amount row
    └── Utils/
        ├── BillCalculator.swift   # Port of calculations.ts — pure functions
        ├── Colors.swift           # 10-color palette; pickColor(index:)
        ├── Initials.swift         # Name → initials (up to 3 chars or 2-word rule)
        ├── Currency.swift         # formatCurrency(_:) and parseCurrency(_:)
        └── HapticManager.swift    # Centralized UIFeedbackGenerator wrappers
```

---

## Data Models

Direct Swift equivalents of the TypeScript types in `src/types/index.ts`.

```swift
// Models/Person.swift
struct Person: Identifiable, Codable, Hashable {
    let id: String          // UUID().uuidString (nanoid equivalent)
    var name: String
    var colorHex: String    // Same 10-color hex palette as web
}

// Models/LineItem.swift
struct LineItem: Identifiable, Codable {
    let id: String
    var name: String
    var pricePerUnit: Double   // Stored as dollars (2.50)
    var quantity: Int          // >= 1
}

// Models/ItemAssignment.swift
struct ItemAssignment: Codable {
    let itemId: String
    var sharedPersonIds: [String]       // qty == 1: equal split
    var quantities: [String: Int]       // qty > 1: personId → count
}

// Step enum
enum AppStep: Int, CaseIterable {
    case people, items, assign, results
}
```

---

## State Management

`AppStore` is an `@Observable` class injected at the root via `.environment()`. All mutations are methods on the store — the iOS equivalent of dispatching reducer actions.

```swift
@Observable
class AppStore {
    var currentStep: AppStep = .people
    var people: [Person] = []
    var items: [LineItem] = []
    var taxTotal: Double = 0
    var tipTotal: Double = 0
    var assignments: [String: ItemAssignment] = [:]

    // People
    func addPerson(name: String)
    func removePerson(id: String)        // cascades: clears from all assignments

    // Items
    func addItem(_ item: LineItem)
    func removeItem(id: String)          // cascades: deletes assignment
    func updateItem(_ item: LineItem)    // if qty changed, resets assignment

    // Tax / Tip
    func setTax(_ amount: Double)
    func setTip(_ amount: Double)

    // Assignments
    func togglePersonOnItem(itemId: String, personId: String)
    func setAllPersonsOnItem(itemId: String, personIds: [String])
    func setPersonQtyOnItem(itemId: String, personId: String, qty: Int)
    func resetItemAssignment(itemId: String)

    // Navigation
    func nextStep()
    func prevStep()
    func resetAll()
}
```

Cascading cleanup mirrors the web reducer exactly:
- `removePerson` → filters that person out of every `sharedPersonIds` and `quantities`
- `removeItem` → deletes the corresponding `ItemAssignment`
- `updateItem` (qty changed) → calls `resetItemAssignment`

---

## 4-Step Wizard UI

The main view uses a `ZStack` / `switch` on `store.currentStep`, with animated transitions between steps. `StepHeaderView` shows progress dots and the step title; `NavButtonsView` is pinned to the bottom with safe-area padding.

```
People → Items → Assign → Results
```

### Step 1 — People ("Who's splitting?")
- Text field + "Add" button to create a person
- List of `PersonCircleView` rows with swipe-to-delete
- Validation: ≥1 person required to advance
- Haptic: medium impact on add; light on delete

### Step 2 — Items ("What did you order?")
- `ItemForm` sheet/inline form: name, price (CurrencyInputView), quantity (QuantityStepper)
- List of item cards with edit (sheet) and swipe-to-delete
- `CurrencyInputView` for tax total and tip total
- Validation: ≥1 item required to advance
- Haptic: medium impact on add/delete

### Step 3 — Assign ("Who gets what?")
- One `AssignItemCard` per item:
  - **qty = 1**: Horizontal scroll of `PersonCircleView` toggles (filled = assigned)
  - **qty > 1**: List of `PerPersonQtyRow` with `QuantityStepper` per person
- `WarningBannerView` if any item is unassigned or partially assigned
- Haptic: light selection feedback on toggle; light on stepper +/−

### Step 4 — Results ("Here's the split")
- One `PersonResultCard` per person (colored header, itemized lines, subtotal/tax/tip/total)
- `WarningBannerView` for unassigned remainder (dollar amount, not charged to anyone)
- "Start Over" resets all state
- Haptic: success notification on arriving at results

---

## Business Logic Port (`BillCalculator.swift`)

A pure `enum BillCalculator` (used as a namespace) with static functions. Direct port of `src/utils/calculations.ts`.

```swift
struct PersonResult {
    let person: Person
    let itemLines: [(itemName: String, share: Double)]
    let subtotal: Double
    let taxShare: Double
    let tipShare: Double
    let total: Double
}

struct CalculationOutput {
    let results: [PersonResult]
    let unassignedSubtotal: Double
    let unassignedTaxTip: Double
}

enum BillCalculator {
    static func calculate(
        people: [Person],
        items: [LineItem],
        assignments: [String: ItemAssignment],
        taxTotal: Double,
        tipTotal: Double
    ) -> CalculationOutput
}
```

**Algorithm (identical to web):**

1. For each assigned item, compute each person's share:
   - `qty == 1` → `itemTotal / sharedPersonIds.count`
   - `qty > 1` → `personQty * pricePerUnit`
2. Track `unassignedSubtotal` for items with no/partial assignment
3. `assignedFraction = totalAssignedSubtotal / totalBillSubtotal`
4. Each person's tax/tip share: `(personSubtotal / totalAssigned) * tax/tip * assignedFraction`
5. Penny correction: adjust the person with the highest subtotal by the floating-point remainder

---

## Haptic Feedback

Centralized in `HapticManager.swift` with static methods:

| Event | Feedback type |
|-------|--------------|
| Add person / add item | `.medium` impact |
| Remove person / remove item | `.light` impact |
| Toggle person on item | `.light` selection |
| Stepper +/− | `.light` selection |
| Advance to next step | `.success` notification |
| Validation failure (can't advance) | `.error` notification |
| Arrive at results | `.success` notification |

---

## Color System

Same 10-color hex palette as `src/utils/colors.ts`, expressed as SwiftUI `Color` extensions.

```swift
// Utils/Colors.swift
extension Color {
    static let personPalette: [Color] = [
        Color(hex: "#ef4444"), // red
        Color(hex: "#f97316"), // orange
        Color(hex: "#eab308"), // yellow
        Color(hex: "#22c55e"), // green
        Color(hex: "#14b8a6"), // teal
        Color(hex: "#3b82f6"), // blue
        Color(hex: "#8b5cf6"), // violet
        Color(hex: "#ec4899"), // pink
        Color(hex: "#06b6d4"), // cyan
        Color(hex: "#f59e0b"), // amber
    ]

    static func personColor(at index: Int) -> Color {
        personPalette[index % personPalette.count]
    }
}
```

---

## Currency Input

`CurrencyInputView` wraps a `TextField` with `.keyboardType(.numberPad)`.

- User types raw digits (e.g. `250`)
- Display formats as `$2.50` using `NumberFormatter`
- Internal binding stores value as `Double` in dollars (`2.50`)
- Mirrors `src/utils/currency.ts` behavior exactly

---

## Dark Mode

SwiftUI automatically adapts to system appearance via `@Environment(\.colorScheme)`. Use semantic colors (`Color(.systemBackground)`, `Color(.label)`, etc.) everywhere rather than hardcoded values. Custom colored elements (person circles, result card headers) test for both schemes.

---

## Implementation Phases

| Phase | Scope |
|-------|-------|
| **1 – Foundation** | Xcode project setup in `ios/`, data models, `AppStore`, color/initials/currency utils |
| **2 – Shell** | `ContentView` with step switching, `StepHeaderView`, `NavButtonsView` with safe-area insets, `HapticManager` |
| **3 – People Step** | `PersonCircleView`, add/remove person flow, validation |
| **4 – Items Step** | `CurrencyInputView`, `QuantityStepper`, item form, tax/tip inputs |
| **5 – Assign Step** | `AssignItemCard`, `TogglePersonRow`, `PerPersonQtyRow`, warning banner |
| **6 – Results Step** | `BillCalculator.swift` (port of calculations.ts), `PersonResultCard`, `ShareLineView`, unassigned warning |
| **7 – Polish** | Dark mode audit, haptic tuning, animations between steps, edge-case testing |

---

## Out of Scope (for this version)

- Camera receipt scanning
- Share Sheet / export
- Persistence (no Core Data or UserDefaults — session-only, same as web)
- iPad layout optimization
- Widget or App Clip
