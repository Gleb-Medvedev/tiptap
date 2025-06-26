import React, { useEffect, useRef, useState, type FC } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { generateHTML } from '@tiptap/html';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';
import './Editor.css';
import Toolbar from './EditorToolbar';
import TableGridSelector from './EditorTablePicker';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';

const md = new MarkdownIt();
const turndownService = new TurndownService();

interface SmartMarkdownProps {
  onInsertTable?: () => void;
}

const SmartMarkdownEditor: FC<SmartMarkdownProps> = () => {
    const editorRef = useRef(null);

    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [showTableGrid, setShowTableGrid] = useState(false);
    const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
    const [cellPosition, setCellPosition] = useState<{ top: number, left: number } | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Table.configure({
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
    TableCell,  
  ],
    content: md.render(`# Привет! \n\n**Это жирный**, *а это курсивный* текст.`),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;

      if (from === to || !editorRef.current) {
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

      const selectedTextRange = editor.state.doc.textBetween(from, to, '\n');
      setSelectedText(selectedTextRange);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handlePaste = (event: ClipboardEvent) => {
      const html = event.clipboardData?.getData('text/html');
      const text = event.clipboardData?.getData('text/plain');

      if (html) {
        editor.commands.setContent(html, false);
        event.preventDefault();
      } else if (text) {
        editor.commands.setContent(md.render(text), false);
        event.preventDefault();
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [editor]);

  const handleInsertTableClick = () => {
    setShowTableGrid(true);
  };

  useEffect(() => {
    if (!editor) return;

    const view = editor.view;

    const { state } = view;

    const { $from } = state.selection;

    console.log($from)

    const dom = view.domAtPos($from.pos);
    const cell = dom.node instanceof HTMLElement && dom.node.closest('td, th');
  }, [editor])

//   useEffect(() => {
//   if (!editor) return;

//   const updateControls = () => {
    // const view = editor.view;
    // const { state } = view;
    // const { $from } = state.selection;

//     const dom = view.domAtPos($from.pos);
//     const cell = dom.node instanceof HTMLElement && dom.node.closest('td, th');

//     if (cell) {
//       const rect = cell.getBoundingClientRect();
//       setCellPosition({
//         top: rect.top + window.scrollY,
//         left: rect.left + window.scrollX,
//       });
//     } else {
//       setCellPosition(null);
//     }
//   };

//   editor.on('selectionUpdate', updateControls);

//   return () => {
//     editor.off('selectionUpdate', updateControls);
//   };
// }, [editor]);


  return (
    <div className='editor-container'>
      <Toolbar editor={editor} onInsertTable={handleInsertTableClick} />
      {selectedText && popupPosition && (
          <div style={{top: popupPosition?.top, left: popupPosition?.left}} className='selected-text__popup' title='Оставить комментарий'>
            <MapsUgcOutlinedIcon />
          </div>
      )}





    {/* {cellPosition && (
  <>
    <button
      className="table-btn insert-col-left"
      style={{ top: cellPosition.top, left: cellPosition.left - 20 }}
      onClick={() => editor?.chain().focus().addColumnBefore().run()}
    >+Col←</button>

    <button
      className="table-btn insert-col-right"
      style={{ top: cellPosition.top, left: cellPosition.left + 100 }}
      onClick={() => editor?.chain().focus().addColumnAfter().run()}
    >+Col→</button>

    <button
      className="table-btn insert-row-above"
      style={{ top: cellPosition.top - 20, left: cellPosition.left + 40 }}
      onClick={() => editor?.chain().focus().addRowBefore().run()}
    >+Row↑</button>

    <button
      className="table-btn insert-row-below"
      style={{ top: cellPosition.top + 40, left: cellPosition.left + 40 }}
      onClick={() => editor?.chain().focus().addRowAfter().run()}
    >+Row↓</button>
  </>
)} */}









      {showTableGrid && (
        <TableGridSelector
          onSelect={(rows, cols) => {
            editor?.chain().focus().insertTable({
              rows,
              cols,
              withHeaderRow: true,
            }).run();
          }}
          onClose={() => setShowTableGrid(false)}
        />
      )}

      <div className='editor-container-inner'>
        <EditorContent editor={editor} ref={editorRef} onBlur={() => setSelectedText(null)} className='editor'/>
      </div>
    </div>
  );
};

export default SmartMarkdownEditor;