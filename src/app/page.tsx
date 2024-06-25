"use client";

import harmonyMap from "@/assets/maps/HarmonyIsle/terrain.png";
import harmonyForeMap from "@/assets/maps/HarmonyIsle/foreground.png";
import Player from "@/components/Player";
import World from "@/components/World";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const worldRef = useRef<HTMLDivElement>();
  const [worldWidth, setWorldWidth] = useState(0);
  const [worldHeight, setWorldHeight] = useState(0);
  const [worldPosX, setWorldPosX] = useState(153);
  const [worldPosY, setWorldPosY] = useState(-1117);

  useEffect(() => {
    const onScreenUpdate = () => {
      if (!worldRef.current) {
        return;
      }

      const computed = getComputedStyle(worldRef.current);

      setWorldWidth(Number(computed.width.match(/[0-9\.]+/)?.[0]??0));
      setWorldHeight(Number(computed.height.match(/[0-9\.]+/)?.[0]??0));
    }
    
    onScreenUpdate();
    addEventListener("resize", onScreenUpdate);
    return () => {
      removeEventListener("resize", onScreenUpdate);
    }
  }, []);

  const onPlayerMove = (x: number, y: number) => {
    setWorldPosX(-x)
    setWorldPosY(-y)
  }

  return (
    <World background={harmonyMap} backgroundPosition={{ x: worldPosX, y: worldPosY }} foreground={harmonyForeMap} worldRef={worldRef}>
      <Player onPlayerMove={onPlayerMove} worldWidth={worldWidth} worldHeight={worldHeight} />
    </World>
  );
}
