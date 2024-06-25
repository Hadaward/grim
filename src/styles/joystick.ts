"use client";

import { makeStyle } from "@/components/util/style";

export default makeStyle({
    wrapper: {
        position: "relative",
        border: "2px solid #111111C2",
        borderRadius: "50%",
        touchAction: "none"
    },

    knob: {
        position: "absolute",
        width: "60px",
        height: "60px",
        background: "#001102",
        borderRadius: "50%",
        touchAction: "none"
    }
});