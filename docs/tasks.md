### ** New Features Implementation**

#### **New Sections to be Added**

1. **Stats Section**
   - Fields:
     - Eyebrow
     - Heading
     - Body (Rich Text supported)

2. **FAQs Section**
   - Fields:
     - Eyebrow
     - Heading
     - Items:
       - Question
       - Answer (Rich Text with optional image support)

3. **Testimonials Section**
   - Fields:
     - Eyebrow
     - Heading
     - Collection Import (select from collection grid)
     - Option to choose specific testimonials to display

   - Additional Requirements:
     - Create a dedicated **Testimonials module (tabs + controller)**
     - Support multiple testimonial formats:
       - Text
       - Video
       - Audio

---

#### **Feature Enhancements**

- **Hero Section Carousel Support**
  - Add toggle to enable/disable carousel.
  - When enabled:
    - Allow adding multiple hero items.
    - Each item can contain its own content.
    - Store carousel items as an array.

---

#### **Implementation Requirements**

- Integrate all new sections into the CMS/admin panel.(admin and server folder)
- Add proper data handling and schema for each section.
- Ensure all sections render correctly on the frontend(template).
- Maintain scalability and dynamic rendering (no hardcoded design/data).
