import React from 'react';
import fs from 'fs';
import path from 'path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ExportDialog } from './dialogs/ExportDialog';
import { DeleteConfirmationDialog } from './dialogs/DeleteConfirmationDialog';
import { MainMenuButtonList } from './components/MainMenuButtonList';
import { LoadGameDialog } from './dialogs/LoadGameDialog';

/**
 * Release regression (KD-015): the main menu and its save dialogs used
 * Tailwind classes although Tailwind is not installed, so they rendered as
 * unstyled HTML and the Export dialog could not be closed by mouse.
 */

const noop = () => undefined;

describe('main menu presentation', () => {
  test('Export is a named modal dialog that can be closed', () => {
    const onClose = jest.fn();
    render(<ExportDialog isOpen exportCode="abc123" onClose={onClose} onCopyToClipboard={noop} />);

    const dialog = screen.getByRole('dialog', { name: 'Export Save' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /copy this code/i })).toHaveValue('abc123');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close export dialog' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('Export waits for clipboard success before claiming Copied', async () => {
    let completeCopy: () => void = () => undefined;
    const onCopy = jest.fn(() => new Promise<void>(resolve => {
      completeCopy = resolve;
    }));
    render(<ExportDialog isOpen exportCode="abc123" onClose={noop} onCopyToClipboard={onCopy} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Copying...' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
    await act(async () => { completeCopy(); });
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  test('Export reports failed clipboard writes and allows manual copying', async () => {
    const onCopy = jest.fn(() => Promise.reject(new Error('Clipboard blocked')));
    render(<ExportDialog isOpen exportCode="abc123" onClose={noop} onCopyToClipboard={onCopy} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not copy automatically. Select and copy the save code manually.'
    );
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /copy this code/i })).toHaveValue('abc123');
  });

  test('Delete confirmation is a named modal dialog', () => {
    const onConfirm = jest.fn();
    render(<DeleteConfirmationDialog isOpen saveName="Run A" isLoading={false} onConfirm={onConfirm} onCancel={noop} />);

    expect(screen.getByRole('dialog', { name: 'Delete Save' })).toHaveTextContent('"Run A"');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('menu actions are buttons with their visible names', () => {
    render(
      <MainMenuButtonList
        mostRecentSave={null}
        isLoading={false}
        onNewGame={noop}
        onContinue={noop}
        onLoadGame={noop}
        onImport={noop}
        onExport={noop}
        onAbout={noop}
      />
    );

    for (const name of ['New Game', 'Load Game', 'Import', 'About']) {
      expect(screen.getByRole('button', { name })).toBeEnabled();
    }
    expect(screen.getByRole('button', { name: 'Continue (No Saves)' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Export' })).toBeDisabled();
  });

  test('Load Game displays readable autosave names while loading the unchanged ID', () => {
    const onLoad = jest.fn();
    render(<LoadGameDialog isOpen savedGames={[{
      id: 'save_abc', name: 'Autosave_exit_1792842045257', timestamp: 1792842045257,
      playerLevel: 1, playtime: 0,
    }]} isLoading={false} onLoad={onLoad} onDelete={noop} onClose={noop} />);
    expect(screen.getByText('Exit autosave')).toBeInTheDocument();
    expect(screen.queryByText('Autosave_exit_1792842045257')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Exit autosave'));
    expect(onLoad).toHaveBeenCalledWith('save_abc');
  });

  test('main menu sources do not depend on Tailwind utility classes', () => {
    const tailwindUtility = /className="[^"]*\b(bg-(white|gray|blue|red|green|purple|indigo)|text-(gray|white|sm|2xl)|px-\d|rounded-lg|space-[xy]-\d|fixed inset-0)\b/;
    const directory = path.join(process.cwd(), 'src/pages/MainMenu');
    const sources = ['components', 'dialogs'].flatMap(folder =>
      fs.readdirSync(path.join(directory, folder))
        .filter(file => file.endsWith('.tsx'))
        .map(file => path.join(directory, folder, file))
    );
    for (const file of sources) {
      expect([file, tailwindUtility.test(fs.readFileSync(file, 'utf8'))]).toEqual([file, false]);
    }
  });
});
