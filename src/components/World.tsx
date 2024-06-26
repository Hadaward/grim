import { Box } from "@mui/material";
import { StaticImageData } from "next/image";
import { mergeStyle } from "@/components/util/style";
import globalStyle from "@/styles/global";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export type WorldProps = {
    background: StaticImageData,
    foreground?: StaticImageData,
    children?: React.ReactNode,
    worldPosition:{ x: number, y: number }
    worldRef?: MutableRefObject<HTMLDivElement | undefined>
};

export default function World({ background, foreground, children, worldPosition, worldRef }: WorldProps) {
    return (
        <Box sx={globalStyle.world} ref={worldRef}>
            <Box
            sx={mergeStyle(
                globalStyle.worldBackground,
                {
                    width: globalStyle.world.width,
                    height: globalStyle.world.height,
                    backgroundImage: `url(${ background.src })`,
                    backgroundPosition: `${worldPosition.x}px ${worldPosition.y}px`,
                    backgroundRepeat: "no-repeat",
                }
            )}
            />
            { children }
            { foreground && (
                <Box
                    sx={mergeStyle(
                        globalStyle.worldBackground,
                        {
                            left: -10,
                            zIndex: 2,
                            width: globalStyle.world.width,
                            height: globalStyle.world.height,
                            backgroundImage: `url(${ foreground.src })`,
                            backgroundPosition: `${worldPosition.x}px ${worldPosition.y}px`,
                            backgroundRepeat: "no-repeat",
                            opacity: 0.55
                        }
                    )}
                />
            )}
        </Box>
    )
}