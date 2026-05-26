import { CHAT_SUGGESTIONS } from '@/features/aiAgent/lib/utils';
import { RobotIcon } from '@/features/aiAgent/components/ui/RobotIcon';

type ChatEmptyStateProps = {
  onSuggestionSelect: (text: string) => void;
};

export function ChatEmptyState({ onSuggestionSelect }: ChatEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/30">
        <RobotIcon size="lg" />
      </div>
      <h3 className="mb-3 text-2xl font-bold tracking-tight text-slate-800">
        ¡Hola! Soy tu asistente de contratos
      </h3>
      <p className="max-w-md leading-relaxed text-slate-500">
        Preguntame cualquier cosa sobre tus contratos. Puedo ayudarte a analizar
        clausulas, explicar terminos legales y mucho mas.
      </p>
    </div>
  );
}
