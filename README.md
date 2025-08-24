# React Forms Application

This project is a demonstration of different approaches to handling forms in React, including uncontrolled components and the `react-hook-form` library. It features a shared, accessible modal component for form display, state management with Redux Toolkit, and comprehensive validation using Zod.

---

## English

### 1. Core Features

-   **React Portals for Modals**: A single, reusable modal component is used to display two different forms. The modal is fully accessible, supporting focus management, closing with the `ESC` key, and closing by clicking outside the modal area.
-   **State Management**: Redux Toolkit is used to manage the application's state. Data submitted from both forms is stored in the Redux store and displayed on the main page.
-   **Two Form Approaches**:
    1.  **Uncontrolled Form**: A standard form built using uncontrolled components, with validation on submit.
    2.  **React Hook Form**: A form built using the `react-hook-form` library for efficient state management and live validation.
-   **Comprehensive Validation**: Zod is used to define validation schemas for all form fields. Error messages are displayed consistently for a clean user experience.
-   **Dynamic UI Updates**: After successful submission, the modal closes, and the new data is immediately displayed on the main page with a temporary highlight to indicate the new entry.

### 2. Form Fields

Both forms collect the following data:

-   **Name**: Must start with an uppercase letter.
-   **Age**: Must be a positive number.
-   **Email**: Must be a valid email format.
-   **Passwords**: Two fields that must match. A password strength indicator is displayed based on whether the password contains at least one number, one uppercase letter, one lowercase letter, and one special character.
-   **Gender**: A `select` control.
-   **Terms and Conditions**: A required checkbox.
-   **Profile Picture**: An input to upload an image (`.png`, `.jpeg`). The image is validated for size, converted to Base64, and stored in the Redux store.
-   **Country**: An autocomplete/select control with a list of countries sourced from the Redux store.

### 3. Technical Requirements

-   **Framework/Libraries**: React, TypeScript, Vite, Redux Toolkit, React Hook Form, Zod, Vitest, React Testing Library.
-   **Code Quality**: The project adheres to strict TypeScript standards, avoiding `any` or `ts-ignore`.
-   **Testing**: The application has a high unit test coverage (over 80%), including tests for form components, modals, Redux store logic, and utility functions.

### 4. Project Setup

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd ts-forms-q3

# Install dependencies
npm install
```

### 5. Available Scripts

```bash
# Run the development server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint
```
