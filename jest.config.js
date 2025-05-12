module.exports = {
    testEnvironment: "jsdom",
    testMatch: ["**/tests-frontend/**/*.test.js"],
    setupFilesAfterEnv: ["@testing-library/jest-dom"],
    transform: {
      "^.+\\.jsx?$": "babel-jest"
    }
  };