// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill for Request and Response objects in Jest environment
// This is necessary for testing Next.js API routes that use these Web APIs
if (typeof global.Request === 'undefined') {
  global.Request = require('next/dist/compiled/@edge-runtime/ponyfill').Request;
}
if (typeof global.Response === 'undefined') {
  global.Response = require('next/dist/compiled/@edge-runtime/ponyfill').Response;
}
if (typeof global.Headers === 'undefined') {
  global.Headers = require('next/dist/compiled/@edge-runtime/ponyfill').Headers;
}

// Suppress webpack loader warnings during tests
const originalWarn = console.warn
const originalError = console.error

beforeAll(() => {
  console.warn = (...args) => {
    // Suppress webpack loader warnings
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('webpack') ||
        args[0].includes('next-swc-loader') ||
        args[0].includes('SWC') ||
        args[0].includes('resolve commonjs'))
    ) {
      return
    }
    originalWarn(...args)
  }

  console.error = (...args) => {
    // Suppress webpack loader errors during tests (they're usually harmless)
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('webpack') ||
        args[0].includes('next-swc-loader') ||
        args[0].includes('SWC'))
    ) {
      return
    }
    originalError(...args)
  }
})

afterAll(() => {
  console.warn = originalWarn
  console.error = originalError
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock sonner (toast library)
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  },
}))

