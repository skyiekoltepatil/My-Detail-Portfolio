import { useEffect } from 'react';
import fluidCursor from '../hooks/use-FluidCursor';

const FluidCursor = () => {
  useEffect(() => {
    const destroy = fluidCursor();
    return () => {
      if (destroy) destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <canvas id="fluid" className="w-full h-full" />
    </div>
  );
};
export default FluidCursor;
