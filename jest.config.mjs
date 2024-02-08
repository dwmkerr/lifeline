/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  //  We're using ts-jest for typescript support. Treat *.ts files as ESM
  //  modules so that we can use 'import'.
  //  See:
  //    https://kulshekhar.github.io/ts-jest/docs/next/guides/esm-support/
  preset: "ts-jest",
  resolver: "ts-jest-resolver",
  // extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          allowJs: true,
        },
      },
    ],
  },

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,ts}"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // The test environment that will be used for testing
  testEnvironment: "jsdom",
  setupFiles: ["react-app-polyfill/jsdom"],
  setupFilesAfterEnv: ["./setup-jest.js"],
};

//   "transform": {
//     "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/config/jest/babelTransform.js",
//     "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
//     "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
//   },
//   "transformIgnorePatterns": [
//     "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
//     "^.+\\.module\\.(css|sass|scss)$"
//   ],
//   "modulePaths": [],
//   "moduleNameMapper": {
//     "^react-native$": "react-native-web",
//     "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
//   },
//   "moduleFileExtensions": [
//     "web.js",
//     "js",
//     "web.ts",
//     "ts",
//     "web.tsx",
//     "tsx",
//     "json",
//     "web.jsx",
//     "jsx",
//     "node"
//   ],
//   "watchPlugins": [
//     "jest-watch-typeahead/filename",
//     "jest-watch-typeahead/testname"
//   ],
//   "resetMocks": true
// },
