"use client";

import harmonyMap from "@/assets/maps/HarmonyIsle/terrain.png";
import harmonyForeMap from "@/assets/maps/HarmonyIsle/foreground.png";
import Player from "@/components/Player";
import World from "@/components/World";
import { useEffect, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import common from "@/styles/common";
import Joystick from "@/components/Joystick";

export default function Home() {
  const worldRef = useRef<HTMLDivElement>();

  const [worldWidth, setWorldWidth] = useState(0);
  const [worldHeight, setWorldHeight] = useState(0);
  const [worldPosX, setWorldPosX] = useState(0);
  const [worldPosY, setWorldPosY] = useState(0);

  const [playerPosX, setPlayerPosX] = useState(540);
  const [playerPosY, setPlayerPosY] = useState(820);

  const isMobilePlayer = useMediaQuery('only screen and (max-height: 600px)');
  const [joystickDirection, setJoystickDirection] = useState({ x: 0, y: 0});

  useEffect(() => {
    setWorldPosX((worldWidth / 2) - playerPosX);
    setWorldPosY((worldHeight / 2) - playerPosY);
  }, [playerPosX, playerPosY, worldHeight, worldWidth]);

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

  return (
    <World background={harmonyMap} backgroundPosition={{ x: worldPosX, y: worldPosY }} foreground={harmonyForeMap} worldRef={worldRef}>
      <Player setPositionX={setPlayerPosX} setPositionY={setPlayerPosY} worldWidth={worldWidth} worldHeight={worldHeight} customAccel={isMobilePlayer ? joystickDirection : undefined}/>
      <Box sx={common.uiContainer}>
        {
          isMobilePlayer &&
          <Joystick radius={60} sx={{ position: "absolute", bottom: 30, left: 30 }} onAxisChange={dir => setJoystickDirection(dir)} />
        }
      </Box>
    </World>
  );
}
