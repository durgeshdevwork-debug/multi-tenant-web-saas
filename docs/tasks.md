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