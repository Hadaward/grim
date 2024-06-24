"use client";

import harmonyMap from "@/assets/maps/HarmonyIsle/terrain.png";
import harmonyForeMap from "@/assets/maps/HarmonyIsle/foreground.png";
import Player from "@/components/Player";
import World from "@/components/World";
import { useState } from "react";

export default function Home() {
  const [worldPosX, setWorldPosX] = useState(153);
  const [worldPosY, setWorldPosY] = useState(-1117);

  const onPlayerMove = (x: number, y: number) => {
    setWorldPosX(-x)
    setWorldPosY(-y)
  }

  return (
    <World background={harmonyMap} backgroundPosition={{ x: worldPosX, y: worldPosY }} foreground={harmonyForeMap}>
      <Player onPlayerMove={onPlayerMove} />
    </World>
  );
}
