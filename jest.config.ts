import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/e2e/",
    "<rootDir>/features/",
  ],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/react-jest.setup.ts"],
};

export default createJestConfig(config);
