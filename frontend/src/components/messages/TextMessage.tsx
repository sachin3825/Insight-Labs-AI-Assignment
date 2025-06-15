
interface TextMessageProps {
  content: string;
}

export const TextMessage = ({ content }: TextMessageProps) => {
  return (
    <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
      {content}
    </div>
  );
};
