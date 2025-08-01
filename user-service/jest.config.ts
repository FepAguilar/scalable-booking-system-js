import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {}],
  },
  moduleNameMapper: {
    '^generated/prisma$': '<rootDir>/../generated/prisma',
  },
  testEnvironment: 'node',
};

export default config;
