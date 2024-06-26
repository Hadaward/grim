"use client";

import { makeStyle } from "@/components/util/style";

export default makeStyle({
    world: {
        width: "100%",
        height: "100%",
        background: "#67E6D2",
        position: "relative",
    },

    worldBackground: {
        top: 0,
        left: 0,
        zIndex: 0,
        position: "absolute",
        background: "transparent",
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
    },

    playerTexture: {
        position: "absolute",
        zIndex: 1
    }
});