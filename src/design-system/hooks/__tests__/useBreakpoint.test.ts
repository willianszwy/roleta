import { renderHook, act } from '@testing-library/react';
import { useBreakpoint } from '../useBreakpoint';

// Mock para window.innerWidth
const mockWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
};

// Mock para window.addEventListener e removeEventListener
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

beforeEach(() => {
  Object.defineProperty(window, 'addEventListener', {
    writable: true,
    value: mockAddEventListener,
  });
  Object.defineProperty(window, 'removeEventListener', {
    writable: true,
    value: mockRemoveEventListener,
  });
  
  jest.clearAllMocks();
});

describe('useBreakpoint Hook', () => {
  it('returns mobile breakpoint for small screens', () => {
    mockWindowWidth(400);
    const { result } = renderHook(() => useBreakpoint());
    
    expect(result.current.current).toBe('mobile');
    expect(result.current.isMobile).toBe(true);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isWide).toBe(false);
    expect(result.current.width).toBe(400);
  });

  it('returns tablet breakpoint for medium screens', () => {
    mockWindowWidth(700);
    const { result } = renderHook(() => useBreakpoint());
    
    expect(result.current.current).toBe('tablet');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(true);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isWide).toBe(false);
    expect(result.current.width).toBe(700);
  });

  it('returns desktop breakpoint for large screens', () => {
    mockWindowWidth(1000);
    const { result } = renderHook(() => useBreakpoint());
    
    expect(result.current.current).toBe('desktop');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(true);
    expect(result.current.isWide).toBe(false);
    expect(result.current.width).toBe(1000);
  });

  it('returns wide breakpoint for extra large screens', () => {
    mockWindowWidth(1400);
    const { result } = renderHook(() => useBreakpoint());
    
    expect(result.current.current).toBe('wide');
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isTablet).toBe(false);
    expect(result.current.isDesktop).toBe(false);
    expect(result.current.isWide).toBe(true);
    expect(result.current.width).toBe(1400);
  });

  it('handles boundary values correctly', () => {
    // Test exactly at tablet breakpoint (768px)
    mockWindowWidth(768);
    const { result, rerender } = renderHook(() => useBreakpoint());
    expect(result.current.current).toBe('tablet');

    // Test exactly at desktop breakpoint (1024px)  
    mockWindowWidth(1024);
    rerender();
    expect(result.current.current).toBe('desktop');

    // Test exactly at wide breakpoint (1280px)
    mockWindowWidth(1280);
    rerender();
    expect(result.current.current).toBe('wide');
  });

  it('sets up resize event listener on mount', () => {
    mockWindowWidth(1000);
    renderHook(() => useBreakpoint());
    
    expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('cleans up resize event listener on unmount', () => {
    mockWindowWidth(1000);
    const { unmount } = renderHook(() => useBreakpoint());
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('updates state when window is resized', () => {
    mockWindowWidth(400);
    const { result } = renderHook(() => useBreakpoint());
    
    expect(result.current.current).toBe('mobile');
    
    // Simulate window resize
    act(() => {
      mockWindowWidth(1000);
      // Trigger the resize event listener
      const resizeHandler = mockAddEventListener.mock.calls[0][1];
      resizeHandler();
    });
    
    expect(result.current.current).toBe('desktop');
    expect(result.current.width).toBe(1000);
  });

  it('handles SSR environment (no window)', () => {
    const originalWindow = global.window;
    
    // Simulate SSR by removing window
    delete (global as any).window;
    
    const { result } = renderHook(() => useBreakpoint());
    
    expect(result.current.width).toBe(0);
    expect(result.current.current).toBe('mobile');
    
    // Restore window
    global.window = originalWindow;
  });
});