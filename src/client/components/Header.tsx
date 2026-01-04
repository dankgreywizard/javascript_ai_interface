import React from "react";
import Button from "./Button";
import Status from "./Status";

interface HeaderProps {
  currentTab: "chat" | "git";
  setCurrentTab: (tab: "chat" | "git") => void;
  status: { color: "gray" | "yellow" | "green" | "red"; text: string };
  onNewChat: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  status,
  onNewChat,
  onToggleSidebar,
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Git Review Assistant</h1>
            <p className="text-sm text-gray-500">powered by dankgreywizard</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {currentTab === 'chat' && (
            <>
              <Button variant="primary" onClick={onNewChat}>
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>New Chat</span>
                </span>
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar} title="Toggle chat history">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </>
          )}
          <Status color={status.color} text={status.text} />
          {/* Tabs */}
          <nav className="hidden md:flex items-center space-x-2" role="tablist" aria-label="Main tabs">
            <button
              role="tab"
              aria-selected={currentTab === 'chat'}
              className={`px-3 py-1.5 text-sm rounded-lg border ${currentTab === 'chat' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setCurrentTab('chat')}
            >
              Chat
            </button>
            <button
              role="tab"
              aria-selected={currentTab === 'git'}
              className={`px-3 py-1.5 text-sm rounded-lg border ${currentTab === 'git' ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
              onClick={() => setCurrentTab('git')}
            >
              Git
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
