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
    frameSize: { width: number, height: number }
    initialFrame?: { x: number, y: number }
    image: StaticImageData
    animation?: AnimationSheetProps
    sx?: SxProps<Theme>
};

export default function SpriteSheet({ initialFrame, frameSize, image, animation, sx }: SpriteSheetProps) {
    const [currentFrame, setCurrentFrame] = useState({
        x: 0,
        y: 0
    });

    const [currentSpritePosition, setCurrentSpritePosition] = useState({
        x: frameSize.width * currentFrame.x,
        y: frameSize.height * currentFrame.y
    });

    const accumulatedTimeRef = useRef<number>(0);

    useEffect(() => {
        setCurrentSpritePosition({
            x: frameSize.width * currentFrame.x,
            y: frameSize.height * currentFrame.y
        });
    }, [currentFrame, frameSize]);

    useEffect(() => {
        if (animation && !animation.enabled && animation.resetWhenDisable) {
            setCurrentFrame({ x: initialFrame?.x ?? 0, y: initialFrame?.y ?? 0 });
        }
    }, [animation, initialFrame]);
    
    useAnimationFrame(delta => {
        if (!animation?.enabled)
            return;

        accumulatedTimeRef.current += delta;

        const delay = animation.delay ?? 180;

        if (accumulatedTimeRef.current >= delay) {
            accumulatedTimeRef.current %= delay;

            const maxFrame = {
                x: Math.floor(image.width / frameSize.width),
                y: Math.floor(image.height / frameSize.height)
            };

            const nextFrame = {
                x: currentFrame.x + 1,
                y: currentFrame.y
            };

            if (nextFrame.x >= maxFrame.x) {
                nextFrame.x = 0;
                nextFrame.y++;

                if (nextFrame.y >= maxFrame.y) {
                    if (animation.loop) {
                        nextFrame.x = 0;
                        nextFrame.y = 0;
                    } else {
                        return;
                    }
                }
            }

            setCurrentFrame({ x: nextFrame.x, y: nextFrame.y });
            setCurrentSpritePosition({
                x: frameSize.width * nextFrame.x,
                y: frameSize.height * nextFrame.y
            });
        }
    });

    return (
        <Box
            sx={{
                ...(sx ?? {}),
                display: "inline-block",
                background: `url(${image.src})`,
                backgroundRepeat: "no-repeat",
                width: frameSize.width,
                height: frameSize.height,
                backgroundPosition: `-${currentSpritePosition.x}px -${currentSpritePosition.y}px`
            }}
        />
    )
}