import React from "react";
import Modal from "./Modal";
import { Chat } from "../../types/chat";

interface ChatPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  chat: Chat | null;
}

const ChatPreviewModal: React.FC<ChatPreviewModalProps> = ({
  open,
  onClose,
  onContinue,
  chat,
}) => {
  return (
    <Modal
      open={open}
      title="Chat History"
      onClose={onClose}
      onContinue={onContinue}
    >
      {chat?.messages?.length ? (
        <div className="space-y-3">
          {chat.messages.map((m, i) => (
            <div key={i} className="text-sm">
              <div className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">{m.role}</div>
              <div className="whitespace-pre-wrap break-words bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-800">
                {m.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-600">No messages to display.</div>
      )}
    </Modal>
  );
};

export default ChatPreviewModal;
