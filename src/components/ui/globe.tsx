"use client";

import React from "react";

const EARTH_TEXTURE =
  "url('https://cdn.21st.dev/assets/mirror/f2/f2fe23d0c6a8406962e4c5ef969e13dc9de3faf37d3e7258a1067173325b254f.jpg')";

// The texture used to scroll by animating background-position, which repaints the whole sphere
// (and its six-layer inset shadow) on every frame. Now a double-width strip slides with a
// transform (composited, no repaint) under a static shading overlay that is painted once.
const Globe: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes earthRotate {
            from { transform: translate3d(-500px, 0, 0); }
            to { transform: translate3d(0, 0, 0); }
          }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @media (prefers-reduced-motion: reduce) {
            .globe-strip, .globe-star { animation: none !important; }
          }
        `}
      </style>
      <div className="relative flex items-center justify-center w-[250px] h-[250px]">
        {/* Stars orbiting outside the globe */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="globe-star absolute left-[-20px] top-[10px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling 3s infinite" }} />
          <div className="globe-star absolute left-[-40px] top-[40px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling 2s infinite" }} />
          <div className="globe-star absolute right-[-35px] top-[90px] w-1.5 h-1.5 bg-blue-200 rounded-full" style={{ animation: "twinkling 4s infinite" }} />
          <div className="globe-star absolute left-[-25px] bottom-[30px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling 3s infinite" }} />
          <div className="globe-star absolute right-[-20px] bottom-[20px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling 1.5s infinite" }} />
          <div className="globe-star absolute left-[120px] top-[-30px] w-1.5 h-1.5 bg-white rounded-full" style={{ animation: "twinkling 4s infinite" }} />
          <div className="globe-star absolute right-[40px] top-[-25px] w-1 h-1 bg-white rounded-full" style={{ animation: "twinkling 2s infinite" }} />
        </div>

        {/* 3D Earth Globe */}
        <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden shadow-[0_0_25px_rgba(255,255,255,0.25)]">
          {/* Two 500×250 copies of the equirectangular map side by side; sliding one width loops seamlessly */}
          <div
            className="globe-strip absolute left-0 top-0 h-full w-[1000px] will-change-transform"
            style={{
              backgroundImage: EARTH_TEXTURE,
              backgroundSize: "500px 250px",
              backgroundRepeat: "repeat-x",
              animation: "earthRotate 37.5s linear infinite",
            }}
          />
          {/* Static shading, painted once above the moving texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full shadow-[-5px_0_8px_#c3f4ff_inset,15px_2px_25px_#000_inset,-24px_-2px_34px_#c3f4ff99_inset,250px_0_44px_#00000066_inset,150px_0_38px_#000000aa_inset]"
          />
        </div>
      </div>
    </>
  );
};

export default Globe;
