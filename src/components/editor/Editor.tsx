import React, { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked';

type Props = {
  initialMarkdown: string;
  onChangeMarkdown: (markdown: string) => void;
};

export const SmartMarkdownEditor: React.FC<Props> = ({
  initialMarkdown,
  onChangeMarkdown,
}) => {
//   const [isEditing, setIsEditing] = useState(false);
  const [htmlFromMarkdown, setHtmlFromMarkdown] = useState('');
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
      const [selectedText, setSelectedText] = useState<string | null>(null);
  const editorRef = useRef(null);
  const popupRef = useRef(null);

  // При первом рендере — конвертим Markdown в HTML
  useEffect(() => {
    const html = marked(initialMarkdown || '');
    setHtmlFromMarkdown(html as any);
  }, [initialMarkdown]);

  const editor = useEditor({
    content: htmlFromMarkdown,
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = convertHTMLToMarkdown(html);
      onChangeMarkdown(markdown);
    },
        onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;

      if (from === to) {
        // Нет выделения — скрываем
        setPopupPosition(null);
        setSelectedText(null);
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setPopupPosition({
        top: rect.top + window.scrollY - 40,
        left: rect.left + window.scrollX + rect.width / 2,
      });

      const selected = editor.state.doc.textBetween(from, to, '\n');
      setSelectedText(selected);
    },
  });

  if (!editor) {
    return null;
  }

  useEffect(() => {
  if (!editor) return;

  editor.on('selectionUpdate', ({ editor }) => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '\n');
    console.log('Выделено:', selectedText);
  });
}, [editor]);

  return (
    <>
        <div className="toolbar">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>
            <b>Жирный</b>
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>
            <i>Курсив</i>
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>
            H1
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>
            H2
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>
            • List
          </button>
        </div>

              {popupPosition && (
        <div
          ref={popupRef}
          className="floating-popup"
          style={{
            top: popupPosition.top,
            left: popupPosition.left,
          }}
        >
          <button onClick={() => console.log('Выделено:', selectedText)}>
            🔍 Log selection
          </button>
        </div>
      )}
      
    <div style={{ border: '1px solid #ccc', padding: 12 }}>
      <EditorContent
        editor={editor}
        ref={editorRef}
      />
    </div>
    </>
  );
};

// Примитивная конвертация HTML → Markdown (можно заменить на turndown или unified)
const convertHTMLToMarkdown = (html: string): string => {
  return html
    .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
    .replace(/<em>(.*?)<\/em>/g, '*$1*')
    .replace(/<h1>(.*?)<\/h1>/g, '# $1')
    .replace(/<h2>(.*?)<\/h2>/g, '## $1')
    .replace(/<ul>(.*?)<\/ul>/gs, (_, content) =>
      content
        .replace(/<li>(.*?)<\/li>/g, '- $1')
        .split('\n')
        .map((line: string) => line.trim())
        .join('\n')
    )
    .replace(/<\/?[^>]+(>|$)/g, ''); // удаляем прочие теги
};
