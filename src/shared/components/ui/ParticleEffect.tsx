import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
// --- Suggestion for TS2307/TS2322 ---
// Ensure you have installed the necessary packages:
// npm install react-tsparticles tsparticles @tsparticles/engine
// or: npm install @tsparticles/react tsparticles @tsparticles/engine
// If using @tsparticles/react, change the import below:
// import Particles, { initParticlesEngine } from "@tsparticles/react";
import Particles from 'react-tsparticles'; // Keep this if using react-tsparticles
import { loadFull } from 'tsparticles';
// Try importing Engine type from the react-tsparticles package itself or @tsparticles/engine
// If using @tsparticles/react, Engine might come from @tsparticles/engine
import type { Engine } from "@tsparticles/engine";

/**
 * Types of particle effects that can be rendered
 */
type EffectType = 'explosion' | 'sparkle' | 'confetti' | 'smoke';

/**
 * Interface for ParticleEffect component props
 */
interface ParticleEffectProps {
  x: number;
  y: number;
  onComplete?: () => void;
  type?: EffectType;
  colors?: string[];
  particleCount?: number;
  duration?: number; // Duration in milliseconds
  useGravity?: boolean;
  customOptions?: Record<string, any>; // Allow deep partial override
}

/**
 * Interface for color schemes by effect type
 */
interface ColorSchemes {
  [key: string]: string[];
}

/**
 * Interface for particle configuration options (simplified for clarity, tsParticles types are complex)
 */
interface ParticleConfig {
  fullScreen?: boolean;
  fpsLimit?: number;
  particles?: any; // Use 'any' for simplicity or import specific types from tsparticles
  detectRetina?: boolean;
  emitters?: any; // Use 'any' for simplicity
  [key: string]: any;
}

/**
 * Type for particle effect type-specific configurations
 */
interface TypeConfigs {
  [key: string]: {
    particles?: Partial<ParticleConfig['particles']>;
    emitters?: Partial<ParticleConfig['emitters']>;
  };
}

/**
 * @component ParticleEffect
 * @description A customizable particle effect component that renders animated particles
 * at specified coordinates using the tsParticles library. Supports various effect types,
 * colors, and behaviors.
 * 
 * Features:
 * - Multiple preset effects (explosion, sparkle, confetti, smoke)
 * - Custom positioning with x,y coordinates
 * - Auto-completion with callback
 * - Color customization
 * - Adjustable particle count and duration
 * - Performance optimizations
 * 
 * @example
 * // Basic explosion effect at cursor position
 * <ParticleEffect 
 *   x={mouseX} 
 *   y={mouseY} 
 *   onComplete={() => console.log("Effect complete")} 
 * />
 * 
 * @example
 * // Custom confetti effect with specific colors
 * <ParticleEffect 
 *   x={window.innerWidth / 2}
 *   y={window.innerHeight / 2}
 *   type="confetti"
 *   colors={["#ff0000", "#00ff00", "#0000ff"]}
 *   particleCount={100}
 *   duration={2000}
 * />
 * 
 * @param {ParticleEffectProps} props - Component props
 * @returns {JSX.Element | null} The particle effect component or null if inactive
 */
// Remove explicit return type annotation
const ParticleEffect: React.FC<ParticleEffectProps> = ({ 
  x, 
  y, 
  onComplete, 
  type = "explosion",
  colors,
  particleCount = 30,
  duration = 1500, // Default duration in ms
  useGravity = true,
  customOptions = null
}) => {
  const [effectId] = useState<string>(`particle-effect-${Math.random().toString(36).substr(2, 9)}`);
  const [isActive, setIsActive] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const colorSchemes: ColorSchemes = {
    explosion: ["#ff7b00", "#ffd000", "#ff0000"],
    sparkle: ["#38eaff", "#00ffa3", "#ffffff"],
    confetti: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    smoke: ["#ffffff", "#eeeeee", "#dddddd"]
  };
  const effectColors = colors || colorSchemes[type] || colorSchemes.explosion;

  /**
   * Configure particle effect presets based on type
   * @returns {ParticleConfig} tsParticles configuration object
   */
  const getParticleConfig = (): ParticleConfig => {
    const durationSeconds = duration / 1000; // Convert duration to seconds for particle life

    const baseConfig: ParticleConfig = {
      fullScreen: false,
      fpsLimit: 120,
      particles: {
        number: {
          value: particleCount,
          density: {
            enable: false
          }
        },
        color: {
          value: effectColors
        },
        opacity: {
          value: 1,
          animation: {
            enable: true,
            speed: 1 / durationSeconds,
            minimumValue: 0,
            destroy: "min"
          }
        },
        size: {
          value: { min: 2, max: 6 },
          animation: {
            enable: true,
            speed: 5 / durationSeconds,
            minimumValue: 0.1,
            destroy: "min",
            sync: false
          }
        },
        move: {
          enable: true,
          speed: 10,
          direction: "none",
          random: true,
          straight: false,
          outMode: "destroy",
          gravity: {
            enable: useGravity,
            acceleration: 9.81
          }
        },
        life: {
          duration: { min: durationSeconds * 0.5, max: durationSeconds }
        }
      },
      detectRetina: true,
      emitters: {
        direction: "none",
        life: {
          count: 1,
          duration: 0.1,
          delay: 0
        },
        rate: {
          delay: 0,
          quantity: particleCount
        },
        size: {
          width: 0,
          height: 0
        },
        position: {
          x: 50,
          y: 50
        }
      }
    };
    
    const typeConfigs: TypeConfigs = {
      explosion: {
        particles: {
          shape: { type: "circle" },
          move: {
            speed: { min: 5, max: 15 }
          }
        }
      },
      sparkle: {
        particles: {
          shape: { type: "star" },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 20 }
          },
          move: {
            speed: { min: 2, max: 6 },
            gravity: {
              enable: useGravity,
              acceleration: 0.2
            }
          }
        }
      },
      confetti: {
        particles: {
          shape: { type: ["square", "circle", "triangle"] },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 30 }
          },
          tilt: {
            enable: true,
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 30 }
          },
          move: {
            speed: { min: 3, max: 10 },
            gravity: { enable: useGravity, acceleration: 0.3 }
          }
        }
      },
      smoke: {
        particles: {
          shape: { type: "circle" },
          size: {
            value: { min: 5, max: 15 }
          },
          opacity: {
            value: 0.6,
            animation: {
              speed: 0.5 / durationSeconds
            }
          },
          move: {
            speed: { min: 2, max: 4 },
            direction: "top",
            gravity: { enable: false },
            outMode: "out"
          }
        }
      }
    };
    
    const deepMerge = (target: any, source: any): any => {
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
            deepMerge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
      return target;
    };

    let mergedConfig = JSON.parse(JSON.stringify(baseConfig));

    const typeConfig = typeConfigs[type];
    if (typeConfig) {
      mergedConfig = deepMerge(mergedConfig, typeConfig);
    }

    if (customOptions) {
      mergedConfig = deepMerge(mergedConfig, customOptions);
    }
    
    return mergedConfig;
  };

  /**
   * Initialize the particle effect
   * @param {any} main - The main tsParticles instance. Using 'any' to bypass type conflict.
   */
  const particlesInit = async (main: any): Promise<void> => {
    await loadFull(main);
  };
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.left = `${x - 200}px`; 
      containerRef.current.style.top = `${y - 200}px`;
    }
    
    timerRef.current = setTimeout(() => {
      setIsActive(false);
      onComplete?.();
    }, duration);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [x, y, duration, onComplete]);

  if (!isActive) {
    return null;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'fixed',
        width: '400px',
        height: '400px',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      <Particles
        id={effectId}
        init={particlesInit}
        options={getParticleConfig()}
      />
    </Box>
  );
};

export default ParticleEffect;
