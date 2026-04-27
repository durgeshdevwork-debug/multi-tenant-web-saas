- In the admin dashboard, replace the tab-based UI with a simple layout. Also, break down the content into smaller, reusable components to improve code standards and maintainability.
- In the API server, implement database transactions when executing multiple related operations to ensure seamless and consistent data flow.
- Remove Better Auth support. Retain the existing table structure, but switch to JWT-based authentication with bcrypt for password hashing, and manage sessions using cookies.
    

- for creating new page we dont add form add this form and , so we have to add this feature as well
- we have to add more sections as well 
- for reach text section rich text editor we have to add , add also update the template rendering styling of this app


- suppose i have maintain blogs how i gone manage blogs and services for the website 
- in template i have to in /services i need to list all the services and /services/service-one pages
same for blog
- in the parent page i have to add section for populating other pages and child pages , can you create this feature


Do not display child pages in the edit form. Child pages should only be rendered in the frontend template of the parent page.
In the admin panel, allow users to add a new section within the parent page.
Based on the selected section type, provide an option to choose a collection (e.g., services or blogs).
Once a collection is selected, display a list of available pages from that collection.
The user can then select specific pages to include in that section.
In the frontend template, the selected pages should be rendered within that section, displaying their title, description, image, and slug.
This will enable dynamic listing of pages (e.g., services) on the parent page.




===================



- can you change
- in the adminDashboard ,pageworkspacepage this pages is too long and messy for understanding the code , use component for this pages insted of writing all code into single pages 
--

    in the admin panel for the rich text section i have to implement rich text editor for applying the rich text editing

npx shadcn@latest add @shadcn-editor/editor-x





- in the editor , i am not able to write entire content and the 

Design and redesign the website template based on the provided reference screenshots. The layout, spacing, and visual hierarchy should closely follow the reference while ensuring full responsiveness across all screen sizes (desktop, tablet, and mobile).

Follow a design system approach instead of applying manual or hardcoded styles:

Use a centralized set of design variables (design tokens) for colors, typography, spacing, and component styles.
Define and use primary, secondary, and other global theme variables to control the entire design.
Ensure all components and sections strictly inherit styles from these global variables rather than using custom or inline styling.
⚙️ Dynamic Content Requirement
Do not add any static or hardcoded content.
All data (text, images, sections, etc.) must be fully dynamic and driven by configuration or data sources.
Components should be designed to render based on passed data (props, JSON, CMS, or API).
The template must support adding, removing, and reordering sections dynamically without code changes.
🎯 Goal

Create a reusable, scalable template system where:

The entire website design can be changed by updating global design variables only.
The same template structure can be reused to generate multiple designs/themes.
No component-level redesign is required when changing themes or content.

Even though this approach is inspired by shadcn/ui, do not use the library directly—only follow a similar design system philosophy.

✅ Expected Outcome
Clean, maintainable, and scalable code structure
Fully responsive design
Theme-driven UI (via global variables)
Completely dynamic content rendering
Easily reusable template architecture for future projects





- hey i am using react js, tailwind css , shadcn ui , react query,  etc check below

"@base-ui/react": "^1.3.0",
    "@better-fetch/fetch": "^1.1.21",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/modifiers": "^9.0.0",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@fontsource-variable/jetbrains-mono": "^5.2.8",
    "@hookform/resolvers": "^5.2.2",
    "@lexical/code": "^0.43.0",
    "@lexical/code-prism": "^0.43.0",
    "@lexical/code-shiki": "^0.43.0",
    "@lexical/extension": "^0.43.0",
    "@lexical/file": "^0.43.0",
    "@lexical/hashtag": "^0.43.0",
    "@lexical/link": "^0.43.0",
    "@lexical/list": "^0.43.0",
    "@lexical/markdown": "^0.43.0",
    "@lexical/overflow": "^0.43.0",
    "@lexical/react": "^0.43.0",
    "@lexical/rich-text": "^0.43.0",
    "@lexical/selection": "^0.43.0",
    "@lexical/table": "^0.43.0",
    "@lexical/text": "^0.43.0",
    "@lexical/utils": "^0.43.0",
    "@phosphor-icons/react": "^2.1.10",
    "@tailwindcss/vite": "^4.1.17",
    "@tanstack/react-query": "^5.95.2",
    "@tanstack/react-query-devtools": "^5.95.2",
    "@tanstack/react-table": "^8.21.3",
    "axios": "^1.13.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lexical": "^0.43.0",
    "lodash": "^4.18.1",
    "lucide-react": "^1.11.0",
    "next-themes": "^0.4.6",
    "radix-ui": "^1.4.3",
    "react": "^19.2.0",
    "react-day-picker": "^9.14.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.72.0",
    "react-resizable-panels": "^4.7.6",
    "react-router-dom": "^7.13.2",
    "recharts": "^3.8.0",
    "shadcn": "^4.0.7",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.5.0",
    "tailwindcss": "^4.1.17",
    "tw-animate-css": "^1.4.0",
    "vaul": "^1.1.2",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/lodash": "^4.17.24",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "prettier": "^3.8.1",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
-- hey just check my admin panel, check all the form and coding structure follow , the proper standerd , divide large pages or component into small reusable component , use higher order components , proper loading and types safety  and layout and dark mode while scrolling form main action button stick to top , divide forms into sections, make all app responsive , remove static data , design properly , in scroll dont show overflow auto for this use shadcn ui scrollarea component 