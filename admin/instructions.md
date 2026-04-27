Here’s a **clean, detailed, production-ready `instructions.md`** you can directly copy and use with Codex.

---

```md
# 🧾 Admin Panel Refactor Instructions

## 📌 Overview

This project is a **React + TypeScript Admin Panel** built using:

- Vite
- React 19
- TailwindCSS v4
- shadcn/ui
- React Query
- React Hook Form + Zod
- Lexical Editor

---

## 🎯 Goal

Refactor the project to achieve:

- Scalable architecture (feature-based)
- Clean, maintainable code
- Reusable components
- Proper UI/UX patterns
- Full type safety
- Responsive design
- Dark mode support

---

## 🚨 IMPORTANT RULES

- ❌ Do NOT introduce new libraries
- ❌ Do NOT keep static/mock data
- ❌ Do NOT use `any` type
- ❌ Do NOT use `overflow-auto` for scrolling
- ✅ Use existing stack only
- ✅ Follow shadcn patterns
- ✅ Maintain consistency across project

---

# 🧱 1. Folder Structure (MANDATORY)

Refactor project into:
```

src/
│
├── app/ # providers, routing setup
│
├── components/
│ ├── ui/ # existing shadcn components (KEEP)
│ ├── common/ # reusable generic components
│ ├── forms/ # reusable form components
│ ├── layout/ # sidebar, header, layouts
│
├── features/ # domain-based architecture
│ ├── dashboard/
│ ├── pages/
│ ├── media/
│ ├── settings/
│ ├── auth/
│ └── editor/
│
├── hooks/ # global reusable hooks
├── lib/ # utils, constants
├── services/ # base API config only
├── types/ # global types
├── schemas/ # global zod schemas
│
└── styles/

```

---

# 🧩 2. Feature-Based Structure (VERY IMPORTANT)

Each feature must follow:

```

features/{feature}/
│
├── components/
├── hooks/
├── services/
├── pages/
├── types.ts
└── schema.ts

```

---

### Example

```

features/dashboard/
components/
clients-tab.tsx
onboard-tab.tsx
templates-tab.tsx

pages/
dashboard-page.tsx

hooks/
use-dashboard.ts

services/
dashboard.api.ts

types.ts

```

---

# 🔁 3. API Layer Refactor

## ❌ Remove logic from:
```

lib/api.ts

```

## ✅ Keep only base config:
```

axios instance
interceptors

```

## ✅ Move APIs into features:

```

features/{feature}/services/\*.api.ts

````

---

### Example:

```ts
export const getPages = async () => {
  return axios.get('/pages')
}
````

---

# ⚛️ 4. React Query Usage

All API calls must use React Query.

### Rules:

- Use `useQuery` for fetching
- Use `useMutation` for actions
- Add loading + error handling

---

### Example:

```ts
export const usePages = () => {
  return useQuery({
    queryKey: ['pages'],
    queryFn: getPages,
  })
}
```

---

# 🧠 5. Component Architecture

## Rules:

- Max 200–250 lines per component
- Separate logic and UI

---

### Pattern:

```
component-name/
  index.tsx        # export
  container.tsx    # logic
  view.tsx         # UI
```

---

# 🧾 6. Forms System (MANDATORY)

Use:

- react-hook-form
- zod validation

---

## Create reusable components:

```
components/forms/
  form-section.tsx
  form-field.tsx
  form-header.tsx
  sticky-actions.tsx
```

---

## Form Rules:

- Divide into sections
- Each section wrapped in `<FormSection />`
- No long single forms

---

## Sticky Action Bar (REQUIRED)

```
position: sticky;
top: 0;
z-index: 50;
```

---

### Example Layout:

```
[ Sticky Save / Cancel ]

[ Section 1 ]
[ Section 2 ]
[ Section 3 ]
```

---

# 📜 7. Scroll Behavior

## ❌ DO NOT USE:

```
overflow-auto
```

## ✅ USE:

```tsx
import { ScrollArea } from "@/components/ui/scroll-area"

<ScrollArea className="h-full">
  ...
</ScrollArea>
```

---

# 🎨 8. UI & Design System

## Rules:

- No hardcoded colors
- Use Tailwind tokens only
- Follow shadcn design

---

## Use variables:

```
bg-background
text-foreground
border-border
```

---

# 🌙 9. Dark Mode (MANDATORY)

Use:

- next-themes

---

## Rules:

- All components must support dark mode
- No fixed colors
- Use theme tokens only

---

# 📱 10. Responsiveness

## Must support:

- Mobile
- Tablet
- Desktop

---

## Rules:

- Mobile-first approach
- No horizontal scroll
- Use responsive grid/flex
- Sidebar collapsible

---

# 🧱 11. Layout System

Create:

```
components/layout/
  app-layout.tsx
  dashboard-layout.tsx
  auth-layout.tsx
```

---

## Layout must include:

- Sidebar
- Header
- Content area

---

# 🧪 12. States Handling

Each page must handle:

- Loading → Skeleton
- Error → Error UI
- Empty → Empty component

---

# 🧰 13. Custom Hooks

Create reusable hooks:

```
hooks/
  use-debounce.ts
  use-modal.ts
  use-pagination.ts
  use-fetch.ts
```

---

# 🧼 14. Cleanup Rules

Remove:

- console.log
- unused imports
- duplicate code
- commented code

---

# 🧾 15. Naming Conventions

| Type       | Format       |
| ---------- | ------------ |
| Components | PascalCase   |
| Hooks      | useSomething |
| Files      | kebab-case   |
| Types      | PascalCase   |

---

# ⚡ 16. Performance

- Lazy load routes
- Memoize components when needed
- Avoid unnecessary re-renders

---

# 🚀 17. Final Checklist

- [ ] Feature-based structure implemented
- [ ] No static data
- [ ] API separated per feature
- [ ] Forms structured into sections
- [ ] Sticky action bar present
- [ ] ScrollArea used everywhere
- [ ] Components reusable
- [ ] Fully responsive
- [ ] Dark mode working
- [ ] Types everywhere
- [ ] Clean architecture

---

# 🧠 Notes

- Focus on scalability
- Keep code clean and modular
- Do not over-engineer
- Reuse existing components

---

# 🛑 Execution Strategy

Refactor **one feature at a time**:

1. Pick a feature (e.g. dashboard)
2. Move into `/features`
3. Refactor components
4. Add API + hooks
5. Fix UI & responsiveness
6. Repeat

---

# ✅ Expected Result

After refactor:

- Clean architecture
- Maintainable codebase
- Scalable for SaaS-level product
- Consistent UI/UX

```

```



Here’s a clean, structured, and Codex-friendly rewrite of your instruction:

---

### ✅ Refined Instruction (Description)

Ensure UI consistency across the entire platform.

* Currently, there is inconsistency in design — some components (buttons, layouts, inputs) are rounded while others are not. Standardize all UI elements using the **shadcn/ui configuration**.
* Do not apply ad-hoc styles per component. Maintain a consistent design system. Global adjustments can be handled later via the global CSS if needed.

### 🎨 UI Consistency Requirements

* All buttons, inputs, cards, and sections should follow the same border-radius and styling rules.
* Form inputs and fields are currently not rounded — update them to match the overall UI theme.
* Ensure spacing, borders, and typography are visually consistent across all sections.

---

### 📄 Page Layout Improvements

* The current **page header design is not visually effective** — remove it.
* Instead, enhance the **top sticky section (Edit Page / User Access area)**:

  * Integrate important page details (e.g., page title, context info) into this sticky header.
  * Remove unnecessary badges like **"Admin Access"** and **"User Access"**.

---

### 📌 Sticky Actions & UX Fix

* Ensure the **"Add Section" button is always visible** and does not get hidden while scrolling or adding sections.
* Important actions (like add section, save, etc.) should remain accessible at all times — preferably inside a sticky container.

---

### 🎯 Goal

Achieve a **clean, consistent, and professional UI system** across the entire admin panel using shadcn standards, with improved usability and better layout structure.

---

If you want, I can next:

* Convert this into **strict Codex execution steps**
* Or give you **design tokens + shadcn config setup** for full consistency 👍
