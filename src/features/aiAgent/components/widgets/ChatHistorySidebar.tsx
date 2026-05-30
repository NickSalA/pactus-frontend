import { useState, useRef, useEffect } from 'react';
import { ApiConversationList } from '@/types/api';
import { Button } from '@/components/ui/button';

type ChatHistorySidebarProps = {
  activeConversationId?: number;
  conversations: ApiConversationList[];
  isLoading: boolean;
  onSelectConversation: (conversationId: number) => void;
  onToggle: () => void;
  showHistory: boolean;
  onNewConversation: () => void;
  onUpdateConversation: (id: number, title: string) => void;
  onDeleteConversation: (id: number) => void;
};

function TrashIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
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
  onUpdateConversation,
  onDeleteConversation,
}: ChatHistorySidebarProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const handleEditStart = (conversation: ApiConversationList, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conversation.id);
    setEditValue(conversation.title);
  };

  const handleEditSave = (id: number) => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onUpdateConversation(id, trimmed);
    }
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      handleEditSave(id);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(id);
  };

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
                const isEditing = editingId === conversation.id;

                if (isEditing) {
                  return (
                    <div
                      key={conversation.id}
                      className="flex items-center gap-3 px-4 py-3 border border-blue-300 bg-white rounded-lg shadow-md"
                    >
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => handleEditSave(conversation.id)}
                        onKeyDown={(e) => handleKeyDown(e, conversation.id)}
                        className="flex-1 min-w-0 truncate text-sm font-medium text-slate-700 focus:outline-none"
                      />
                      <div className="flex items-center gap-1 pl-4">
                        <button
                          onClick={() => handleEditSave(conversation.id)}
                          className="rounded p-1 text-emerald-500 hover:bg-emerald-50"
                          title="Guardar"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100"
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`flex items-center gap-3 px-4 py-3 border rounded-lg shadow-md cursor-pointer ${
                      isActive
                        ? 'border-transparent bg-brand-primary'
                        : 'border-slate-200 bg-neutral-50'
                    }`}
                  >
                    <span
                      className={`flex-1 min-w-0 truncate text-label-main-bold ${
                        isActive ? 'text-white' : 'text-brand-neutral-500'
                      }`}
                    >
                      {conversation.title}
                    </span>
                    <div className={`flex items-center gap-1 pl-4 ${isActive ? 'text-white/80' : ''}`}>
                      <button
                        onClick={(e) => handleEditStart(conversation, e)}
                        className={`rounded p-1 ${
                          isActive
                            ? 'text-white/80 hover:bg-white/10 hover:text-white'
                            : 'text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                        }`}
                        title="Editar título"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={(e) => handleDelete(conversation.id, e)}
                        className={`rounded p-1 ${
                          isActive
                            ? 'text-white/80 hover:bg-white/10 hover:text-white'
                            : 'text-slate-400 hover:bg-red-100 hover:text-red-600'
                        }`}
                        title="Eliminar conversación"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}