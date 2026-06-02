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
    <div className="flex h-full flex-col">
      <div className="flex h-full gap-4">
        <ChatHistorySidebar
          onNewConversation={page.startNewConversation}
          activeConversationId={page.threadId}
          conversations={page.conversations}
          isLoading={page.isHistoryLoading}
          onSelectConversation={(conversationId) => {
            void page.loadConversation(conversationId);
          }}
          onToggle={page.toggleHistory}
          showHistory={page.showHistory}
          onUpdateConversation={page.handleUpdateConversation}
          onDeleteConversation={page.handleDeleteConversation}
        />

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            {page.isConversationLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                  Cargando conversación...
                </div>
              </div>
            ) : page.messages.length === 0 ? (
              <ChatEmptyState
                onSuggestionSelect={page.handleSuggestionSelect}
              />
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
    </div>
  );
}
