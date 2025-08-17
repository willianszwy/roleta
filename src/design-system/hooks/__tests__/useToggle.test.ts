import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../useToggle';

describe('useToggle Hook', () => {
  it('initializes with default value false', () => {
    const { result } = renderHook(() => useToggle());
    
    expect(result.current[0]).toBe(false);
    expect(typeof result.current[1]).toBe('function');
    expect(typeof result.current[2]).toBe('function');
  });

  it('initializes with custom initial value', () => {
    const { result } = renderHook(() => useToggle(true));
    
    expect(result.current[0]).toBe(true);
  });

  it('toggles value when toggle function is called', () => {
    const { result } = renderHook(() => useToggle(false));
    
    expect(result.current[0]).toBe(false);
    
    act(() => {
      result.current[1](); // toggle function
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1](); // toggle again
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('sets specific value when set function is called', () => {
    const { result } = renderHook(() => useToggle(false));
    
    expect(result.current[0]).toBe(false);
    
    act(() => {
      result.current[2](true); // set function
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[2](false); // set to false
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('maintains function references between renders', () => {
    const { result, rerender } = renderHook(() => useToggle());
    
    const firstToggleRef = result.current[1];
    const firstSetRef = result.current[2];
    
    rerender();
    
    expect(result.current[1]).toBe(firstToggleRef);
    expect(result.current[2]).toBe(firstSetRef);
  });

  it('handles multiple toggles correctly', () => {
    const { result } = renderHook(() => useToggle(false));
    
    // Test multiple rapid toggles
    act(() => {
      result.current[1](); // false -> true
      result.current[1](); // true -> false  
      result.current[1](); // false -> true
    });
    
    expect(result.current[0]).toBe(true);
  });

  it('set function overrides current state regardless of previous value', () => {
    const { result } = renderHook(() => useToggle(true));
    
    // Set to true when already true
    act(() => {
      result.current[2](true);
    });
    expect(result.current[0]).toBe(true);
    
    // Set to false
    act(() => {
      result.current[2](false);
    });
    expect(result.current[0]).toBe(false);
    
    // Set to false when already false
    act(() => {
      result.current[2](false);
    });
    expect(result.current[0]).toBe(false);
  });

  it('works with different initial values', () => {
    const { result: result1 } = renderHook(() => useToggle(true));
    const { result: result2 } = renderHook(() => useToggle(false));
    
    expect(result1.current[0]).toBe(true);
    expect(result2.current[0]).toBe(false);
    
    act(() => {
      result1.current[1](); // true -> false
      result2.current[1](); // false -> true
    });
    
    expect(result1.current[0]).toBe(false);
    expect(result2.current[0]).toBe(true);
  });
});