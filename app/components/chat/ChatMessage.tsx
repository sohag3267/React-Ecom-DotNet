"use client";

import { ChatMessage as ChatMessageType } from "@/lib/chat/model";
import { cn } from "@/lib/utils/utils";
import { Bot, User } from "lucide-react";
import { format } from "date-fns";
import { bn, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * Individual chat message component
 * Displays user and assistant messages with different styles
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const { i18n } = useTranslation();
  const isUser = message.role === "user";

  // Format timestamp based on current language
  const locale = i18n.language === "bn" ? bn : enUS;
  const timeStr = format(new Date(message.timestamp), "p", { locale });

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in slide-in-from-bottom-2",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-1 max-w-[85%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-4 py-2.5 w-full",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted text-foreground rounded-tl-none"
          )}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="chat-markdown text-sm prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customize links to open in new tab
                  a: ({ ...props }) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    />
                  ),
                  p: ({ ...props }) => (
                    <p {...props} className="whitespace-pre-wrap break-words mb-2 last:mb-0" />
                  ),
                  ul: ({ ...props }) => (
                    <ul {...props} className="list-disc ml-4 mb-2 last:mb-0" />
                  ),
                  ol: ({ ...props }) => (
                    <ol {...props} className="list-decimal ml-4 mb-2 last:mb-0" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground px-1">{timeStr}</span>
      </div>
    </div>
  );
}
