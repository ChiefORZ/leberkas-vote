// @ts-check

import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import hooksPlugin from "eslint-plugin-react-hooks";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import globals from "globals";

const config = [
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			...react.configs.flat["jsx-runtime"].plugins,
			"@typescript-eslint": typescriptEslint,
			"react-compiler": reactCompiler,
			"react-hooks": hooksPlugin,
			"sort-keys-fix": sortKeysFix,
		},
		languageOptions: {
			parser: typescriptEslintParser,
			...react.configs.flat["jsx-runtime"].languageOptions,
			globals: {
				...globals.node,
			},
		},
		rules: {
			...react.configs.flat["jsx-runtime"].rules,
			...hooksPlugin.configs.recommended.rules,
			"react-compiler/react-compiler": "error",
			"sort-keys-fix/sort-keys-fix": "warn",
		},
	},
];

export default config;
