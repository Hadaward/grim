import { useCallback, useEffect, useRef } from "react";

type AnimationFrameCallback = (delta: number) => void

export function useAnimationFrame(callback: AnimationFrameCallback) {
  const rAFIdRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const forceStopRef = useRef<boolean>(false);

  const animate = useCallback((time: number) => {
    if (forceStopRef.current) {
        if (rAFIdRef.current) cancelAnimationFrame(rAFIdRef.current);
        return;
    }

    if (!previousTimeRef.current) {
      previousTimeRef.current = time;
    }
      
    try {
        callback(time - previousTimeRef.current);
    } catch (error) {
        console.error(error);
    }

    previousTimeRef.current = time;
    rAFIdRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    if (!forceStopRef.current) {
        rAFIdRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (rAFIdRef.current) {
          cancelAnimationFrame(rAFIdRef.current);
      }
    }
  }, [animate]);

  return Object.freeze({
    stop: () => {
        forceStopRef.current = true;
    }
  })
}