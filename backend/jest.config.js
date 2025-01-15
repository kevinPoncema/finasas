/** @type {import('ts-jest').JestConfigWithTsJest} */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transformar archivos TypeScript usando ts-jest
  },
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }), // Mapear alias desde tsconfig.json
    '^(\\.{1,2}/.*)\\.js$': '$1', // Resolver extensiones ".js" correctamente para importar archivos TypeScript
  },
  testMatch: [
    '**/src/tests/**/*.[jt]s?(x)',
    '**/src/tests/?(*.)+(spec|test).[tj]s?(x)',
  ], // Localizar archivos de prueba
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Extensiones de archivos a resolver
  setupFiles: ['dotenv/config'], // Cargar variables de entorno antes de las pruebas
  clearMocks: true, // Limpiar mocks automáticamente entre pruebas
};
