import React, { useState, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import StarterKit from '@tiptap/starter-kit';
import { marked } from 'marked';
import { generateHTML, generateJSON } from '@tiptap/html';
import MarkdownIt from 'markdown-it';
// import Markdown from '@tiptap/extension-markdown';
import './Editor.css'
import TurndownService from 'turndown';


type Props = {
  initialMarkdown: string;
  onChangeMarkdown: (markdown: string) => void;
};

export const SmartMarkdownEditor: React.FC<Props> = ({
  initialMarkdown,
  onChangeMarkdown,
}) => {
  const [htmlFromMarkdown, setHtmlFromMarkdown] = useState('');
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
      const [selectedText, setSelectedText] = useState<string | null>(null);
  const editorRef = useRef(null);
  const popupRef = useRef(null);
  const [showTableGrid, setShowTableGrid] = useState(false);
const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });



  // При первом рендере — конвертим Markdown в HTML
  useEffect(() => {
    const html = marked(initialMarkdown || '');
    setHtmlFromMarkdown(html as any);
  }, [initialMarkdown]);

  const editor = useEditor({
      // content,
    content: htmlFromMarkdown,
    extensions: [StarterKit,     Table.configure({
      resizable: true,
    }),
        Image,
    Link.configure({
      openOnClick: false,
    }),
    Code,
    Blockquote,
    HorizontalRule,
    TableRow,
    TableHeader,
    TableCell,],
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

          <button onClick={() => setShowTableGrid(!showTableGrid)}>
            📊 Вставить таблицу
          </button>


          <button onClick={() => editor.chain().focus().setImage({ src: 'https://via.placeholder.com/150' }).run()}>
  🖼️ Вставить изображение
</button>

<button onClick={() => editor.chain().focus().toggleCode().run()}>
  ` Инлайн код
</button>

<button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
  📄 Блок кода
</button>

<button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
  ❝ Цитата
</button>

<button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
  ━ Горизонтальная линия
</button>

<button onClick={() => {
  const url = prompt('Введите ссылку');
  if (url) {
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }
}}>
  🔗 Вставить ссылку
</button>
        </div>


{editor && editor.isActive('table') && (
  <div className="table-toolbar">
    <button onClick={() => editor.chain().focus().addRowBefore().run()}>
      ➕ Строка выше
    </button>
    <button onClick={() => editor.chain().focus().addRowAfter().run()}>
      ➕ Строка ниже
    </button>
    <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
      ➕ Колонка слева
    </button>
    <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
      ➕ Колонка справа
    </button>
    <button onClick={() => editor.chain().focus().deleteRow().run()}>
      🗑️ Удалить строку
    </button>
    <button onClick={() => editor.chain().focus().deleteColumn().run()}>
      🗑️ Удалить колонку
    </button>
    <button onClick={() => editor.chain().focus().deleteTable().run()}>
      ❌ Удалить таблицу
    </button>
  </div>
)}




{/* сетка выбора размера таблицы */}
{showTableGrid && (
  <div
    style={{
      position: 'absolute',
      top: 60, // под тулбаром
      left: 0,
      background: '#fff',
      border: '1px solid #ccc',
      padding: 8,
      zIndex: 10,
    }}
    onMouseLeave={() => setShowTableGrid(false)}
  >
    <div style={{ marginBottom: 4 }}>
      {gridSize.cols > 0 && gridSize.rows > 0 && (
        <div>{gridSize.cols} × {gridSize.rows}</div>
      )}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 20px)', gap: 2 }}>
      {Array.from({ length: 100 }).map((_, i) => {
        const x = (i % 10) + 1;
        const y = Math.floor(i / 10) + 1;
        const isActive = x <= gridSize.cols && y <= gridSize.rows;

        return (
          <div
            key={i}
            onMouseEnter={() => setGridSize({ cols: x, rows: y })}
            onClick={() => {
              editor.chain().focus().insertTable({
                rows: gridSize.rows,
                cols: gridSize.cols,
                withHeaderRow: true,
              }).run();
              setShowTableGrid(false);
              setGridSize({ cols: 0, rows: 0 });
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: isActive ? '#007bff' : '#eee',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          />
        );
      })}
    </div>
  </div>
)}





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