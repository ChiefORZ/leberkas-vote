import React from 'react';

interface FromTo {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  from: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  to: any;
}

type Changes = Record<string, FromTo>;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type GenericProps = Record<string, any>;

// TypeScript adaptation of https://usehooks.com/useWhyDidYouUpdate/
export function useWhyDidYouUpdate(name: string, props: GenericProps): void {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps = React.useRef<GenericProps>(props);

  React.useEffect(() => {
    if (previousProps?.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // Use this object to keep track of changed props
      const changes: Changes = {};
      // Iterate through keys
      for (const key of allKeys) {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          // Add to changesObj
          changes[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      }

      if (Object.keys(changes).length) {
        console.info('[why-did-you-update]', name, changes);
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props;
  });
}
