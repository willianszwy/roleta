declare module 'jest-axe' {
  import { AxeResults } from 'axe-core';

  export function axe(element: Element | Document): Promise<AxeResults>;
  export const toHaveNoViolations: any;
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}