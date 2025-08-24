import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';
import React from 'react';

describe('Modal', () => {
  const handleClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not be in the document when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should be in the document when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should call onClose when the close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking outside the modal', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.mouseDown(document.body);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should trap focus inside the modal', () => {
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <button>Focusable 1</button>
        <button>Focusable 2</button>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    const firstFocusable = screen.getByText('Focusable 1');

    // Initially focus is on the close button
    expect(document.activeElement).toBe(closeButton);

    // Tab to the next element
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).not.toBe(firstFocusable);
  });

  it('should return focus to the previously focused element on close', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    const { rerender } = render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(document.activeElement).not.toBe(button);

    rerender(
      <Modal isOpen={false} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(document.activeElement).toBe(button);
    document.body.removeChild(button);
  });
});
