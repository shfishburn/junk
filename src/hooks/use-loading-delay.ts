import { useState, useEffect } from "react";

/**
 * Hook that simulates a loading state for perceived performance.
 * Shows skeleton for a brief moment even if content is ready immediately.
 */
export function useLoadingDelay(delayMs: number = 400): boolean {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return isLoading;
}
