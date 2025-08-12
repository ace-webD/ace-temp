"use client";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function HeroWithConfetti() {
  useEffect(() => {
    confetti({
      particleCount: 600,
      spread: 300,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <>
      
    </>
  );
}
