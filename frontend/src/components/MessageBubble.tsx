import { motion } from "framer-motion";
import { Volume2, Mic } from "lucide-react";
import { Message } from "../pages/Index";
import { TextMessage } from "./messages/TextMessage";
import { TableMessage } from "./messages/TableMessage";
import { ChartMessage } from "./messages/ChartMessage";

interface MessageBubbleProps {
  message: Message;
  onSpeak?: () => void;
}

export const MessageBubble = ({ message, onSpeak }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  const renderMessageContent = () => {
    return message.content.map((block, index) => {
      switch (block.type) {
        case "text":
          return <TextMessage key={index} content={block.data as string} />;
        case "table":
          return (
            <TableMessage
              key={index}
              // @ts-ignore
              content={
                block.data as {
                  columns: string[];
                  rows: Record<string, any>[];
                }
              }
            />
          );
        case "chart":
          return (
            <ChartMessage
              key={index}
              // @ts-ignore
              content={block.data.chartData as { day: string; price: number }[]}
            />
          );
        default:
          return <TextMessage key={index} content="Unsupported message type" />;
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 1,
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex items-end space-x-3 max-w-[85%] ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-bold text-sm">₿</span>
          </div>
        )}

        {/* Message bubble */}
        <div className="relative group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`
              relative px-5 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200
              ${
                isUser
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-12"
                  : "bg-slate-800/90 backdrop-blur-sm text-slate-100 border border-slate-700/50"
              }
            `}
          >
            {/* Voice message indicator */}
            {message.isVoiceMessage && isUser && (
              <div className="flex items-center space-x-2 mb-2 opacity-80">
                <Mic className="w-3 h-3" />
                <span className="text-xs">Voice message</span>
              </div>
            )}

            {renderMessageContent()}

            {/* Message tail */}
            <div
              className={`
              absolute w-3 h-3 transform rotate-45
              ${
                isUser
                  ? "bg-purple-600 -right-1 bottom-4"
                  : "bg-slate-800/90  -left-1 bottom-4"
              }
            `}
            />
          </motion.div>

          {/* Speak button for bot messages */}
          {onSpeak && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSpeak}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-700/90 hover:bg-slate-600/90 text-slate-300 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
            >
              <Volume2 className="w-3 h-3" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
