import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { MessageBubble } from "../components/MessageBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { ErrorBoundary } from "../components/ErrorBoundary";
import axios from "axios";

export interface Message {
  id: string | number;
  role: "user" | "bot";
  isVoiceMessage?: boolean;
  content: {
    type: "text" | "table" | "chart";
    data: any;
  }[];
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      content: [
        {
          type: "text",
          data: "Welcome to CryptoChat! I can help you with cryptocurrency information, market data, and analysis. What would you like to know?",
        },
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [transcribedText, setTranscribedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (transcriptionTimerRef.current) {
        clearInterval(transcriptionTimerRef.current);
      }
    };
  }, []);

  // Function to parse bot response and determine content type
  const parseResponse = (response: any): Message["content"] => {
    try {
      // If response is a string, treat as text
      if (typeof response === "string") {
        return [{ type: "text", data: response }];
      }

      // Handle the specific backend response format with content array
      if (response.content && Array.isArray(response.content)) {
        return response.content.map((item: any) => ({
          type: (["text", "table", "chart"].includes(item.type)
            ? item.type
            : "text") as "text" | "table" | "chart",
          data: item.data,
        })) as { type: "text" | "table" | "chart"; data: any }[];
      }

      // If response has specific structure for tables/charts
      if (response.type === "table" && response.data) {
        return [
          {
            type: "text",
            data: response.message || "Here's the data you requested:",
          },
          { type: "table", data: response.data },
        ];
      }

      if (response.type === "chart" && response.data) {
        return [
          { type: "text", data: response.message || "Here's the chart data:" },
          { type: "chart", data: response.data },
        ];
      }

      // If response has both message and data
      if (response.message && response.data) {
        const content: { type: "text" | "table" | "chart"; data: any }[] = [
          { type: "text", data: response.message },
        ];

        // Determine if data is for table or chart based on structure
        if (Array.isArray(response.data) && response.data.length > 0) {
          const firstItem = response.data[0];
          // If has day/date field, treat as chart data
          if (firstItem.day || firstItem.date || firstItem.time) {
            content.push({ type: "chart" as const, data: response.data });
          } else {
            // Otherwise treat as table data
            content.push({
              type: "table" as const,
              data: { columns: Object.keys(firstItem), rows: response.data },
            });
          }
        }

        return content;
      }

      // Default fallback
      return [
        { type: "text", data: response.message || JSON.stringify(response) },
      ];
    } catch (error) {
      console.error("Error parsing response:", error);
      return [
        {
          type: "text",
          data: "I received your message but couldn't format the response properly.",
        },
      ];
    }
  };

  const sendMessageToAPI = async (message: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/chat",
        {
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error("API Error:", error);

      throw new Error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: [
        {
          type: "text",
          data: input.trim(),
        },
      ],
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setTranscribedText("");

    // Show typing indicator
    setIsTyping(true);

    try {
      // Send message to API
      const response = await sendMessageToAPI(currentInput);

      // Parse and add bot response
      const botResponse: Message = {
        id: (response as { id?: string | number })?.id || Date.now() + 1,
        role: "bot",
        content: parseResponse(response),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        content: [
          {
            type: "text",
            data: `Sorry, I encountered an error: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const simulateTranscription = () => {
    const words = [
      "What's",
      "the",
      "current",
      "Bitcoin",
      "price",
      "and",
      "market",
      "trend?",
    ];
    let currentText = "";
    let wordIndex = 0;

    transcriptionTimerRef.current = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? " " : "") + words[wordIndex];
        setTranscribedText(currentText);
        setInput(currentText);
        wordIndex++;
      } else {
        if (transcriptionTimerRef.current) {
          clearInterval(transcriptionTimerRef.current);
        }
      }
    }, 300);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.onstart = () => {
        setIsRecording(true);
        setRecordingDuration(0);
        setTranscribedText("");
        setInput("");

        // Start timer
        recordingTimerRef.current = setInterval(() => {
          setRecordingDuration((prev) => prev + 1);
        }, 1000);

        // Start simulated transcription after a short delay
        setTimeout(() => {
          simulateTranscription();
        }, 500);
      };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log("Audio data received:", event.data);
        }
      };

      recorder.onstop = () => {
        setIsRecording(false);
        setRecordingDuration(0);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
        if (transcriptionTimerRef.current) {
          clearInterval(transcriptionTimerRef.current);
          transcriptionTimerRef.current = null;
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const speakText = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeakLastMessage = () => {
    const lastBotMessage = messages.filter((m) => m.role === "bot").pop();
    if (lastBotMessage) {
      // Find the first text content in the bot message
      const textContent = lastBotMessage.content.find(
        (c) => c.type === "text"
      )?.data;
      if (typeof textContent === "string") {
        speakText(textContent);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col space-y-6 pt-10 pb-[100px]">
        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <ErrorBoundary
              key={message.id}
              messageId={
                typeof message.id === "number" ? message.id : Number(message.id)
              }
            >
              <MessageBubble
                message={message}
                onSpeak={
                  message.role === "bot"
                    ? () => {
                        const textContent = message.content.find(
                          (c) => c.type === "text"
                        )?.data;
                        if (typeof textContent === "string") {
                          speakText(textContent);
                        }
                      }
                    : undefined
                }
              />
            </ErrorBoundary>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex justify-start"
          >
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-transparent backdrop-blur-xl px-5 pt-3 pb-3 fixed bottom-2 left-0 right-0 z-50 rounded-md shadow-lg border border-slate-700/50 transition-all duration-300"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isLoading
                  ? "Sending message..."
                  : "Ask about crypto prices, market data, or trends..."
              }
              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 pr-36 text-white placeholder-slate-400"
              disabled={isRecording || isLoading}
            />

            {/* Mic + Timer container */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
              {/* Inline Recording Status */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 text-xs text-red-400 bg-slate-900/60 px-2 py-1 rounded-md"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span>
                    {Math.floor(recordingDuration / 60)}:
                    {(recordingDuration % 60).toString().padStart(2, "0")}
                  </span>
                </motion.div>
              )}

              {/* Mic Button */}
              <button
                onClick={handleMicClick}
                disabled={isLoading}
                className={`p-2 rounded-full transition-all duration-200 select-none ${
                  isRecording
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 disabled:opacity-50"
                }`}
              >
                {isRecording ? (
                  <motion.div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-red-400 rounded-full"
                    />
                    <Mic className="w-5 h-5 relative z-10" />
                    <motion.div
                      animate={{ scale: [0.8, 1.1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -inset-1 bg-red-500/30 rounded-full"
                    />
                  </motion.div>
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:scale-100"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
