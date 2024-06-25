"use client";

import { makeStyle } from "@/components/util/style";

export default makeStyle({
    wrapper: {
        position: "relative",
        border: "2px solid rgba(0,0,0,0.8)",
        borderRadius: "50%",
        touchAction: "none"
    },

    knob: {
        position: "absolute",
        width: "60px",
        height: "60px",
        background: "rgba(0,0,0,0.65)",
        borderRadius: "50%",
        touchAction: "none"
    }
});