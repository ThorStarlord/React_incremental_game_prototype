import { act, fireEvent, renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useMenuShortcuts } from '../pages/MainMenu/hooks/useMenuShortcuts';

describe('Beta keyboard shortcuts must not interrupt player input', () => {
  test('normal shortcuts work, but not inside inputs, textareas, or editable content', () => {
    const action = jest.fn();
    const { result } = renderHook(() => useKeyboardShortcuts());
    act(() => {
      result.current.registerShortcut({ key: 'n', action });
    });

    const input = document.createElement('input');
    const textarea = document.createElement('textarea');
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    const textbox = document.createElement('div');
    textbox.setAttribute('role', 'textbox');
    document.body.append(input, textarea, editable, textbox);

    try {
      for (const field of [input, textarea, editable, textbox]) {
        fireEvent.keyDown(field, { key: 'n' });
      }
      expect(action).not.toHaveBeenCalled();

      fireEvent.keyDown(window, { key: 'n' });
      expect(action).toHaveBeenCalledTimes(1);
    } finally {
      input.remove();
      textarea.remove();
      editable.remove();
      textbox.remove();
    }
  });

  test('dialog buttons, browser combinations, repeat and composed keys never trigger actions', () => {
    const action = jest.fn();
    const { result } = renderHook(() => useKeyboardShortcuts());
    act(() => {
      result.current.registerShortcut({ key: 'n', action });
    });

    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    const button = document.createElement('button');
    dialog.appendChild(button);
    document.body.appendChild(dialog);
    try {
      fireEvent.keyDown(button, { key: 'n' });
      fireEvent.keyDown(window, { key: 'n', metaKey: true });
      fireEvent.keyDown(window, { key: 'n', repeat: true });
      fireEvent.keyDown(window, { key: 'n', isComposing: true });

      const alreadyHandled = new KeyboardEvent('keydown', {
        key: 'n', bubbles: true, cancelable: true,
      });
      alreadyHandled.preventDefault();
      window.dispatchEvent(alreadyHandled);

      expect(action).not.toHaveBeenCalled();
    } finally {
      dialog.remove();
    }
  });

  test('main-menu actions are suspended for any open dialog and restored on close', () => {
    const handleNewGame = jest.fn();
    const handlers = {
      handleNewGame,
      handleContinue: jest.fn(),
      handleShowExport: jest.fn(),
      openLoadDialog: jest.fn(),
      openImportDialog: jest.fn(),
      openAboutDialog: jest.fn(),
    };

    const { rerender } = renderHook(
      ({ isDialogOpen }: { isDialogOpen: boolean }) => {
        const { registerShortcut } = useKeyboardShortcuts();
        useMenuShortcuts(null, { registerShortcut, ...handlers }, isDialogOpen);
      },
      { initialProps: { isDialogOpen: false } }
    );

    fireEvent.keyDown(window, { key: 'n' });
    expect(handleNewGame).toHaveBeenCalledTimes(1);

    rerender({ isDialogOpen: true });
    fireEvent.keyDown(window, { key: 'n' });
    expect(handleNewGame).toHaveBeenCalledTimes(1);

    rerender({ isDialogOpen: false });
    fireEvent.keyDown(window, { key: 'n' });
    expect(handleNewGame).toHaveBeenCalledTimes(2);
  });
});
