import { Box } from "@mui/material";
import { StaticImageData } from "next/image";
import { mergeStyle } from "@/components/util/style";
import common from "@/styles/common";
import { MutableRefObject } from "react";

export type WorldProps = {
    background: StaticImageData,
    foreground?: StaticImageData,
    children?: React.ReactNode,
    backgroundPosition?: {
        x: number,
        y: number
    }
    worldRef?: MutableRefObject<HTMLDivElement | undefined>
};

export default function World({ background, foreground, children, backgroundPosition, worldRef }: WorldProps) {
    return (
        <Box sx={common.world} ref={worldRef}>
            <Box
            sx={{ top: 0, left: 0, zIndex: 0, position: "absolute", width: common.world.width, height: common.world.height, background: "black", backgroundImage: `url(${ background.src })`, backgroundPosition: `${backgroundPosition?.x ?? 0}px ${backgroundPosition?.y ?? 0}px` }}
            />
            { children }
            { foreground && (
                <Box
                sx={{ top: 0, left: -10, zIndex: 2, position: "absolute", width: common.world.width, height: common.world.height, background: "transparent", backgroundImage: `url(${ foreground.src })`, backgroundPosition: `${backgroundPosition?.x ?? 0}px ${backgroundPosition?.y ?? 0}px`, opacity: 0.55 }}
                />
            )}
        </Box>
    )
}