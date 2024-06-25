import joystick from "@/styles/joystick";
import { Box, SxProps, Theme } from "@mui/material";
import { mergeStyle } from "./util/style";
import { useState } from "react";

export type JoystickProps = {
    radius: number
    sx?: SxProps<Theme>
    knobSx?: SxProps<Theme>
    onAxisChange?: (direction: Readonly<{x: number, y: number}>) => void
}

export default function Joystick({ radius, sx, knobSx, onAxisChange }: JoystickProps) {
    const [position, setPosition] = useState({ x: radius / 2, y: radius / 2 });

    const handleTouchMove = (e: any) => {
        const touch = e.touches[0];
        const rect = (e.target as HTMLDivElement).parentElement?.getBoundingClientRect() ?? { left: 0, top: 0 };
        const x = touch.clientX - rect.left - radius / 2;
        const y = touch.clientY - rect.top - radius / 2;

        const dx = x - radius / 2;
        const dy = y - radius / 2;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius / 2) {
            setPosition({ x, y });
        } else {
            const angle = Math.atan2(dy, dx);
            setPosition({
                x: radius / 2 + (radius / 2) * Math.cos(angle),
                y: radius / 2 + (radius / 2) * Math.sin(angle),
            });
        }

        const pDx = Math.floor(dx / radius);
        const pDy = Math.floor(dy / radius);

        const direction = {
            x: pDx > 0 ? 1 : pDx < 0 ? -1 : 0,
            y: pDy > 0 ? 1 : pDy < 0 ? -1 : 0,
        };

        onAxisChange?.(Object.freeze(direction));
    };

    const handleTouchEnd = () => {
        setPosition({ x: radius / 2, y: radius / 2 });
        onAxisChange?.(Object.freeze({ x: 0, y: 0 }));
    };

    return (
        <Box
            sx={mergeStyle(joystick.wrapper, { width: radius * 2, height: radius * 2 }, sx ?? {})}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <Box sx={mergeStyle(joystick.knob, { width: radius, height: radius, top: position.y, left: position.x }, knobSx ?? {})} />
        </Box>
    );
}