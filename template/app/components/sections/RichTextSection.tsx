import type { PublicSection } from '@/app/lib/publicApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function RichTextSection({ section }: { section: PublicSection }) {
  return (
    <section className="space-y-4">
      {section.content.heading ? (
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950 lg:text-4xl">
          {section.content.heading}
        </h2>
      ) : null}
      {section.content.body ? (
        <div className="prose prose-zinc max-w-none text-base leading-8 text-zinc-600">
          <RichTextRenderer content={section.content.body} />
        </div>
      ) : null}
    </section>
  );
}

function RichTextRenderer({ content }: { content: any }) {
  if (!content) return null;

  let parsedContent = content;

  // Handle string content that might be JSON
  if (typeof content === 'string' && content.startsWith('{') && content.includes('"root"')) {
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      // Stay as string (markdown)
    }
  }

  // If it's a Lexical JSON object, render it as JSX
  if (typeof parsedContent === 'object' && parsedContent?.root) {
    return <LexicalToJsx node={parsedContent.root} />;
  }

  // Fallback to Markdown
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {typeof content === 'string' ? content : JSON.stringify(content)}
    </ReactMarkdown>
  );
}

function LexicalToJsx({ node }: { node: any }) {
  if (!node) return null;

  const children = node.children?.map((child: any, i: number) => (
    <LexicalToJsx key={i} node={child} />
  )) || null;

  switch (node.type) {
    case 'root':
      return <div className="lexical-root">{children}</div>;
    case 'paragraph':
      return <p className="mb-4">{children}</p>;
    case 'heading':
      const Tag = (node.tag || 'h3') as any;
      return <Tag className="mb-4 mt-8 font-bold italic first:mt-0">{children}</Tag>;
    case 'list':
      const ListTag = node.tag === 'ol' ? 'ol' : 'ul';
      return <ListTag className="mb-4 ml-6 list-outside list-disc">{children}</ListTag>;
    case 'listitem':
      return <li className="mb-1">{children}</li>;
    case 'quote':
      return <blockquote className="mb-4 border-l-4 border-zinc-200 pl-4 italic">{children}</blockquote>;
    case 'code':
      return <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-100 p-4 font-mono text-sm"><code>{children}</code></pre>;
    case 'horizontalrule':
      return <hr className="my-8 border-zinc-200" />;
    case 'text':
      let text = node.text;
      if (node.format & 1) text = <strong key="b">{text}</strong>; // Bold
      if (node.format & 2) text = <em key="i">{text}</em>; // Italic
      if (node.format & 4) text = <u key="u">{text}</u>; // Underline
      if (node.format & 8) text = <code key="c">{text}</code>; // Code/Monospace
      if (node.format & 16) text = <del key="s">{text}</del>; // Strikethrough
      return text;
    case 'linebreak':
      return <br />;
    case 'link':
      return (
        <a href={node.url} className="text-primary underline hover:opacity-80" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    default:
      return children;
  }
}
