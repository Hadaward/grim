"use client";

import harmonyMap from "@/assets/maps/TestIsle/terrain.png";
import harmonyForeMap from "@/assets/maps/TestIsle/foreground.png";
import Player from "@/components/Player";
import World from "@/components/World";
import { useEffect, useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import globalStyle from "@/styles/global";
import Joystick from "@/components/Joystick";

import ScreenRotationIcon from '@mui/icons-material/ScreenRotation';

export default function Home() {
  const isMobilePortrait = useMediaQuery('only screen and (max-width: 480px)');
  const isMobileLandscape = useMediaQuery('only screen and (max-height: 600px)');

  const worldRef = useRef<HTMLDivElement>();

  const [joystickDirection, setJoystickDirection] = useState({ x: 0, y: 0});
  const [playerPosition, setPlayerPosition] = useState({ x: 540, y: 820 });
  const [worldPosition, setWorldPosition] = useState({ x: 0, y: 0 });
  const [worldSize, setWorldSize] = useState({ width: 0, height: 0 });
  
  const [canSetMobileOnFullscreen, setCanSetMobileOnFullscreen] = useState(false);

  useEffect(() => {
    if (worldSize.width !== 0 && worldSize.height !== 0) {
      setWorldPosition({ x: (worldSize.width / 2) - playerPosition.x, y: (worldSize.height / 2) - playerPosition.y });
    }
  }, [worldSize, playerPosition]);

  useEffect(() => {
    const onScreenUpdate = () => {
      if (!worldRef.current) {
        return;
      }

      const computed = getComputedStyle(worldRef.current);

      setWorldSize({
        width: Number(
          computed.width.match(/[0-9\.]+/)?.[0] ?? 0
        ),
        height: Number(
          computed.height.match(/[0-9\.]+/)?.[0] ?? 0
        )
      });
    }
    
    onScreenUpdate();
    addEventListener("resize", onScreenUpdate);

    return () => {
      removeEventListener("resize", onScreenUpdate);
    }
  }, []);

  useEffect(() => {
    if (isMobileLandscape && worldRef.current && document.fullscreenElement !== worldRef.current && canSetMobileOnFullscreen) {
      worldRef.current.requestFullscreen();
      setCanSetMobileOnFullscreen(false);
    }
  }, [canSetMobileOnFullscreen, isMobileLandscape]);

  if (isMobilePortrait) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", placeItems: "center", textAlign: "center", width: "100%", height: "100%", gap: 2 }}>
        <Typography component="h3" fontWeight={700}>
          Vire sua tela, é recomendado jogar no modo paisagem para uma experiência melhor.
        </Typography>
        <ScreenRotationIcon htmlColor="white" fontSize="large" />
      </Box>
    )
  }

  return (
    <World
      background={harmonyMap}
      foreground={harmonyForeMap}
      worldPosition={worldPosition}
      worldRef={worldRef}
    >
      <Player
        isMobile={isMobileLandscape}
        setPlayerPosition={setPlayerPosition}
        worldSize={worldSize}
        customAccel={isMobileLandscape ? joystickDirection : undefined}
      />
      <Box
        sx={globalStyle.uiContainer}
        onClick={() => {
          if (isMobileLandscape && !canSetMobileOnFullscreen) {
            setCanSetMobileOnFullscreen(true);
          }
        }}
      >
        {
          isMobileLandscape &&
          <Joystick radius={60} sx={{ position: "absolute", bottom: 50, left: 50 }} onAxisChange={dir => setJoystickDirection(dir)} />
        }
      </Box>
    </World>
  );
}
