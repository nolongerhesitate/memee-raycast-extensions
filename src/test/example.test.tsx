import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Simple test that doesn't import Raycast components
describe('Basic Tests', () => {
  it('should pass a basic assertion', () => {
    expect(true).toBe(true)
  })

  it('should render a simple div', () => {
    render(<div data-testid="test-div">Hello World</div>)
    expect(screen.getByTestId('test-div')).toBeInTheDocument()
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('should handle async operations', async () => {
    const asyncFunction = vi.fn().mockResolvedValue('test result')
    const result = await asyncFunction()
    expect(result).toBe('test result')
    expect(asyncFunction).toHaveBeenCalledOnce()
  })
})

// Function we want to spy on
const calculator = {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
}

describe('vi.spyOn example', () => {
  it('spies on existing method', () => {
    // Create spy on existing method
    const addSpy = vi.spyOn(calculator, 'add');

    // Call the method
    const result = calculator.add(2, 3);

    // Original functino still works
    expect(result).toBe(5);

    // But wen track calls
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith(2, 3);
    expect(addSpy).toHaveBeenCalledTimes(1);

    // Clean up
    addSpy.mockRestore();
  })

  // With custom return value
  // Purpose: Control what a function returns while still tracking how it's called - perfect for testing isolated scenarios.
  it('overrides return value', () => {
    const multiplySpy = vi.spyOn(calculator, 'multiply')
      .mockReturnValue(100) // Override return

    const result = calculator.multiply(2, 3);

    expect(result).toBe(100); // Gets mocked value
    expect(multiplySpy).toHaveBeenCalledWith(2, 3);

    multiplySpy.mockRestore();
  })
})
