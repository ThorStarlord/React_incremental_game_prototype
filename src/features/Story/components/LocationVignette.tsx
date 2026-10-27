import React from 'react';
import { Box } from '@mui/material';
import type { RegionalWorldState } from '../../WorldState/state/WorldStateTypes';

/**
 * Decorative, offline-safe explorer-journal vignette.
 * It depicts only canonical named stops and never asserts NPC position,
 * encounter availability, or a new travel connection.
 */
interface LocationVignetteProps {
  locationName: string;
  districtConditions?: Pick<RegionalWorldState, 'watchPresence' | 'tradeFlow'> | null;
}

export const LocationVignette: React.FC<LocationVignetteProps> = React.memo(({ locationName, districtConditions }) => {
  const scene = locationName === 'City Center'
    ? 'city'
    : locationName === 'City Gate'
      ? 'gate'
      : locationName === 'Whispering Woods'
        ? 'woods'
        : locationName === 'Merchant District'
          ? 'market'
          : null;

  if (!scene) return null;

  return (
    <Box data-test-id="location-vignette" data-testid="location-vignette" aria-hidden="true" sx={{
      flex: '0 0 auto', width: { xs: '100%', md: 224 },
      height: { xs: 86, md: 150 }, overflow: 'hidden',
      borderRadius: 2, border: '1px solid', borderColor: 'divider',
      boxShadow: 'inset 0 0 16px rgba(17, 41, 44, 0.08)',
    }}>
      <svg viewBox="0 0 280 160" width="100%" height="100%"
        preserveAspectRatio="xMidYMid slice" focusable="false" aria-hidden="true">
        <rect width="280" height="160" fill={scene === 'woods' ? '#204c4b' : scene === 'market' ? '#6a746a' : '#426b74'} />
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
        ) : scene === 'market' ? (
          <g>
            <path d="M0 110 L24 90 L50 110 V145 H0Z M42 110 L84 65 L121 110 V150 H42Z M129 109 L178 72 L220 111 V150 H129Z M205 114 L251 84 L280 108 V150 H205Z" fill="#344f54" />
            <path d="M0 142 Q135 123 280 142 V160 H0Z" fill="#b9a58b" />
            <path d="M16 111 H78 L68 128 H20Z M106 117 H178 L170 134 H114Z M203 117 H265 L257 133 H211Z" fill={districtConditions?.tradeFlow === 'strong' ? '#cf935e' : '#998b79'} />
            <path d="M31 128 V160 M64 126 V160 M117 131 V160 M169 131 V160 M215 131 V160 M257 131 V160" stroke="#5c5349" strokeWidth="3" />
            {districtConditions?.tradeFlow === 'strong' && (
              <g fill="#f2c88b"><rect x="28" y="143" width="18" height="7" rx="2" /><rect x="123" y="145" width="27" height="6" rx="2" /><rect x="217" y="143" width="21" height="7" rx="2" /></g>
            )}
            {districtConditions?.watchPresence === 'heavy' && (
              <g><path d="M90 48 V127 M188 49 V126" stroke="#dfbd85" strokeWidth="5" /><path d="M94 48 L124 58 L94 68Z M192 49 L221 59 L192 69Z" fill="#e5c38d" /></g>
            )}
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
