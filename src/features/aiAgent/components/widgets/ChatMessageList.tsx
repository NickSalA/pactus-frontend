import type { RefObject } from 'react';
import type { ChatMessage } from '@/features/aiAgent/lib/utils';
import { ChartRenderer } from './ChartRenderer';
import { MarkdownRenderer } from './MarkdownRenderer';
import { RobotIcon } from '@/features/aiAgent/components/ui/RobotIcon';

type ChatMessageListProps = {
  bottomRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  messages: ChatMessage[];
};

export function ChatMessageList({
  bottomRef,
  isLoading,
  messages,
}: ChatMessageListProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {message.sender === 'bot' ? (
            <div className="flex w-full max-w-full items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
                <RobotIcon size="sm" />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                {message.chart && <ChartRenderer chart={message.chart} />}
                <div className="text-[15px] leading-relaxed text-slate-700">
                  <MarkdownRenderer content={message.content} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex max-w-[85%] items-end gap-3 sm:max-w-[75%]">
              <div className="flex min-w-0 flex-col">
                <div className="rounded-2xl rounded-br-md bg-linear-to-br from-blue-600 via-blue-600 to-indigo-600 px-5 py-3.5 text-white shadow-lg shadow-blue-500/20">
                  <div className="text-[15px] leading-relaxed">
                    <span className="whitespace-pre-wrap">
                      {message.content}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200/50 bg-gradient-to-br from-slate-100 to-slate-200 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-end gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <RobotIcon size="sm" />
            </div>
            <div className="rounded-2xl rounded-bl-md border border-slate-100 bg-white px-5 py-4 shadow-lg shadow-slate-200/50">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
                <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
                <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}