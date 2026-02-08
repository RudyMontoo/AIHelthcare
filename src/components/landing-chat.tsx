"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTambo } from "@tambo-ai/react";
import { Bot, Mic, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThreadContainer } from "@/components/tambo/thread-container";
import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import { ThreadContent, ThreadContentMessages } from "@/components/tambo/thread-content";
import {
    MessageInput,
    MessageInputPlainTextarea,
    MessageInputSubmitButton,
    MessageInputToolbar,
    MessageInputFileButton
} from "@/components/tambo/message-input";
import { MessageSuggestions, MessageSuggestionsStatus } from "@/components/tambo/message-suggestions";

export function LandingChat() {
    const { thread, sendThreadMessage } = useTambo();
    const [inputValue, setInputValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Check if there are messages to determine mode
    const hasMessages = thread?.messages && thread.messages.length > 0;

    // Handle auto-resize of textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [inputValue]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;
        sendThreadMessage(inputValue);
        setInputValue("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (hasMessages) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full flex flex-col bg-slate-950/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative"
            >
                {/* Top Bar / Header */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-slate-900/50 backdrop-blur-md border-b border-white/10 flex items-center px-6 z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Bot className="w-5 h-5 text-indigo-400" />
                        </div>
                        <span className="font-semibold text-white tracking-wide">Nexus Health Gateway</span>
                    </div>
                </div>

                <ThreadContainer className="h-full bg-transparent pt-16" disableSidebarSpacing>
                    <ScrollableMessageContainer className="p-4 md:p-8">
                        <ThreadContent variant="default" className="max-w-3xl mx-auto">
                            <ThreadContentMessages className="gap-6 text-white [&_[data-message-role=user]_div[data-slot=message-content]]:bg-indigo-600 [&_[data-message-role=user]_div[data-slot=message-content]]:text-white [&_[data-message-role=assistant]_div[data-slot=message-content]]:bg-white/10 [&_[data-message-role=assistant]_div[data-slot=message-content]]:text-slate-100 [&_[data-message-role=assistant]_div[data-slot=message-content]]:backdrop-blur-sm" />
                        </ThreadContent>
                    </ScrollableMessageContainer>

                    {/* Message suggestions status */}
                    <div className="max-w-3xl mx-auto w-full px-4">
                        <MessageSuggestions>
                            <MessageSuggestionsStatus className="text-slate-400" />
                        </MessageSuggestions>
                    </div>

                    <div className="p-4 md:p-6 bg-slate-900/30 backdrop-blur-md border-t border-white/5">
                        <div className="max-w-3xl mx-auto">
                            <MessageInput className="relative [&>div]:!bg-transparent [&>div]:!shadow-none [&>div]:!border-none [&>div]:!p-0">
                                <div className="relative flex flex-col rounded-xl bg-slate-800/50 border border-white/10 shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all">
                                    <MessageInputPlainTextarea
                                        placeholder="Type your message..."
                                        className="min-h-[60px] max-h-[200px] py-4 px-4 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none border-none shadow-none focus:ring-0 ring-0"
                                    />
                                    <MessageInputToolbar className="px-2 pb-2">
                                        <MessageInputFileButton className="text-slate-400 hover:text-white hover:bg-white/10 border-white/5" />
                                        <MessageInputSubmitButton className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 transition-colors" />
                                    </MessageInputToolbar>
                                </div>
                                <div className="hidden">
                                    {/* Error message slot hidden or styled appropriately */}
                                </div>
                            </MessageInput>
                        </div>
                    </div>
                </ThreadContainer>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 z-10 h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center text-center space-y-8 w-full"
            >
                {/* Logo/Icon */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>
                    <div className="relative p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-2xl">
                        <Bot className="w-12 h-12 text-indigo-400" />
                    </div>
                </div>

                {/* Headings */}
                <div className="space-y-3 max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white drop-shadow-sm">
                        Nexus Health Gateway
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
                        Your intelligent healthcare companion.
                        <br />
                        Tell me what you need, and I'll guide you to the right place.
                    </p>
                </div>

                {/* Input Area */}
                <div className="w-full max-w-2xl relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 via-slate-500/10 to-emerald-500/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative flex flex-col bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-white/20 focus-within:bg-slate-900/90">

                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe your symptoms, ask about lab results, or tell me what you need..."
                            className="w-full bg-transparent text-white placeholder-slate-500 p-6 min-h-[140px] resize-none focus:outline-none text-lg leading-relaxed selection:bg-indigo-500/30"
                            spellCheck={false}
                        />

                        {/* Action Bar */}
                        <div className="flex justify-between items-center px-4 pb-4 pt-2">
                            <button
                                type="button"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors border border-white/5"
                            >
                                <Mic className="w-4 h-4" />
                                <span>Voice Input</span>
                            </button>

                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg",
                                    inputValue.trim()
                                        ? "bg-slate-700 hover:bg-slate-600 text-white shadow-indigo-500/20 hover:shadow-indigo-500/30"
                                        : "bg-slate-800/50 text-slate-500 cursor-not-allowed"
                                )}
                            >
                                <span>Send</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
