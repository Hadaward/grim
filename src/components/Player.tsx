import { useEffect, useRef, useState } from "react";
import SpriteSheet from "./SpriteSheet";
import { useKeyboardInput } from "./util/hooks/keyboardInput";
import { useAnimationFrame } from "./util/hooks/requestAnimationFrame";

import charDown from "@/assets/char/down.png";
import charUp from "@/assets/char/up.png";
import charLeft from "@/assets/char/left.png";
import charRight from "@/assets/char/right.png";

export type PlayerProps = {
    onPlayerMove?: (x: number, y: number) => void,
    worldWidth: number,
    worldHeight: number
}

export default function Player({ onPlayerMove, worldWidth, worldHeight }: PlayerProps) {
    const [currentTexture, setCurrentTexture] = useState(charDown);

    const [positionX, setPositionX] = useState(-153);
    const [positionY, setPositionY] = useState(1117);

    const [isMoving, setIsMoving] = useState(false);

    const acceleration = useRef<{x: number, y: number}>({ x: 0, y: 0 });

    useEffect(() => {
        onPlayerMove?.(positionX, positionY);
    }, [onPlayerMove, positionX, positionY]);

    useKeyboardInput(keys => {
        const isPressingMoveKeys = keys.includes("w")||keys.includes("a")||keys.includes("s")||keys.includes("d");

        if (isMoving && !isPressingMoveKeys) {
            setIsMoving(false);
        }

        if (isPressingMoveKeys && !isMoving) {
            setIsMoving(true);
        }

        if (keys.includes("a")) {
            acceleration.current.x = -4;
        }
        if (keys.includes("d")) {
            acceleration.current.x = 4;
        }
        if (keys.includes("w")) {
            acceleration.current.y = -4;
        }
        if (keys.includes("s")) {
            acceleration.current.y = 4;
        }

        if (!keys.includes("a") && !keys.includes("d")) {
            acceleration.current.x = 0;
        }

        if (!keys.includes("w") && !keys.includes("s")) {
            acceleration.current.y = 0;
        }
    }, ["w", "a", "s", "d"]);

    useAnimationFrame(() => {
        if (acceleration.current.x !== 0) {
            setPositionX(x => x + acceleration.current.x);

            if (acceleration.current.x > 0) {
                setCurrentTexture(charRight);
            } else {
                setCurrentTexture(charLeft);
            }
        }

        if (acceleration.current.y !== 0) {
            setPositionY(y => y + acceleration.current.y);

            if (acceleration.current.y > 0) {
                setCurrentTexture(charDown);
            } else {
                setCurrentTexture(charUp);
            }
        }
    });

    return (
        <SpriteSheet
            cellWidth={currentTexture.width / 4}
            cellHeight={currentTexture.height}
            cellX={0}
            cellY={0}
            image={currentTexture}
            animation={{
                enabled: isMoving,
                loop: true,
                resetWhenDisable: true,
            }}
            sx={{
                position: "absolute",
                left: (worldWidth / 2),
                top: (worldHeight / 2),
                zIndex: 1
            }}
        />
    )
}