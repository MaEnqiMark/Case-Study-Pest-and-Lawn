"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your PestxLawn AI assistant. How can I help you today? I can answer questions about our pest control services, lawn care programs, pricing, and scheduling.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.id > 1) // skip the initial greeting
            .map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
        }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: updatedMessages.length + 1,
        text: data.content || data.response || "Sorry, I had trouble processing that. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = {
        id: updatedMessages.length + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again or call us at (555) 123-4567.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">AI Chatbot Assistant</h1>
          <p className="text-xl text-gray-700">Get instant answers about our services, pricing, and scheduling</p>
        </div>
      </section>

      <section className="py-12 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === "user" ? "bg-green-600" : "bg-gray-600"}`}>
                      {message.sender === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl ${message.sender === "user" ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-900"}`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-green-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white border border-gray-200">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t-2 border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { label: "Pest Control Services", query: "What pest control services do you offer?" },
              { label: "Lawn Care Pricing", query: "Tell me about lawn care pricing" },
              { label: "Schedule Service", query: "How do I schedule an appointment?" },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => setInputValue(btn.query)}
                className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-sm font-semibold text-gray-700"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
