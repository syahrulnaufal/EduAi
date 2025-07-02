# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## This Project Structure

terdapat beberapa folder utama :
- public/img untuk menyimpan semua image
- src/pages untuk kode html satu halaman / page
- src/components untuk menyimpan komponen2 yang akan disematkan di dalam kode html halaman
- src/main.jsx file utama
- style.css untuk css

# Walisongo Science Competition (WSC)

This project is a web application for the Walisongo Science Competition (WSC). It provides a platform for students to learn, practice, and compete in various science subjects. The application features a chatbot for assistance, different learning spaces, and user authentication.

## Tech Stack

*   **Framework:** [React.js](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Linting:** [ESLint](https://eslint.org/)

## Project Structure

The project is organized into the following main directories:

*   `public/`: Contains static assets like images and logos.
*   `src/`: The main source code of the application.
    *   `assets/`: Contains additional assets like the React logo.
    *   `components/`: Reusable React components used throughout the application.
    *   `pages/`: The main pages of the application, each corresponding to a specific route.
    *   `main.jsx`: The entry point of the application where the React root is created and the main routes are defined.
    *   `style.css`: Global styles and Tailwind CSS configuration.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the application on `http://localhost:5173` by default.

## Features

*   **Interactive Learning:** Engaging modules for various science subjects.
*   **AI-Powered Chatbot:** Instant assistance and guidance for students.
*   **Personalized Dashboard:** Track progress and performance.
*   **Practice and Tryouts:** Sharpen skills with mock tests and challenges.
*   **Responsive Design:** Seamless experience across devices.
*   **Dark Mode:** Comfortable viewing in low-light conditions.

## Pages and Components

### Pages

*   **`Beranda.jsx`**: The main landing page, providing an overview of the competition and its features. It showcases popular features and testimonials.
*   **`RuangBelajar.jsx`**: The central hub for learning resources. It likely contains links to different subjects and study materials.
*   **`RuangKelas.jsx`**: A virtual classroom where students can access course content, assignments, and interact with instructors.
*   **`Chatbot.jsx`**: A dedicated page for the AI-powered chatbot, allowing students to ask questions and get instant help.
*   **`Tentang.jsx`**: Provides detailed information about the Walisongo Science Competition, its mission, and vision.
*   **`BrainAcademy.jsx`**: A specialized section for brain-training exercises, puzzles, and challenges to enhance cognitive skills.

### Components

The `src/components/` directory contains a variety of reusable components that are essential for the application's functionality and user interface:

*   **`Asidebar.jsx` & `Sidebar.jsx`**: These components render the side navigation bars, providing easy access to different parts of the application.
*   **`BurgerMenu.jsx`**: A responsive menu for mobile devices, ensuring a smooth user experience on smaller screens.
*   **`ChatInput.jsx` & `ChatWindow.jsx`**: These components create the chatbot interface, enabling users to send messages and view responses.
*   **`DarkModeButton.jsx`**: Allows users to switch between light and dark themes for better visual comfort.
*   **`Dropdown.jsx`**: A versatile dropdown menu for various selection purposes.
*   **`FiturCard.jsx`**, **`FiturPopuler.jsx`**, **`FiturUnggulan.jsx`**: These components are used to display the different features of the application in an attractive and organized manner.
*   **`Header.jsx` & `Topbar.jsx`**: The main header and top navigation bars, providing branding and primary navigation links.
*   **`LoginButton.jsx`**: A simple button for initiating the user login process.
*   **`Search.jsx`**: A search bar component that allows users to find information within the application.

## Screenshots

*(Add screenshots of the application here to provide a visual overview of the user interface.)*

## Contributing

We welcome contributions to the Walisongo Science Competition project. If you would like to contribute, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix.
3.  **Make your changes** and ensure they follow the project's coding conventions.
4.  **Test your changes** thoroughly.
5.  **Submit a pull request** with a clear description of your changes.

## License

This project is licensed under the [MIT License](LICENSE).
