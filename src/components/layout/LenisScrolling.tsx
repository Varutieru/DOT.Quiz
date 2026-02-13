"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap } from "@/components/lib/gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LenisScrolling({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef | null>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    // Sync Lenis scroll with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}