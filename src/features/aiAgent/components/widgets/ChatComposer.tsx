import { Send, SendHorizonal } from 'lucide-react';
import type { KeyboardEvent, RefObject, TextareaHTMLAttributes } from 'react';

type ChatComposerProps = {
  inputValue: string;
  isLoading: boolean;
  onChange: TextareaHTMLAttributes<HTMLTextAreaElement>['onChange'];
  onContainerClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

export function ChatComposer({
  inputValue,
  isLoading,
  onChange,
  onContainerClick,
  onKeyDown,
  onSubmit,
  textareaRef,
}: ChatComposerProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <div
        onClick={onContainerClick}
        className="flex cursor-text h-fit min-h-16 items-end gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 hover:border-slate-300 hover:bg-white focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-blue-500/10"
      >
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Escribe tu mensaje aqui..."
          className="flex-1 h-full resize-none py-1 text-body-small-regular leading-relaxed text-slate-700 outline-none placeholder:text-slate-400"
          disabled={isLoading}
          rows={1}
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={!inputValue.trim() || isLoading}
          className={`shrink-0 rounded-lg flex justify-center items-center transition-all duration-200 h-8.5 w-8.5 ${
            inputValue.trim() && !isLoading
              ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95'
              : 'cursor-not-allowed bg-slate-200 text-slate-400'
          }`}
        >
          <SendHorizonal size={16} />
        </button>
      </div>

      <p className="mt-3 text-center text-md text-slate-400">
        Presiona{' '}
        <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
          Enter
        </kbd>{' '}
        para enviar •{' '}
        <kbd className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
          Shift+Enter
        </kbd>{' '}
        para nueva linea
      </p>
    </div>
  );
}
