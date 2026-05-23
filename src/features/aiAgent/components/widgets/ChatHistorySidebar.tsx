import { ApiConversationList } from '@/types/api';

import { formatConversationDate } from '@/features/aiAgent/lib/utils';

type ChatHistorySidebarProps = {
  activeConversationId?: number;
  conversations: ApiConversationList[];
  isLoading: boolean;
  onSelectConversation: (conversationId: number) => void;
  onToggle: () => void;
  showHistory: boolean;
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
  activeConversationId,
  conversations,
  isLoading,
  onSelectConversation,
  onToggle,
  showHistory,
}: ChatHistorySidebarProps) {
  return (
    <div
      className={`${
        showHistory ? 'w-80' : 'w-12'
      } flex shrink-0 flex-col overflow-hidden bg-white/80 shadow-[2px_0_16px_rgba(0,0,0,0.07)] backdrop-blur-xl transition-all duration-300 ease-out`}
    >
      {/* Header — no bottom border, blends into list */}
      <div className="flex shrink-0 items-center bg-white/70 px-3 py-4 backdrop-blur-xl">
        {showHistory ? (
          <>
            <div className="flex h-11 flex-1 items-center pl-2">
              <h2 className="font-semibold tracking-tight text-slate-800">
                Conversaciones
              </h2>
            </div>
            <button
              onClick={onToggle}
              title="Colapsar historial"
              className="rounded-lg p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-200/60 hover:text-slate-600"
            >
              <PanelCollapseIcon />
            </button>
          </>
        ) : (
          <div className="flex h-11 w-full items-center justify-center">
            <button
              onClick={onToggle}
              title="Expandir historial"
              className="rounded-lg p-1.5 text-slate-400 transition-colors duration-150 hover:bg-slate-200/60 hover:text-slate-600"
            >
              <PanelExpandIcon />
            </button>
          </div>
        )}
      </div>

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
            <div className="space-y-0.5">
              {conversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <button
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`group w-full rounded-lg px-3 py-2.5 text-left transition-all duration-150 ${
                      isActive
                        ? 'border border-blue-300 bg-blue-50'
                        : 'border border-transparent hover:bg-slate-100/70'
                    }`}
                  >
                    <p
                      className={`truncate text-sm font-medium transition-colors duration-150 ${
                        isActive
                          ? 'text-blue-700'
                          : 'text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {conversation.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                      <svg
                        className="h-3 w-3 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatConversationDate(conversation.created_at)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
