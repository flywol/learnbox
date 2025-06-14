# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

```
learn-admin
├─ README.md
├─ components.json
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ images
│  │  ├─ illustration.svg
│  │  └─ onboarding
│  │     ├─ admin-1.svg
│  │     ├─ admin-role.svg
│  │     ├─ parent-1.svg
│  │     ├─ parent-2.svg
│  │     ├─ parent-3.svg
│  │     ├─ parent-role.svg
│  │     ├─ student-1.svg
│  │     ├─ student-2.svg
│  │     ├─ student-3.svg
│  │     ├─ student-role.svg
│  │     ├─ teacher-1.svg
│  │     ├─ teacher-2.svg
│  │     ├─ teacher-3.svg
│  │     └─ teacher-role.svg
│  ├─ index.html
│  ├─ logo-splash.svg
│  └─ vite.svg
├─ src
│  ├─ App.tsx
│  ├─ components
│  │  └─ ui
│  │     └─ button.tsx
│  ├─ features
│  │  ├─ admin
│  │  └─ auth
│  │     ├─ components
│  │     │  └─ LoginForm.tsx
│  │     ├─ pages
│  │     │  ├─ LoginPage.tsx
│  │     │  ├─ OnboardingPage.tsx
│  │     │  ├─ RoleSelectionPage.tsx
│  │     │  ├─ UrlPage.tsx
│  │     │  └─ adminSignup
│  │     ├─ store
│  │     │  └─ useAuthStore.ts
│  │     └─ types
│  │        └─ auth.types.ts
│  ├─ index.css
│  ├─ lib
│  │  └─ utils.ts
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```