import { DependencyList, useRef } from 'react';
import { useUpdateEffect } from 'react-use';

export interface UseScrollToElementOptions extends ScrollIntoViewOptions {
  skip?: boolean;
}

const useScrollToElement = (
  element: HTMLElement,
  deps: DependencyList,
  opts: UseScrollToElementOptions = {
    behavior: 'auto',
    block: 'start',
    skip: false,
  }
) => {
  const skip = useRef(opts.skip);

  useUpdateEffect(() => {
    skip.current = opts.skip;
  }, [opts.skip]);

  useUpdateEffect(() => {
    if (!skip.current) {
      element.scrollIntoView(opts);
    }
  }, deps);
};

export default useScrollToElement;
