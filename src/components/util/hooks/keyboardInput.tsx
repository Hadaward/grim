import { useCallback, useEffect, useMemo, useRef } from "react";

type KeyboardUpdateCallback = (keys: Readonly<string[]>) => void

export function useKeyboardInput(callback: KeyboardUpdateCallback, filter: string|string[] = []) {
    const filterList: string[] = useMemo(() => {
        return typeof filter === "string"
        ? [filter]
        : filter;
    }, [filter]);

    const keys = useRef<string[]>([]);

    const onKeyDown = useCallback((event: KeyboardEvent) => {
        if (filterList.length > 0 && !filterList.includes(event.key)) {
            return;
        }

        if (!keys.current.includes(event.key)) {
            keys.current.push(event.key);
        }

        callback(Object.freeze([...keys.current]));
    }, [callback, filterList]);

    const onKeyUp = useCallback((event: KeyboardEvent) => {
        if (filterList.length > 0 && !filterList.includes(event.key)) {
            return;
        }

        if (keys.current.includes(event.key)) {
            keys.current.splice(keys.current.indexOf(event.key), 1);
        }

        callback(Object.freeze([...keys.current]));
    }, [callback, filterList])

    useEffect(() => {
        addEventListener("keydown", onKeyDown);
        addEventListener("keyup", onKeyUp);

        return () => {
            removeEventListener("keydown", onKeyDown);
            removeEventListener("keyup", onKeyUp);
        }
    }, [onKeyDown, onKeyUp]);
}