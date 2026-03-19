import React from 'react'
import { vi } from 'vitest'

// Mock Raycast API components
export const List = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('div', { ...props, ref, 'data-testid': 'raycast-list' })
})

export const Detail = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('div', { ...props, ref, 'data-testid': 'raycast-detail' })
})

export const ActionPanel = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('div', { ...props, ref, 'data-testid': 'raycast-action-panel' })
})

export const Action = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('button', { ...props, ref, 'data-testid': 'raycast-action' })
})

export const Form = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('form', { ...props, ref, 'data-testid': 'raycast-form' })
})

export const TextField = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('input', { ...props, ref, 'data-testid': 'raycast-textfield' })
})

export const TextArea = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('textarea', { ...props, ref, 'data-testid': 'raycast-textarea' })
})

export const Checkbox = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('input', { ...props, ref, type: 'checkbox', 'data-testid': 'raycast-checkbox' })
})

export const Dropdown = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('select', { ...props, ref, 'data-testid': 'raycast-dropdown' })
})

export const Icon = React.forwardRef<any, any>((props, ref) => {
  return React.createElement('span', { ...props, ref, 'data-testid': 'raycast-icon' })
})

export const Color = {}

// Mock functions
export const showToast = vi.fn()
export const Clipboard = {
  copy: vi.fn(),
}

// Export other utilities
export * from 'react'
