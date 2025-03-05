import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { Engine } from 'tsparticles-engine';

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
  duration?: number;
  useGravity?: boolean;
  customOptions?: Record<string, any>;
}

/**
 * Interface for color schemes by effect type
 */
interface ColorSchemes {
  [key: string]: string[];
}

/**
 * Interface for particle configuration options
 */
interface ParticleConfig {
  fullScreen: boolean;
  fpsLimit: number;
  particles: {
    number: {
      value: number;
      density: {
        enable: boolean;
      };
    };
    color: {
      value: string[];
    };
    opacity: {
      value: number;
      animation: {
        enable: boolean;
        speed: number;
        minimumValue: number;
        destroy: string;
      };
    };
    size: {
      value: { min: number; max: number };
      animation: {
        enable: boolean;
        speed: number;
        minimumValue: number;
        destroy: string;
        sync: boolean;
      };
    };
    move: {
      enable: boolean;
      speed: number | { min: number; max: number };
      direction: string;
      random: boolean;
      straight: boolean;
      outMode: string;
      gravity: {
        enable: boolean;
        acceleration: number;
      };
    };
    shape?: {
      type: string | string[];
    };
    rotate?: {
      value: { min: number; max: number };
      animation: {
        enable: boolean;
        speed: number;
      };
    };
    tilt?: {
      enable: boolean;
      value: { min: number; max: number };
      animation: {
        enable: boolean;
        speed: number;
      };
    };
    life?: {
      duration: number | { min: number; max: number };
    };
  };
  detectRetina: boolean;
  emitters: {
    direction: string;
    life: {
      count: number;
      duration: number;
      delay: number;
    };
    rate: {
      delay: number;
      quantity: number;
    };
    size: {
      width: number;
      height: number;
    };
    position: {
      x: number;
      y: number;
    };
    startCount?: number;
  };
  [key: string]: any;
}

/**
 * Type for particle effect type-specific configurations
 */
interface TypeConfigs {
  [key: string]: {
    particles: Partial<ParticleConfig['particles']>;
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
const ParticleEffect: React.FC<ParticleEffectProps> = ({ 
  x, 
  y, 
  onComplete, 
  type = "explosion",
  colors,
  particleCount = 30,
  duration = 1500,
  useGravity = true,
  customOptions = null
}): JSX.Element | null => {
  const [effectId] = useState<string>(`particle-effect-${Math.random().toString(36).substr(2, 9)}`);
  const [isActive, setIsActive] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Default color schemes for different effect types
  const colorSchemes: ColorSchemes = {
    explosion: ["#ff7b00", "#ffd000", "#ff0000"],
    sparkle: ["#38eaff", "#00ffa3", "#ffffff"],
    confetti: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"],
    smoke: ["#ffffff", "#eeeeee", "#dddddd"]
  };
  
  // Use provided colors or default to type-based color scheme
  const effectColors = colors || colorSchemes[type] || colorSchemes.explosion;
  
  /**
   * Configure particle effect presets based on type
   * @returns {ParticleConfig} tsParticles configuration object
   */
  const getParticleConfig = (): ParticleConfig => {
    // Base configuration all effects share
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
            speed: 1,
            minimumValue: 0,
            destroy: "min"
          }
        },
        size: {
          value: { min: 2, max: 6 },
          animation: {
            enable: true,
            speed: 5,
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
            acceleration: 0.5
          }
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
    
    // Type-specific configurations
    const typeConfigs: TypeConfigs = {
      explosion: {
        particles: {
          shape: {
            type: "circle"
          },
          life: {
            duration: { min: 0.5, max: 1 } as any * (duration / 1000)
          },
          move: {
            speed: { min: 5, max: 15 }
          }
        },
        emitters: {
          startCount: particleCount
        }
      },
      sparkle: {
        particles: {
          shape: {
            type: "star"
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: {
              enable: true,
              speed: 20
            }
          },
          life: {
            duration: { min: 0.8, max: 1.5 } as any * (duration / 1000)
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
          shape: {
            type: ["square", "circle", "triangle"]
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: {
              enable: true,
              speed: 30
            }
          },
          tilt: {
            enable: true,
            value: { min: 0, max: 360 },
            animation: {
              enable: true,
              speed: 30
            }
          },
          life: {
            duration: { min: 1, max: 2 } as any * (duration / 1000)
          },
          move: {
            speed: { min: 3, max: 10 }
          }
        }
      },
      smoke: {
        particles: {
          shape: {
            type: "circle"
          },
          size: {
            value: { min: 5, max: 15 }
          },
          opacity: {
            value: 0.6,
            animation: {
              speed: 0.5
            }
          },
          life: {
            duration: { min: 1.5, max: 2.5 } as any * (duration / 1000)
          },
          move: {
            speed: { min: 2, max: 4 },
            direction: "top",
            gravity: {
              enable: false
            },
            outMode: "out"
          }
        }
      }
    };
    
    // Merge base configuration with type-specific configuration
    const mergedConfig: ParticleConfig = {
      ...baseConfig,
      particles: {
        ...baseConfig.particles,
        ...(typeConfigs[type]?.particles || {})
      },
      emitters: {
        ...baseConfig.emitters,
        ...(typeConfigs[type]?.emitters || {})
      }
    };
    
    // Apply custom options if provided
    if (customOptions) {
      return {
        ...mergedConfig,
        ...customOptions,
        particles: {
          ...mergedConfig.particles,
          ...(customOptions.particles || {})
        },
        emitters: {
          ...mergedConfig.emitters,
          ...(customOptions.emitters || {})
        }
      };
    }
    
    return mergedConfig;
  };

  /**
   * Initialize the particle effect
   * @param {Engine} main - The main tsParticles instance
   */
  const particlesInit = async (main: Engine): Promise<void> => {
    await loadFull(main);
  };
  
  /**
   * Position the container at the specified coordinates and
   * set a timer to clean up the effect
   */
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.left = `${x - 200}px`;
      containerRef.current.style.top = `${y - 200}px`;
    }
    
    // Set timer to clean up the effect
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
