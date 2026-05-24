import { ApiConversationList } from '@/types/api';
import { Button } from '@/components/ui/button';

import { formatConversationDate } from '@/features/aiAgent/lib/utils';

type ChatHistorySidebarProps = {
  activeConversationId?: number;
  conversations: ApiConversationList[];
  isLoading: boolean;
  onSelectConversation: (conversationId: number) => void;
  onToggle: () => void;
  showHistory: boolean;
  onNewConversation: () => void;
};

function PanelCollapseIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
      />
    </svg>
  );
}

function PanelExpandIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      />
    </svg>
  );
}

export function ChatHistorySidebar({
  onNewConversation,
  activeConversationId,
  conversations,
  isLoading,
  onSelectConversation,
  onToggle,
  showHistory,
}: ChatHistorySidebarProps) {
  return (
    <div className="flex shrink-0 w-84 flex-col gap-6 overflow-hidden bg-white/80 shadow-xl rounded-2xl backdrop-blur-xl p-5 transition-all duration-300 ease-out">
      <Button
        onClick={onNewConversation}
        variant={'emphasized'}
        text="Nueva conversación"
        size={'big'}
        className="text-body-small-bold text-neutral-50"
      />

      <h2 className="text-body-main-bold text-brand-primary tracking-tight">
        Conversaciones
      </h2>

      {/* Conversation list */}
      {showHistory && (
        <div className="flex-1 overflow-y-auto px-2 py-1 pb-3">
          {isLoading ? (
            <div className="px-3 py-6 text-center text-sm text-slate-400">
              Cargando conversaciones...
            </div>
          ) : conversations.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-slate-400">
              No hay conversaciones anteriores
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <Button
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    text={conversation.title}
                    variant={'normal'}
                    size="big"
                    className="w-full justify-center text-brand-neutral-500 shadow-md"
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
