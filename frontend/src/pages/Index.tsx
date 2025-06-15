import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { MessageBubble } from "../components/MessageBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { ErrorBoundary } from "../components/ErrorBoundary";

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
    {
      id: 2,
      role: "user",
      content: [
        {
          type: "text",
          data: "Show me the top cryptocurrencies by market cap",
        },
      ],
    },
    // {
    //   id: 3,
    //   role: "bot",
    //   content: [
    //     {
    //       type: "table",
    //       data: {
    //         columns: [
    //           "Rank",
    //           "Name",
    //           "Symbol",
    //           "Price",
    //           "Market Cap",
    //           "24h Change",
    //         ],
    //         rows: [
    //           {
    //             Rank: 1,
    //             Name: "Bitcoin",
    //             Symbol: "BTC",
    //             Price: "$43,250",
    //             "Market Cap": "$847B",
    //             "24h Change": "+2.3%",
    //           },
    //           {
    //             Rank: 2,
    //             Name: "Ethereum",
    //             Symbol: "ETH",
    //             Price: "$2,630",
    //             "Market Cap": "$316B",
    //             "24h Change": "+1.8%",
    //           },
    //           {
    //             Rank: 3,
    //             Name: "Binance Coin",
    //             Symbol: "BNB",
    //             Price: "$315",
    //             "Market Cap": "$47B",
    //             "24h Change": "-0.5%",
    //           },
    //           {
    //             Rank: 4,
    //             Name: "Solana",
    //             Symbol: "SOL",
    //             Price: "$98",
    //             "Market Cap": "$44B",
    //             "24h Change": "+4.2%",
    //           },
    //           {
    //             Rank: 5,
    //             Name: "XRP",
    //             Symbol: "XRP",
    //             Price: "$0.62",
    //             "Market Cap": "$35B",
    //             "24h Change": "+0.8%",
    //           },
    //         ],
    //       },
    //     },
    //   ],
    // },
    {
      id: 4,
      role: "user",
      content: [
        {
          type: "text",
          data: "Can you show me Bitcoin price trend for the last week?",
        },
      ],
    },
    {
      id: 5,
      role: "bot",
      content: [
        {
          type: "text",
          data: "Here's the price trend of Bitcoin over the past week:",
        },
        {
          type: "chart",
          data: [
            { day: "Mon", price: 41200 },
            { day: "Tue", price: 42100 },
            { day: "Wed", price: 41800 },
            { day: "Thu", price: 43200 },
            { day: "Fri", price: 42900 },
            { day: "Sat", price: 43800 },
            { day: "Sun", price: 43250 },
          ],
        },
      ],
    },
    {
      id: 6,
      role: "user",
      content: [
        {
          type: "text",
          data: "Show me Ethereum price comparison",
        },
      ],
    },
    {
      id: 7,
      role: "bot",
      content: [
        {
          type: "text",
          data: "Here’s how Ethereum performed this week:",
        },
        {
          type: "chart",
          data: [
            { day: "Mon", price: 2580 },
            { day: "Tue", price: 2620 },
            { day: "Wed", price: 2590 },
            { day: "Thu", price: 2650 },
            { day: "Fri", price: 2630 },
            { day: "Sat", price: 2680 },
            { day: "Sun", price: 2630 },
          ],
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

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      role: "user",
      content: [
        {
          type: "text",
          data: input.trim(),
        },
      ],
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setTranscribedText("");

    // Simulate bot response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: Date.now() + 1,
        role: "bot",
        content: [
          {
            type: "text",
            data: "Thanks for your question! I'm analyzing the crypto market data for you. This is a demo response to show the chat interface in action.",
          },
        ],
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 2000);
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
        className="max-w-4xl mx-auto bg-transparent  backdrop-blur-xl px-5 pt-3 pb-3 fixed bottom-2 left-0 right-0 z-50  rounded-md shadow-lg border border-slate-700/50 transition-all duration-300"
      >
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crypto prices, market data, or trends..."
              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 pr-36 text-white placeholder-slate-400"
              disabled={isRecording}
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
                className={`p-2 rounded-full transition-all duration-200 select-none ${
                  isRecording
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:hover:scale-100"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
