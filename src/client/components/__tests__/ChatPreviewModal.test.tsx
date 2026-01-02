import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChatPreviewModal from '../ChatPreviewModal';

describe('ChatPreviewModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onContinue: vi.fn(),
    chat: {
      id: '1',
      messages: [
        { role: 'user' as const, content: 'User message' },
        { role: 'assistant' as const, content: 'Assistant message' },
      ],
    },
  };

  it('renders correctly when open', () => {
    render(<ChatPreviewModal {...defaultProps} />);
    expect(screen.getByText('Chat History')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('User message')).toBeInTheDocument();
    expect(screen.getByText('assistant')).toBeInTheDocument();
    expect(screen.getByText('Assistant message')).toBeInTheDocument();
  });

  it('renders "No messages" when chat has no messages', () => {
    render(<ChatPreviewModal {...defaultProps} chat={{ id: '1', messages: [] }} />);
    expect(screen.getByText('No messages to display.')).toBeInTheDocument();
  });

  it('renders "No messages" when chat is null', () => {
    render(<ChatPreviewModal {...defaultProps} chat={null} />);
    expect(screen.getByText('No messages to display.')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ChatPreviewModal {...defaultProps} />);
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onContinue when continue button is clicked', () => {
    render(<ChatPreviewModal {...defaultProps} />);
    const continueButton = screen.getByText('Continue Chat');
    fireEvent.click(continueButton);
    expect(defaultProps.onContinue).toHaveBeenCalled();
  });
});
