# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
    languageOptions: {
        // other options...
        parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
        },
    },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
    // Set the react version
    settings: { react: { version: '18.3' } },
    plugins: {
        // Add the react plugin
        react,
    },
    rules: {
        // other rules...
        // Enable its recommended rules
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
    },
})
```

# Jest Unit Testing in TypeScript

This guide explains how to set up and implement **unit tests using Jest** in a **TypeScript** project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Project Setup](#project-setup)
4. [Configuring Jest with TypeScript](#configuring-jest-with-typescript)

---

## Prerequisites

Make sure you have the following installed:

- Node.js (v14+ recommended)
- npm or yarn
- TypeScript

---

## Installation

Install Jest and TypeScript support packages:

```bash
# Using npm
npm install --save-dev jest ts-jest @types/jest
```

```bash
npx ts-jest config:init
```

"scripts": {
"test": "jest",
"test:watch": "jest --watch"
}

# Zod & SWR Setup Guide

This guide explains how to install and configure **Zod** (for schema validation) and **SWR** (for data fetching and caching) in your project.

---

## 📦 Installation

Run the following commands to install both libraries:

```bash
# Using npm
npm install zod swr
npm install swr-devtools

```

# Prettier Configuration for Code Formatting

This guide explains how to set up **Prettier** using a configuration file instead of relying on IDE extensions. This ensures consistent formatting across all environments, projects, and team members.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Creating Prettier Configuration File](#creating-prettier-configuration-file)
4. [Common Configuration Options](#common-configuration-options)
5. [Using Prettier](#using-prettier)
6. [Adding Prettier Scripts to Package.json](#adding-prettier-scripts-to-packagejson)

---

## Prerequisites

- Node.js installed (v14+ recommended)
- npm or yarn

---

## Installation

Install Prettier as a development dependency:

```bash
# Using npm
npm install --save-dev prettier
```

## Creating Prettier Configuration File

Instead of relying on IDE formatting, create a configuration file in the project root:

.prettierrc (JSON format)

{
"semi": true,
"singleQuote": true,
"trailingComma": "es5",
"tabWidth": 2,
"printWidth": 80,
"endOfLine": "lf"
}

## Using Prettier

Format all files

```bash
npx prettier --write .
npx prettier --check .
```

## Adding Prettier Scripts to package.json

"scripts": {
"format": "prettier --write .",
"format:check": "prettier --check ."
}

Now you can run:

```bash
npm run format
npm run format:check
```
