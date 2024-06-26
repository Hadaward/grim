import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from "react";
import SpriteSheet from "./SpriteSheet";
import { useKeyboardInput } from "./util/hooks/keyboardInput";
import { useAnimationFrame } from "./util/hooks/requestAnimationFrame";

import charDown from "@/assets/char/down.png";
import charUp from "@/assets/char/up.png";
import charLeft from "@/assets/char/left.png";
import charRight from "@/assets/char/right.png";
import { mergeStyle } from "./util/style";
import globalStyle from "@/styles/global";

export type PlayerProps = {
    setPlayerPosition: Dispatch<SetStateAction<{x: number, y: number}>>
    worldSize: { width: number, height: number }
    /**
     * @default 0.3
     */
    friction?: number
    /**
     * @default 5
     */
    maxSpeed?: number,
    customAccel?: {x: number, y: number}
    isMobile: boolean
}

export default function Player({
    setPlayerPosition,
    worldSize,
    friction,
    maxSpeed,
    customAccel,
    isMobile
}: PlayerProps) {
    const [currentTexture, setCurrentTexture] = useState(charDown);
    const [isMoving, setIsMoving] = useState(false);

    const acceleration = useRef<{x: number, y: number}>({ x: 0, y: 0 });
    const velocity = useRef<{x: number, y: number}>({ x: 0, y: 0 });

    useEffect(() => {
        if (customAccel) {
            acceleration.current.x = customAccel.x;
            acceleration.current.y = customAccel.y;

            if (acceleration.current.x !== 0 && acceleration.current.y !== 0) {
                acceleration.current.x /= Math.sqrt(2);
                acceleration.current.y /= Math.sqrt(2);
            }
        }
    }, [customAccel]);

    useKeyboardInput(keys => {
        if (isMobile)
            return;

        acceleration.current.x = 0;
        acceleration.current.y = 0;

        if (keys.includes("a")) {
            acceleration.current.x = -1;
        }
        if (keys.includes("d")) {
            acceleration.current.x = 1;
        }
        if (keys.includes("w")) {
            acceleration.current.y = -1;
        }
        if (keys.includes("s")) {
            acceleration.current.y = 1;
        }

        if (acceleration.current.x !== 0 && acceleration.current.y !== 0) {
            acceleration.current.x /= Math.sqrt(2);
            acceleration.current.y /= Math.sqrt(2);
        }
    }, ["w", "a", "s", "d"]);

    useAnimationFrame((delta: number) => {
        const shouldBeMoving = acceleration.current.x !== 0 || acceleration.current.y !== 0;

        if (shouldBeMoving !== isMoving) {
            setIsMoving(shouldBeMoving);
        }

        const deltaSeconds = delta / 1000;
        const maxSpeed2 = maxSpeed ?? 1500;
        const friction2 = friction ?? 0.85;

        velocity.current.x += acceleration.current.x * deltaSeconds * maxSpeed2;
        velocity.current.y += acceleration.current.y * deltaSeconds * maxSpeed2;

        velocity.current.x *= Math.pow(friction2, deltaSeconds * 60);
        velocity.current.y *= Math.pow(friction2, deltaSeconds * 60);

        const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);

        if (speed > maxSpeed2) {
            const ratio = maxSpeed2 / speed;
            velocity.current.x *= ratio;
            velocity.current.y *= ratio;
        }

        if (velocity.current.x !== 0 || velocity.current.y !== 0) {
            setPlayerPosition(pos => ({ x: pos.x + velocity.current.x * deltaSeconds, y: pos.y + velocity.current.y * deltaSeconds }));

            if (Math.abs(velocity.current.x) > Math.abs(velocity.current.y)) {
                if (velocity.current.x > 0) {
                    setCurrentTexture(charRight);
                } else {
                    setCurrentTexture(charLeft);
                }
            } else {
                if (velocity.current.y > 0) {
                    setCurrentTexture(charDown);
                } else {
                    setCurrentTexture(charUp);
                }
            }
        }
    });

    return (
        <SpriteSheet
            frameSize={{
                width: currentTexture.width / 4,
                height: currentTexture.height
            }}
            image={currentTexture}
            animation={{
                enabled: isMoving,
                loop: true,
                resetWhenDisable: true,
            }}
            sx={mergeStyle(globalStyle.playerTexture, {
                left: (worldSize.width / 2),
                top: (worldSize.height / 2),  
            })}
        />
    )
}