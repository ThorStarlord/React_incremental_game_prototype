import fs from 'fs';
import path from 'path';

describe('GC-02 Prologue / onboarding vertical path', () => {
  test('production wiring exposes a normal-UI prologue objective before routed game content', () => {
    const gameLayoutSource = fs.readFileSync(
      path.join(process.cwd(), 'src/layout/components/GameLayout.tsx'),
      'utf8'
    );

    expect(gameLayoutSource).toContain('PrologueObjectivePanel');
    expect(gameLayoutSource.indexOf('<PrologueObjectivePanel')).toBeGreaterThanOrEqual(0);
    expect(gameLayoutSource.indexOf('<PrologueObjectivePanel')).toBeLessThan(
      gameLayoutSource.indexOf('<Outlet />')
    );
  });

  test('New Game remains ordinary UI and does not route through developer/debug setup', () => {
    const newGameSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/MainMenu/hooks/useGameActions.ts'),
      'utf8'
    );

    expect(newGameSource).toContain('newGameSeedNPCsThunk');
    expect(newGameSource).toContain("navigate('/game/npcs')");
    expect(newGameSource).not.toContain("navigate('/game/debug')");
  });
});
