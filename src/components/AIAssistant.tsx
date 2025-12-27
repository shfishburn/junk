import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, RefreshCw, Wifi, WifiOff, Trash2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib";
import { useToast } from "@/hooks";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  status?: "sending" | "sent" | "error";
};

type ConnectionStatus = "connected" | "connecting" | "error" | "idle";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;
const STORAGE_KEY = "junkguru-chat-history";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Load messages from localStorage
const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if messages are less than 24 hours old
      if (parsed.length > 0 && Date.now() - parsed[0].timestamp < 24 * 60 * 60 * 1000) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error loading chat history:", e);
  }
  return [];
};

// Save messages to localStorage
const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error("Error saving chat history:", e);
  }
};

// Initial greeting message
const getGreetingMessage = (): Message => ({
  id: generateId(),
  role: "assistant",
  content: "Hey there! 👋 I'm Junk Guru, your friendly guide to all things junk removal. How can I help you today?",
  timestamp: Date.now(),
  status: "sent",
});

// Phone number regex pattern
const PHONE_REGEX = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g;

// Process text to make phone numbers clickable
const processPhoneNumbers = (text: string): (string | JSX.Element)[] => {
  const parts = text.split(PHONE_REGEX);
  return parts.map((part, index) => {
    if (PHONE_REGEX.test(part)) {
      // Reset regex lastIndex
      PHONE_REGEX.lastIndex = 0;
      const cleanNumber = part.replace(/\D/g, "");
      return (
        <a
          key={index}
          href={`tel:+1${cleanNumber}`}
          className="text-primary underline hover:no-underline font-medium"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Custom text renderer that handles phone numbers
const TextWithPhoneLinks = ({ children }: { children: React.ReactNode }) => {
  if (typeof children === "string") {
    return <>{processPhoneNumbers(children)}</>;
  }
  if (Array.isArray(children)) {
    return (
      <>
        {children.map((child, i) => 
          typeof child === "string" ? (
            <span key={i}>{processPhoneNumbers(child)}</span>
          ) : (
            child
          )
        )}
      </>
    );
  }
  return <>{children}</>;
};

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
  signal,
}: {
  messages: Message[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string, isRetryable: boolean) => void;
  signal?: AbortSignal;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      }),
      signal,
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      const isRetryable = resp.status >= 500 || resp.status === 429;
      
      if (resp.status === 429) {
        onError("Too many requests. Please wait a moment before trying again.", isRetryable);
      } else if (resp.status === 402) {
        onError("Service temporarily unavailable. Please try again later.", false);
      } else {
        onError(errorData.error || "Failed to get response", isRetryable);
      }
      return;
    }

    if (!resp.body) {
      onError("No response body", true);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let hasReceivedContent = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            hasReceivedContent = true;
            onDelta(content);
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Flush remaining buffer
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            hasReceivedContent = true;
            onDelta(content);
          }
        } catch { /* ignore */ }
      }
    }

    if (!hasReceivedContent) {
      onError("No response received. Please try again.", true);
      return;
    }

    onDone();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      onError("Request cancelled", false);
      return;
    }
    onError(error instanceof Error ? error.message : "Connection error", true);
  }
}

export function AIAssistant() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const loaded = loadMessages();
    return loaded.length > 0 ? loaded : [getGreetingMessage()];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [retryCount, setRetryCount] = useState(0);
  const [showAllQuickReplies, setShowAllQuickReplies] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 1 || messages[0]?.content !== getGreetingMessage().content) {
      saveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([getGreetingMessage()]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Chat cleared",
      description: "Your conversation history has been cleared.",
    });
  }, [toast]);

  const retryLastMessage = useCallback(async () => {
    // Find the last user message that failed
    let lastUserMsgIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserMsgIndex = i;
        break;
      }
    }
    if (lastUserMsgIndex === -1) return;

    const lastUserMsg = messages[lastUserMsgIndex];
    
    // Remove the error response if it exists
    const messagesUpToUser = messages.slice(0, lastUserMsgIndex + 1).map(m => 
      m.id === lastUserMsg.id ? { ...m, status: "sending" as const } : m
    );
    
    setMessages(messagesUpToUser);
    setRetryCount(prev => prev + 1);
    
    await sendMessageWithRetry(messagesUpToUser, lastUserMsg);
  }, [messages]);

  const sendMessageWithRetry = useCallback(async (
    currentMessages: Message[],
    userMessage: Message,
    attempt = 0
  ) => {
    setIsLoading(true);
    setConnectionStatus("connecting");

    // Cancel any existing request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    let assistantContent = "";
    const assistantId = generateId();

    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setConnectionStatus("connected");
      setMessages((prev) => {
        const existingAssistant = prev.find(m => m.id === assistantId);
        if (existingAssistant) {
          return prev.map((m) => m.id === assistantId ? { ...m, content: assistantContent } : m);
        }
        return [...prev, { 
          id: assistantId, 
          role: "assistant", 
          content: assistantContent, 
          timestamp: Date.now(),
          status: "sending"
        }];
      });
    };

    await streamChat({
      messages: currentMessages,
      signal: abortControllerRef.current.signal,
      onDelta: updateAssistant,
      onDone: () => {
        setIsLoading(false);
        setConnectionStatus("idle");
        setRetryCount(0);
        // Update statuses to sent
        setMessages(prev => prev.map(m => ({
          ...m,
          status: m.id === userMessage.id || m.id === assistantId ? "sent" : m.status
        })));
      },
      onError: async (error, isRetryable) => {
        if (isRetryable && attempt < MAX_RETRIES - 1) {
          // Auto-retry with exponential backoff
          setConnectionStatus("connecting");
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt)));
          await sendMessageWithRetry(currentMessages, userMessage, attempt + 1);
          return;
        }

        setConnectionStatus("error");
        setIsLoading(false);
        
        // Mark user message as error and add error response
        setMessages(prev => {
          const updated = prev.map(m => 
            m.id === userMessage.id ? { ...m, status: "error" as const } : m
          );
          
          // Add error message if no assistant response exists
          const hasAssistantResponse = updated.find(m => m.id === assistantId);
          if (!hasAssistantResponse) {
            updated.push({
              id: assistantId,
              role: "assistant",
              content: `Sorry, I ran into an issue: ${error}. You can try again or call us at (360) 610-9233 for immediate help!`,
              timestamp: Date.now(),
              status: "sent"
            });
          }
          
          return updated;
        });

        if (attempt >= MAX_RETRIES - 1) {
          toast({
            variant: "destructive",
            title: "Connection issue",
            description: "Unable to get a response. You can retry or contact us directly.",
          });
        }
      },
    });
  }, [toast]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { 
      id: generateId(),
      role: "user", 
      content: input.trim(),
      timestamp: Date.now(),
      status: "sending"
    };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setRetryCount(0);

    await sendMessageWithRetry(newMessages, userMsg);
  }, [input, isLoading, messages, sendMessageWithRetry]);

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setConnectionStatus("idle");
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasFailedMessage = messages.some(m => m.status === "error");

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-50 p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          "bg-primary text-primary-foreground",
          // Mobile: bottom center, Desktop: bottom right
          "bottom-4 right-4 sm:bottom-4 sm:right-4",
          isOpen && "sm:rotate-180"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat Window */}
      <div
        className={cn(
          "fixed z-50 bg-card border border-border shadow-xl transition-all duration-300 flex flex-col",
          // Mobile: full width bottom sheet
          "inset-x-0 bottom-0 rounded-t-2xl",
          // Desktop: floating card
          "sm:inset-auto sm:bottom-20 sm:right-4 sm:w-[400px] sm:rounded-lg",
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 translate-y-full sm:translate-y-4 pointer-events-none"
        )}
        style={{ 
          maxHeight: "calc(100vh - 60px)", 
          height: "min(85vh, 600px)"
        }}
      >
        {/* Drag handle for mobile */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 sm:p-4 border-b border-border bg-primary text-primary-foreground sm:rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/20 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Junk Guru</h3>
                <div className="flex items-center gap-1.5 text-xs opacity-80">
                  {connectionStatus === "connected" && (
                    <>
                      <Wifi className="h-3 w-3" />
                      <span>Connected</span>
                    </>
                  )}
                  {connectionStatus === "connecting" && (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Connecting...</span>
                    </>
                  )}
                  {connectionStatus === "error" && (
                    <>
                      <WifiOff className="h-3 w-3" />
                      <span>Connection issue</span>
                    </>
                  )}
                  {connectionStatus === "idle" && <span>AI Assistant</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <a
                href="tel:+13606109233"
                className="inline-flex items-center justify-center h-9 w-9 rounded-md text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                title="Call (360) 610-9233"
              >
                <Phone className="h-4 w-4" />
              </a>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={clearHistory}
                title="Clear chat history"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-primary-foreground hover:bg-primary-foreground/20 sm:hidden"
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[80%]">
                <div
                  className={cn(
                    "p-3 rounded-xl sm:rounded-lg text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none whitespace-pre-wrap"
                      : "bg-muted text-foreground rounded-bl-none",
                    msg.status === "error" && msg.role === "user" && "opacity-70"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">
                            <TextWithPhoneLinks>{children}</TextWithPhoneLinks>
                          </p>
                        ),
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => (
                          <li className="ml-1">
                            <TextWithPhoneLinks>{children}</TextWithPhoneLinks>
                          </li>
                        ),
                        a: ({ href, children }) => {
                          const isInternal = href?.startsWith("/");
                          if (isInternal) {
                            return (
                              <button
                                onClick={() => navigate(href!)}
                                className="text-primary underline hover:no-underline font-medium"
                              >
                                {children}
                              </button>
                            );
                          }
                          return (
                            <a 
                              href={href} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary underline hover:no-underline font-medium"
                            >
                              {children}
                            </a>
                          );
                        },
                        code: ({ children }) => (
                          <code className="bg-background/50 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.status === "sending" && msg.role === "user" && (
                  <span className="text-xs text-muted-foreground self-end">Sending...</span>
                )}
                {msg.status === "error" && msg.role === "user" && (
                  <button
                    onClick={retryLastMessage}
                    className="text-xs text-destructive hover:underline self-end flex items-center gap-1 py-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </button>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && !messages.find(m => m.role === "assistant" && m.status === "sending") && (
            <div className="flex gap-2 justify-start animate-fade-in">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-muted p-3 rounded-xl sm:rounded-lg rounded-bl-none">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Typing</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.6s" }} />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.6s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 pb-safe border-t border-border space-y-3">
          {/* Quick Replies - show when not loading and input is empty */}
          {!isLoading && !input.trim() && (() => {
            const allQuickReplies = [
              { label: "Get a Quote", message: "I'd like to get a quote for junk removal" },
              { label: "📅 Book Now", message: "How do I schedule a junk pickup appointment?" },
              { label: "📸 AI Estimator", message: "Tell me about your AI Estimator tool where I can upload photos for an instant quote" },
              { label: "🔨 Light Demolition", message: "What light demolition services do you offer? Like deck removal, shed teardown, or fence removal?" },
              { label: "Hazmat Pickup", message: "Do you handle hazardous materials like paint, chemicals, or batteries?" },
              { label: "What do you haul?", message: "What types of items do you haul?" },
              { label: "Service area", message: "What areas do you service?" },
            ];
            const visibleReplies = showAllQuickReplies ? allQuickReplies : allQuickReplies.slice(0, 4);
            const hasMore = allQuickReplies.length > 4;
            
            return (
              <div className="flex flex-wrap gap-2">
                {visibleReplies.map((quick) => (
                  <button
                    key={quick.label}
                    onClick={() => {
                      setInput(quick.message);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-2 sm:py-1.5 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 active:bg-primary/30 transition-colors touch-manipulation"
                  >
                    {quick.label}
                  </button>
                ))}
                {hasMore && (
                  <button
                    onClick={() => setShowAllQuickReplies(!showAllQuickReplies)}
                    className="px-3 py-2 sm:py-1.5 text-xs bg-muted text-muted-foreground rounded-full hover:bg-muted/80 active:bg-muted/60 transition-colors touch-manipulation"
                  >
                    {showAllQuickReplies ? "Less" : `+${allQuickReplies.length - 4} more`}
                  </button>
                )}
              </div>
            );
          })()}
          
          {isLoading && (
            <button
              onClick={cancelRequest}
              className="w-full py-2 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 touch-manipulation"
            >
              <X className="h-3 w-3" />
              Cancel response
            </button>
          )}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our services..."
              className="flex-1 px-4 py-3 sm:py-2 text-base sm:text-sm bg-background border border-input rounded-xl sm:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            {hasFailedMessage && !isLoading ? (
              <Button
                onClick={retryLastMessage}
                size="icon"
                variant="outline"
                className="shrink-0 h-12 w-12 sm:h-10 sm:w-10 rounded-xl sm:rounded-md touch-manipulation"
                title="Retry failed message"
              >
                <RefreshCw className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            ) : (
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="shrink-0 h-12 w-12 sm:h-10 sm:w-10 rounded-xl sm:rounded-md touch-manipulation"
              >
                <Send className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
