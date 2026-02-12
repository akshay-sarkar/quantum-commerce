// @ts-check

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,ts,jsx,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            // Add or override rules here
            "@typescript-eslint/no-explicit-any": "warn",
            "semi": ["warn"],
        },
    },
    {
        ignores: ["dist/", "node_modules/", "build/"]
    }
);