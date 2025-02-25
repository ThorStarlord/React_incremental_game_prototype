import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const ParticleEffect = ({ x, y, onComplete }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationFrame = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particleCount = 20;

    const createParticle = () => ({
      x: x,
      y: y,
      velocity: {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8 - 2
      },
      size: Math.random() * 4 + 2,
      alpha: 1,
      color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)`
    });

    // Initialize particles
    particles.current = Array.from({ length: particleCount }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let anyParticleActive = false;

      particles.current.forEach(particle => {
        if (particle.alpha <= 0) return;

        anyParticleActive = true;
        particle.velocity.y += 0.1; // gravity
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.alpha -= 0.02;

        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (!anyParticleActive) {
        cancelAnimationFrame(animationFrame.current);
        onComplete?.();
        return;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [x, y, onComplete]);

  return (
    <Box
      component="canvas"
      ref={canvasRef}
      width={400}
      height={400}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default ParticleEffect;