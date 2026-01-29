# Ei - Enterprise React Boilerplate

An enterprise-ready React innovation built with TypeScript, Redux Toolkit

## 🚀 Features

- **React 18** with **Vite** for lightning-fast development.
- **TypeScript** for type safety and better DX.
- **Redux Toolkit** for predictable state management.
- **Tailwind CSS** for a hybrid styling approach.
- **Ei UI Kit** - Custom, reusable, and accessible components.
- **Modular Feature Architecture** for easy scalability.
- **Security First**: 
  - JWT Authentication flow.
  - Environment variable validation using Yup.
  - Axios interceptors for secure API calls.
- **Production Ready**:
  - Global Error Boundaries.
  - Code splitting and lazy loading.
  - Component generators for rapid development.
  - Git hooks (Husky) and linting (ESLint/Prettier).

## 🛠 Tech Stack

- **Core**: React, TypeScript, React Router 6.
- **State**: Redux Toolkit, RTK Query capability.
- **UI**: Tailwind CSS.
- **Forms**: Formik, Yup.
- **API**: Axios.
- **Utils**: Day.js, UUID.

## 📂 Project Structure

```text
src/
├── app/               # Global configuration and providers
├── components/        # Shared and UI kit components
├── features/          # Modular feature components (Auth, Dashboard)
├── hooks/             # Global custom hooks
├── lib/               # Third-party library configurations (Axios)
├── routes/            # Routing configuration
├── services/          # API services
├── store/             # Global Redux store
├── styles/            # Theme and global styles
├── types/             # Global TypeScript types
└── utils/             # Utility functions
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the values.

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Component Generation
To create a new UI component:
```bash
node scripts/generate-component.js MyNewComponent
```

## ⚖️ License
MIT
