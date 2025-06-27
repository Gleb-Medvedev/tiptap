import { useEffect, useRef, useState, type FC } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
// import Blockquote from '@tiptap/extension-blockquote';
import Underline from '@tiptap/extension-underline';
// import Code from '@tiptap/extension-code';
import TextAlign from '@tiptap/extension-text-align';
// import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
// import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { generateHTML } from '@tiptap/html';
import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';
import './Editor.css';
import Toolbar from './EditorToolbar';
import TableGridSizePickerPopup from './TableGridSizePickerPopup';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import TableCellControls from './TableCellControls';
import ToolbarButtonConfig from './EditorToolbar';

const md = new MarkdownIt();
const turndownService = new TurndownService();

interface SmartMarkdownProps {
  onInsertTable?: () => void;
  onClickTableCell?: () => void;
}

type PositionType = { top: number, left: number, width: number, height: number };

const SmartMarkdownEditor: FC<SmartMarkdownProps> = () => {
    const editorRef = useRef(null);

    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [showTableGrid, setShowTableGrid] = useState<boolean>(false);
    const [selectedTextPopupPosition, setSelectedTextPopupPosition] = useState<Pick<PositionType, 'top' | 'left'> | null>(null);
    const [selectedTableCellPosition, setSelectedCellPosition] = useState<PositionType | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Table.configure({
      resizable: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Image,
    Link.configure({
      openOnClick: false,
    }),
    TableRow,
    TableHeader,
    TableCell,
    // HorizontalRule,
  ],
    content: md.render(`# Привет! \n\n**Это жирный**, *а это курсивный* текст.`),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = turndownService.turndown(html);
    },
    onBlur: () => {
      setShowTableGrid(false);
      setSelectedCellPosition(null);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;

      if (from === to || !editorRef.current) {
        setSelectedTextPopupPosition(null);
        setSelectedText(null);
        return;
      }

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedTextPopupPosition({
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

  const showFocusedCellControls = () => {
    const view = editor.view;
    const { state } = view;
    const { $from } = state.selection;

    const dom = view.domAtPos($from.pos);
    const cell = dom.node instanceof HTMLElement && dom.node.closest('td, th');

    if (cell) {
      const rect = cell.getBoundingClientRect();

      setSelectedCellPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setSelectedCellPosition(null);
    }
  };

  editor.on('selectionUpdate', showFocusedCellControls);

  return () => {
    editor.off('selectionUpdate', showFocusedCellControls);
  };
}, [editor]);

  const handleTableCellAction = (action: any) => {
    switch (action) {
      case 'add-column-left':
        editor?.chain().focus().addColumnBefore().run();
        break;
      case 'add-column-right':
        editor?.chain().focus().addColumnAfter().run();
        break;
      case 'add-row-top':
        editor?.chain().focus().addRowBefore().run();
        break;
      case 'add-row-bottom':
        editor?.chain().focus().addRowAfter().run();
        break;
    }
  };

  return (
    <div className='editor-container'>
      <Toolbar editor={editor} onInsertTable={handleInsertTableClick} />

      {selectedText && selectedTextPopupPosition && (
          <div style={{top: selectedTextPopupPosition?.top, left: selectedTextPopupPosition?.left}} className='selected-text__popup'>
            <MapsUgcOutlinedIcon />
          </div>
      )}

      {selectedTableCellPosition && <TableCellControls position={selectedTableCellPosition} addTableElemOnCLick={handleTableCellAction}/>}

      {showTableGrid && (
        <TableGridSizePickerPopup
          onSelect={(rows, cols) => {
            editor?.chain().focus().insertTable({
              rows,
              cols,
              withHeaderRow: false,
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