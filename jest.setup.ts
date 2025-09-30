import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Fix for "ReferenceError: TextEncoder is not defined"
global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder

jest.mock('./src/infrastructure/services/api/config', () => ({
    getApiUrl: jest.fn(() => 'http://localhost:3500'),
    getSecretKey: jest.fn(() => 'RECEIPE'),
}))
