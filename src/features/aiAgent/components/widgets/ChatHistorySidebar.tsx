import { useState, useRef, useEffect } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
                          <Pencil className="h-4 w-4" />
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
                        <Pencil className="h-4 w-4" />
                      </button>
<AlertDialog>
                        <AlertDialogTrigger
                          onClick={(e) => e.stopPropagation()}
                          className={`rounded p-1 ${
                            isActive
                              ? 'text-white/80 hover:bg-white/10 hover:text-white'
                              : 'text-slate-400 hover:bg-red-100 hover:text-red-600'
                          }`}
                          title="Eliminar conversación"
                        >
                          <Trash2 className="h-4 w-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar conversación</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro de que deseas eliminar esta conversación? Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(conversation.id, e);
                              }}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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