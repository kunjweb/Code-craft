import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../utils';
import { Copy, Check } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'model';
  content: string;
}

export const ChatMessage: React.FC<MessageProps> = ({ role, content }) => {
  const isAI = role === 'model';
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
          isAI 
            ? "bg-white border border-zinc-200 text-zinc-800 rounded-tl-none" 
            : "bg-zinc-900 text-white rounded-tr-none"
        )}
      >
        <div className="text-xs font-mono mb-1 opacity-50 uppercase tracking-wider">
          {isAI ? "CodeCraft AI" : "You"}
        </div>
        <div className="prose prose-sm max-w-none prose-zinc dark:prose-invert">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                
                return !inline && match ? (
                  <div className="relative group my-4">
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button 
                        onClick={() => handleCopy(codeString)}
                        className="flex items-center gap-1.5 text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700 hover:bg-zinc-700 transition-colors"
                      >
                        {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg !bg-zinc-950 !m-0 border border-zinc-800"
                      {...props}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={cn("bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono", className)} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
