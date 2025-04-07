module.exports = {
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/dist/",
    "<rootDir>/e2e-playwright/",
    "<rootDir>/projects/tags-input-demo/src/test.ts", // Ignore Karma setup file
  ],
  projects: [
    // Configuration for the library
    {
      displayName: "lib",
      preset: "jest-preset-angular",
      setupFilesAfterEnv: [
        "<rootDir>/projects/angular-tags-input/src/setup-jest.ts",
      ],
      testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/dist/",
        "<rootDir>/e2e-playwright/",
        "<rootDir>/projects/tags-input-demo/", // Ignore demo app tests for this project config
      ],
      transform: {
        "^.+\\.(ts|js|mjs|html|svg)$": [
          "jest-preset-angular",
          {
            tsconfig:
              "<rootDir>/projects/angular-tags-input/tsconfig.spec.json",
            stringifyContentPathRegex: "\\.html$",
          },
        ],
      },
    },
    // Configuration for the demo application
    {
      displayName: "demo",
      preset: "jest-preset-angular",
      setupFilesAfterEnv: [
        "<rootDir>/projects/tags-input-demo/src/setup-jest.ts", // Use demo-specific setup
      ],
      testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/dist/",
        "<rootDir>/e2e-playwright/",
        "<rootDir>/projects/angular-tags-input/", // Ignore library tests for this project config
        "<rootDir>/projects/tags-input-demo/src/test.ts", // Ignore Karma setup file specifically for demo project
      ],
      transform: {
        "^.+\\.(ts|js|mjs|html|svg)$": [
          "jest-preset-angular",
          {
            tsconfig: "<rootDir>/projects/tags-input-demo/tsconfig.spec.json", // Use demo-specific tsconfig
            stringifyContentPathRegex: "\\.html$",
          },
        ],
      },
      moduleNameMapper: {
        // Map the library's public API path for demo app tests
        "^angular-tags-input$":
          "<rootDir>/projects/angular-tags-input/src/public-api.ts",
      },
    },
  ],
};
