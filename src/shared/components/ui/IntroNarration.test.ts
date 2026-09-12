import { DEFAULT_INTRO_LINES } from './IntroNarration';

describe('new-game onboarding copy', () => {
  it('gives the player a concrete first action and explains remembered consequence', () => {
    const copy = DEFAULT_INTRO_LINES.join(' ');

    expect(DEFAULT_INTRO_LINES.length).toBeGreaterThanOrEqual(3);
    expect(copy).toMatch(/Elder Willow/i);
    expect(copy).toMatch(/Speak with her first/i);
    expect(copy).toMatch(/choice.*behind|leaves behind/i);
  });
});
