"use client";

import { makeStyle } from "@/components/util/style";

export default makeStyle({
    world: {
        width: "100%",
        height: "100%",
        backgroundRepeat: "no-repeat",
        position: "relative",
    },

    uiContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        background: "transparent",
        color: "transparent",
        border: "none",
        outline: "none",
        zIndex: 3
    }
});