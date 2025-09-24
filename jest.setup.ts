// import '@testing-library/jest-dom';
// import { TextEncoder, TextDecoder } from "util";

// Object.assign(global, { TextEncoder, TextDecoder });

// // jest.setup.ts
// (globalThis as any).importMetaEnv = {
//   VITE_SECRET_KEY: 'RECEIPE'
// };

import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Fix for "ReferenceError: TextEncoder is not defined"
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock Vite import.meta.env
(global as any).importMetaEnv = {
  VITE_SECRET_KEY: "RECEIPE",
};


jest.mock('./src/infrastructure/services/api/config', () => ({
  getApiUrl: jest.fn(() => 'http://localhost:3500'),
  getSecretKey: jest.fn(()=>'RECEIPE')
}));
