import React from 'react';
import { Box } from '@mui/material';

/**
 * Decorative, offline-safe explorer-journal vignette.
 * It depicts only canonical named stops and never asserts NPC position,
 * encounter availability, or a new travel connection.
 */
export const LocationVignette: React.FC<{ locationName: string }> = React.memo(({ locationName }) => {
  const scene = locationName === 'City Center'
    ? 'city'
    : locationName === 'City Gate'
      ? 'gate'
      : locationName === 'Whispering Woods'
        ? 'woods'
        : null;

  if (!scene) return null;

  return (
    <Box data-testid="location-vignette" aria-hidden="true" sx={{
      flex: '0 0 auto', width: { xs: '100%', md: 224 },
      height: { xs: 86, md: 150 }, overflow: 'hidden',
      borderRadius: 2, border: '1px solid', borderColor: 'divider',
      boxShadow: 'inset 0 0 16px rgba(17, 41, 44, 0.08)',
    }}>
      <svg viewBox="0 0 280 160" width="100%" height="100%"
        preserveAspectRatio="xMidYMid slice" focusable="false" aria-hidden="true">
        <rect width="280" height="160" fill={scene === 'woods' ? '#204c4b' : '#426b74'} />
        <circle cx="215" cy="45" r="32" fill="#e7c68e" opacity=".92" />
        <path d="M0 96 Q78 53 139 88 T280 78 V160 H0Z" fill="#6c8e80" opacity=".75" />
        {scene === 'woods' ? (
          <g>
            <path d="M0 130 Q105 104 170 133 T280 111 V160 H0Z" fill="#a6a57f" />
            {[20, 65, 113, 164, 215, 262].map((x, i) => (
              <g key={x}>
                <path d={'M' + x + ' 162V' + (72 + (i % 3) * 13)} stroke="#293f37" strokeWidth="10" />
                <circle cx={x} cy={64 + (i % 3) * 13} r={30 - (i % 2) * 5}
                  fill={i % 2 ? '#3c6860' : '#315b50'} />
                <circle cx={x - 11} cy={62 + (i % 3) * 13} r="13" fill="#62927d" opacity=".65" />
              </g>
            ))}
            <path d="M116 160 Q133 140 143 130 Q152 119 164 117"
              fill="none" stroke="#dbb98d" strokeWidth="18" opacity=".85" />
          </g>
        ) : scene === 'city' ? (
          <g>
            <path d="M0 127 L0 70 L38 57 L55 68 L55 120 L78 113 L78 46 L111 25 L141 47 L141 120 L163 109 L163 62 L195 42 L218 59 L218 116 L242 93 L280 80 V160 H0Z" fill="#2d5057" />
            <path d="M0 134 H280 V160 H0Z" fill="#af9b81" />
            {[21, 51, 94, 121, 176, 207, 252].map(x =>
              <rect key={x} x={x} y="87" width="11" height="15" rx="2" fill="#efd0a0" opacity=".8" />)}
            <path d="M105 160 V103 Q105 79 120 79 Q135 79 135 103 V160" fill="#d2b590" />
            <path d="M0 154 Q120 134 280 148" stroke="#f0d4af"
              fill="none" strokeWidth="3" opacity=".5" />
          </g>
        ) : (
          <g>
            <path d="M0 128 H280 V160 H0Z" fill="#ac987a" />
            <rect x="72" y="69" width="27" height="83" rx="4" fill="#304f50" />
            <rect x="184" y="69" width="27" height="83" rx="4" fill="#304f50" />
            <path d="M70 71 Q140 12 213 71" stroke="#304f50" fill="none" strokeWidth="20" />
            <path d="M118 160 L131 105 L148 105 L167 160Z" fill="#dfc5a3" />
            <path d="M96 96 H190" stroke="#d2aa76" strokeWidth="5" />
          </g>
        )}
      </svg>
    </Box>
  );
});
LocationVignette.displayName = 'LocationVignette';
