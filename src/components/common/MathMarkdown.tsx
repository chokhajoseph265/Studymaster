import React from 'react';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathMarkdownProps {
  content: string;
  className?: string;
  inline?: boolean;
}

/**
 * Normalizes mathematical notations so LaTeX, brackets, matrices, formulas,
 * fractions, powers, chemical formulas, and equations render cleanly with KaTeX and Markdown.
 *
 * It safely converts bracketed display math [ ... ] or \( ... \) into $ or $$
 * when raw LaTeX syntax like \begin{bmatrix}, \frac, \sqrt, \times, etc. is present,
 * ensuring students NEVER see raw code blocks or unrendered LaTeX commands.
 */
export function normalizeMathContent(text: string): string {
  if (!text) return '';

  let processed = text;

  // 1. Replace bracketed display math blocks [ \begin{...} ... ] with $$ ... $$
  processed = processed.replace(
    /^\s*\[\s*([\s\S]*?\\(?:begin|frac|sqrt|times|cdot|pm|sum|int|bmatrix|pmatrix|vmatrix|boxed)[\s\S]*?)\s*\]\s*$/gm,
    (_match, math) => `$$\n${math.trim()}\n$$`
  );

  // 2. Replace inline \( ... \) with $ ... $
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_match, math) => `$${math.trim()}$`);

  // 3. Replace display \[ ... \] with $$ ... $$
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_match, math) => `$$\n${math.trim()}\n$$`);

  // 4. Catch naked matrix blocks \begin{bmatrix} ... \end{bmatrix} not wrapped in $ or $$
  processed = processed.replace(
    /(?<!\$)((\\begin\{(?:bmatrix|pmatrix|vmatrix|matrix|align|aligned|cases)\}[\s\S]*?\\end\{(?:bmatrix|pmatrix|vmatrix|matrix|align|aligned|cases)\}))(?!\$)/g,
    (_match, matrix) => `$$\n${matrix.trim()}\n$$`
  );

  // 5. Clean up any accidental escaped brackets around $$
  processed = processed.replace(/\[\s*\$\$([\s\S]*?)\$\$\s*\]/g, '$$\n$1\n$$');

  return processed;
}

export const MathMarkdown: React.FC<MathMarkdownProps> = ({ content, className = '', inline = false }) => {
  const sanitizedContent = normalizeMathContent(content);

  if (inline) {
    return (
      <span className={`math-inline-container inline ${className}`}>
        <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[[rehypeKatex, { output: 'htmlAndMathml', throwOnError: false }]]}
          components={{
            p: ({ children }) => <span className="inline">{children}</span>,
            h1: ({ children }) => <span className="font-bold inline">{children}</span>,
            h2: ({ children }) => <span className="font-bold inline">{children}</span>,
            h3: ({ children }) => <span className="font-bold inline">{children}</span>,
            h4: ({ children }) => <span className="font-semibold inline">{children}</span>,
            h5: ({ children }) => <span className="font-semibold inline">{children}</span>,
            h6: ({ children }) => <span className="font-semibold inline">{children}</span>,
            ul: ({ children }) => <span className="inline">{children}</span>,
            ol: ({ children }) => <span className="inline">{children}</span>,
            li: ({ children }) => <span className="inline-block mx-1">{children}</span>,
            blockquote: ({ children }) => <span className="italic inline">{children}</span>
          }}
        >
          {sanitizedContent}
        </Markdown>
      </span>
    );
  }

  return (
    <div className={`math-markdown-container overflow-x-auto ${className}`}>
      <Markdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { output: 'htmlAndMathml', throwOnError: false }]]}
        components={{
          p: ({ children }) => <p className="leading-relaxed my-1.5">{children}</p>
        }}
      >
        {sanitizedContent}
      </Markdown>
    </div>
  );
};

