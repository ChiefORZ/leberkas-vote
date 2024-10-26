import type React from 'react';

function Overlay({ children }: { children?: React.ReactNode }) {
  return (
    <div className="z-100 absolute bottom-0 left-0 right-0 top-0 bg-white/30 p-16 text-center backdrop-blur-[2px]">
      {children}
    </div>
  );
}

export default Overlay;
