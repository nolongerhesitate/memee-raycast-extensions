import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Raycast API completely
vi.mock('@raycast/api', () => ({
  List: vi.fn(),
  Detail: vi.fn(),
  ActionPanel: vi.fn(),
  Action: vi.fn(),
  showToast: vi.fn(),
  Clipboard: {
    copy: vi.fn(),
  },
  Icon: vi.fn(),
  Color: vi.fn(),
  Form: vi.fn(),
  TextField: vi.fn(),
  TextArea: vi.fn(),
  Checkbox: vi.fn(),
  Dropdown: vi.fn(),
}))

// Mock @raycast/utils
vi.mock('@raycast/utils', () => ({
  useFetch: vi.fn(),
  usePromise: vi.fn(),
  useCachedState: vi.fn(),
  useLocalStorage: vi.fn(),
}))

// Mock React components
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    // Add any React mocks if needed
  }
})
