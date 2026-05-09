# Eventify

Eventify is a modern, visually stunning college event management platform built with a futuristic 3D-animated UI and glassmorphic design. It serves as a centralized hub for discovering, managing, and collaborating on college events, club activities, and hackathons.

## Features

*   **Modern User Interface:** Built with React and styled with a vibrant gradient theme, glassmorphism, soft shadows, and smooth motion effects using Framer Motion.
*   **Progressive Web App (PWA):** Fully installable as a standalone app on desktop and mobile devices. Works seamlessly with offline capabilities thanks to Service Workers and custom installation flows.
*   **Event Discovery & Management:** Browse upcoming events, filter by categories, and view detailed event information including full-size image galleries.
*   **Hackathon Collaboration:** A dedicated space for students to find teammates and collaborate on hackathon projects.
*   **Interactive Calendar:** Integrated home calendar for an intuitive view of upcoming activities.
*   **Role-Based Access Control (RBAC):** Secure authentication system. Regular users can browse events, while designated admins can manage content via a protected Admin Panel.
*   **Secure Authentication:** Powered by JWT and Bcrypt for secure login and session management.

## Tech Stack

**Frontend:**
*   React 19 (built with Vite)
*   Framer Motion (for advanced animations and UI transitions)
*   React Router DOM (for routing)
*   Lucide React (for iconography)
*   React Calendar
*   Vanilla CSS (for custom glassmorphic aesthetics and responsive design)

**Backend:**
*   Node.js & Express.js
*   MongoDB (Mongoose ODM)
*   JSON Web Tokens (JWT) for secure route protection
*   Bcryptjs for password hashing

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   MongoDB instance (local or Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Eventify
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add your environment variables:
    ```env
    PORT=5000
    MONGO_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-secret-key>
    ```

3.  **Setup Frontend:**
    Open a new terminal window/tab:
    ```bash
    cd first
    npm install
    ```

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    npm start
    ```
    The server will run on the port specified in your `.env` file (e.g., http://localhost:5000).

2.  **Start the Frontend Development Server:**
    ```bash
    cd first
    npm run dev
    ```
    The Vite development server will typically start on http://localhost:5173.

## Progressive Web App (PWA) Features

Eventify is configured as a PWA. When running in a supported browser:
*   Users will be prompted to "Install App" directly from the interface.
*   The app includes a fully configured `manifest.json` and a service worker that caches assets for improved performance and offline resilience.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.
