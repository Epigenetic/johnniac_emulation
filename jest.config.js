/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper:{
    '^(\\.{1,2}/.*)\\.js$': '$1',
  }
}; 