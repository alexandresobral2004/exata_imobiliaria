import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'

// Make React globally available for JSX
global.React = React

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Polyfill for Request and Response objects
if (typeof global.Request === 'undefined') {
  global.Request = require('next/dist/compiled/@edge-runtime/ponyfill').Request;
}
if (typeof global.Response === 'undefined') {
  global.Response = require('next/dist/compiled/@edge-runtime/ponyfill').Response;
}
if (typeof global.Headers === 'undefined') {
  global.Headers = require('next/dist/compiled/@edge-runtime/ponyfill').Headers;
}

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
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
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

