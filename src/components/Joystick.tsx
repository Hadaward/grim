import joystick from "@/styles/joystick";
import { Box, SxProps, Theme } from "@mui/material";
import { mergeStyle } from "./util/style";
import { TouchEvent, useState } from "react";

export type JoystickProps = {
    radius: number
    sx?: SxProps<Theme>
    knobSx?: SxProps<Theme>
    onAxisChange?: (direction: Readonly<{x: number, y: number}>) => void
}

export default function Joystick({ radius, sx, knobSx, onAxisChange }: JoystickProps) {
    const [position, setPosition] = useState({ x: radius, y: radius });

    const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        const target = (e.target as HTMLDivElement).parentElement;

        if (target?.id !== "joystick")
            return;

        const touch = e.touches[0];
        const rect = target?.getBoundingClientRect() ?? { left: 0, top: 0 };
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        const dx = x - radius;
        const dy = y - radius;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
            setPosition({ x, y });
        } else {
            const angle = Math.atan2(dy, dx);

            setPosition({
                x: radius + (radius * Math.cos(angle)),
                y: radius + (radius * Math.sin(angle)),
            });
        }

        const pDx = dx / radius;
        const pDy = dy / radius;

        const direction = {
            x: pDx > 0.5 ? 1 : pDx < -0.5 ? -1 : 0,
            y: pDy > 0.5 ? 1 : pDy < -0.5 ? -1 : 0,
        };

        onAxisChange?.(Object.freeze(direction));
    };

    const handleTouchEnd = () => {
        setPosition({ x: radius, y: radius });
        onAxisChange?.(Object.freeze({ x: 0, y: 0 }));
    };

    return (
        <Box
            id="joystick"
            sx={mergeStyle(joystick.wrapper, { width: radius * 2, height: radius * 2 }, sx ?? {})}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <Box sx={mergeStyle(joystick.knob, { width: radius, height: radius, top: position.y - radius / 2, left: position.x - radius / 2 }, knobSx ?? {})} />
        </Box>
    );
}
