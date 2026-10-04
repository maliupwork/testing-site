/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof (window as unknown as { initExitIntent?: () => () => void }).initExitIntent === 'function') {
      const cleanup = (window as unknown as { initExitIntent: () => () => void }).initExitIntent();
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      };
    }
  }, []);

  return <div></div>;
}
