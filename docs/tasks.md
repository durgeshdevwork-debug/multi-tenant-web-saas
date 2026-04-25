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