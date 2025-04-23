import "prismjs/themes/prism-tomorrow.css";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism";
import remarkGfm from "remark-gfm";

import { markdownComponents } from "@/lib/parseMarkdown";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  isHuman: boolean;
  message: string;
}

export const ChatBubble = ({
  isHuman,
  message
}: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex w-full",
        isHuman ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[600px] p-4 m-4 rounded-lg after:content-[''] after:absolute after:bottom-[-10px] after:border-8 after:border-transparent",
          isHuman
            ? "bg-neutral-900 text-white rounded-br-none after:right-0 after:border-t-neutral-900 after:border-r-neutral-900"
            : "bg-gray-300 text-black rounded-bl-none after:left-0 after:border-t-gray-300 after:border-l-gray-300"
        )}
      >
        {isHuman ? (
          message
        ) : (
          <Markdown
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypePrism]}
            components={markdownComponents}
          >
            {message}
          </Markdown>
        )}
      </div>
    </div>
  );
};
