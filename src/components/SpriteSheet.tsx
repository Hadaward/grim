"use client";

import { Box, SxProps, Theme } from "@mui/material";
import { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAnimationFrame } from "@/components/util/hooks/requestAnimationFrame";

export type AnimationSheetProps = {
    enabled: boolean,
    loop?: boolean,
    /**
     * The delay in milliseconds to the next frame
     * @default 180 = 60 * 3
     */
    delay?: number,
    resetWhenDisable: boolean
}

export type SpriteSheetProps = {
    cellWidth: number
    cellHeight: number
    /**
     * @default 0
     */
    cellX?: number
    /**
     * @default 0
     */
    cellY?: number
    image: StaticImageData
    animation?: AnimationSheetProps
    sx?: SxProps<Theme>
};

export default function SpriteSheet({ cellWidth, cellHeight, cellX, cellY, image, animation, sx }: SpriteSheetProps) {
    const [currentCellX, setCurrentCellX] = useState(0);
    const [currentCellY, setCurrentCellY] = useState(0);
    const [currentSpriteX, setCurrentSpriteX] = useState(cellWidth * currentCellX);
    const [currentSpriteY, setCurrentSpriteY] = useState(cellHeight * currentCellY);

    const accumulatedTimeRef = useRef<number>(0);

    useEffect(() => {
        setCurrentSpriteX(cellWidth * currentCellX);
        setCurrentSpriteY(cellHeight * currentCellY);
    }, [cellHeight, cellWidth, currentCellX, currentCellY]);

    useEffect(() => {
        if (animation && !animation.enabled && animation.resetWhenDisable) {
            setCurrentCellX(cellX ?? 0);
            setCurrentCellY(cellY ?? 0);
        }
    }, [animation, animation?.enabled, animation?.resetWhenDisable, cellX, cellY]);
    
    useAnimationFrame(delta => {
        if (!animation?.enabled)
            return;

        accumulatedTimeRef.current += delta;

        const delay = animation.delay ?? 180;

        if (accumulatedTimeRef.current >= delay) {
            accumulatedTimeRef.current %= delay;

            const maxCellX = Math.floor(image.width / cellWidth);
            const maxCellY = Math.floor(image.height / cellHeight);

            let nextCellX = currentCellX + 1;
            let nextCellY = currentCellY;

            if (nextCellX >= maxCellX) {
                nextCellX = 0;
                nextCellY++;

                if (nextCellY >= maxCellY) {
                    if (animation.loop) {
                        nextCellX = 0;
                        nextCellY = 0;
                    } else {
                        return;
                    }
                }
            }

            setCurrentCellX(nextCellX);
            setCurrentCellY(nextCellY);
            setCurrentSpriteX(cellWidth * nextCellX);
            setCurrentSpriteY(cellHeight * nextCellY);
        }
    });

    return (
        <Box
            sx={{
                ...(sx ?? {}),
                display: "inline-block",
                background: `url(${image.src})`,
                backgroundRepeat: "no-repeat",
                width: cellWidth,
                height: cellHeight,
                backgroundPosition: `-${currentSpriteX}px -${currentSpriteY}px`
            }}
        />
    )
}