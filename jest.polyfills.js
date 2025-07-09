const { TextDecoder, TextEncoder } = require('util')

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
})

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
)

// Mock other web APIs as needed
global.ReadableStream = class ReadableStream {
  constructor() {}
}

global.WritableStream = class WritableStream {
  constructor() {}
}

global.TransformStream = class TransformStream {
  constructor() {}
}