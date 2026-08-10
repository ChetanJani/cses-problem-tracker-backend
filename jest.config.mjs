/** @type {import('jest').Config} */
const config = {
    testEnvironment: "node",
    testMatch: ["**/*.test.js"],
    setupFilesAfterEnv: ["./tests/setup.js"],
    restoreMocks: true,
    verbose: true,
};

export default config;
