import '@testing-library/jest-dom'

// Mock Web APIs that aren't available in jsdom
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock ResizeObserver
(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock WebGL context for three.js
const mockWebGLContext = {
  canvas: document.createElement('canvas'),
  getExtension: () => null,
  getParameter: () => null,
  createShader: () => null,
  shaderSource: () => null,
  compileShader: () => null,
  createProgram: () => null,
  attachShader: () => null,
  linkProgram: () => null,
  useProgram: () => null,
  createBuffer: () => null,
  bindBuffer: () => null,
  bufferData: () => null,
  enableVertexAttribArray: () => null,
  vertexAttribPointer: () => null,
  drawArrays: () => null,
  clearColor: () => null,
  clear: () => null,
  viewport: () => null,
}

HTMLCanvasElement.prototype.getContext = ((contextType: string) => {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return mockWebGLContext as any
  }
  return null
}) as any