# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

------------------------------------------------------------------------------------------------


chaintrace-frontend/
├── node_modules/ # Sab libraries (React, Tailwind, Axios, Lucide, jspdf, html2canvas)
├── public/ # Static assets (icons, images, ca.pem)
├── src/
│ ├── pages/ # Pages (Screens)
│ │ ├── LandingPage.jsx # Home Screen (Search/Track Bar + Start/Join Buttons)
│ │ ├── CreateCase.jsx # User A Form (Updated: Image Compression + Case ID Generation)
│ │ ├── JoinCase.jsx # User B/C/D Form (Updated: Linking via Case ID + Compressed Image Upload)
│ │ ├── ChainView.jsx # Visual Evidence Report (Updated: Vertical Timeline + PDF Export)
│ │ ├── AdminLogin.jsx # New: Secure Access Page (Username/Password authentication)
│ │ └── AdminDashboard.jsx# New: Control Room (Search, View Chain, aur Delete Case functionality)
│ ├── App.jsx # Main Logic (Updated: Protected Routes + Sticky Navbar + Global Layout)
│ ├── index.css # Tailwind CSS & Global Professional Styles
│ └── main.jsx # React Entry Point
├── tailwind.config.js # Custom UI Styling Configuration
├── postcss.config.js # CSS Processing
└── vite.config.js # Vite Environment Settings








🛠️ Frontend Features (Jo kaam humne kiya)
Smart Image Compression: CreateCase aur JoinCase mein images ko backend par bhejne se pehle browser mein hi resize aur compress kiya jata hai taake speed fast ho sake.
Professional Evidence Report: ChainView mein aik vertical timeline banayi gayi hai jo transaction flow (A ➔ B ➔ C) ko visually dikhati hai.
One-Click PDF Export: jspdf aur html2canvas ke zariye poori chain report ko aik professional document mein download karne ka feature add kiya.
Admin Security: localStorage aur Login page ke zariye Admin Panel ko password-protect kiya gaya.
Status Indicators: Navbar mein "Secure Protocol" aur Database connection status ke visual indicators add kiye.
Interactive Dashboard: Admin panel mein real-time search aur unwanted test cases ko delete karne ka option diya.