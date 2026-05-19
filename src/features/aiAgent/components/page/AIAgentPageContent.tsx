'use client';

import { ChatComposer } from '@/features/aiAgent/components/widgets/ChatComposer';
import { ChatEmptyState } from '@/features/aiAgent/components/widgets/ChatEmptyState';
import { ChatHistorySidebar } from '@/features/aiAgent/components/widgets/ChatHistorySidebar';
import { ChatMessageList } from '@/features/aiAgent/components/widgets/ChatMessageList';
import { RobotIcon } from '@/features/aiAgent/components/ui/RobotIcon';
import { useAIAgentPage } from '@/features/aiAgent/hooks/useAiAgentPage';

export function AIAgentPageContent() {
  const page = useAIAgentPage();

  return (
    <div className="-m-8 flex h-[calc(100vh-95px)] overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <ChatHistorySidebar
        activeConversationId={page.threadId}
        conversations={page.conversations}
        isLoading={page.isHistoryLoading}
        onSelectConversation={(conversationId) => {
          void page.loadConversation(conversationId);
        }}
        onToggle={page.toggleHistory}
        showHistory={page.showHistory}
      />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/70 px-8 py-4 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <RobotIcon size="md" />
              </div>
              <div>
                <h2 className="font-semibold tracking-tight text-slate-800">
                  ContractAI Bot
                </h2>
                <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  En linea
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={page.startNewConversation}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva conversacion
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          {page.isConversationLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                Cargando conversación...
              </div>
            </div>
          ) : page.messages.length === 0 ? (
            <ChatEmptyState onSuggestionSelect={page.handleSuggestionSelect} />
          ) : (
            <ChatMessageList
              bottomRef={page.messagesEndRef}
              isLoading={page.isLoading}
              messages={page.messages}
            />
          )}
        </div>

        <form onSubmit={page.handleFormSubmit}>
          <ChatComposer
            inputValue={page.inputValue}
            isLoading={page.isLoading}
            onChange={page.handleInputChange}
            onContainerClick={() => page.textareaRef.current?.focus()}
            onKeyDown={page.handleComposerKeyDown}
            onSubmit={page.handleComposerSubmit}
            textareaRef={page.textareaRef}
          />
        </form>
      </div>
    </div>
  );
}
