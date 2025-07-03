import { useEffect, useRef, useState, type FC } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {common, createLowlight} from 'lowlight'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import 'highlight.js/styles/github.css';
// import HorizontalRule from '@tiptap/extension-horizontal-rule';
// import { generateHTML } from '@tiptap/html';
import MarkdownIt from 'markdown-it';
// import TurndownService from 'turndown';
import './Editor.css';
import Toolbar from './EditorToolbar';
import TableGridSizePickerPopup from './TableGridSizePickerPopup';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import TableCellControls from './TableCellControls';
import Modal from './Modal';
import type { TableCellActions } from "./EditorToolbar";

const md = new MarkdownIt();
// const turndownService = new TurndownService();

const lowlight = createLowlight(common);

interface SmartMarkdownProps {
  onInsertTable?: () => void;
  onClickTableCell?: () => void;
}

export type PositionType = { top: number, left: number, width: number, height: number };

const SmartMarkdownEditor: FC<SmartMarkdownProps> = () => {
  const editorRef = useRef(null);

  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [showTableGrid, setShowTableGrid] = useState<boolean>(false);
  const [selectedTextPopupPosition, setSelectedTextPopupPosition] = useState<Pick<PositionType, 'top' | 'left'> | null>(null);
  const [selectedTableCellPosition, setSelectedCellPosition] = useState<PositionType | null>(null);
  const [modalState, setModalState] = useState<boolean>(false);

  const CustomImageNode = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        class: {
          default: 'inserted-image',
        },
        alt: {
          default: 'изображение',
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [StarterKit.configure({codeBlock: false}), Underline, Table.configure({
      resizable: true,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
    CustomImageNode,
    Link.configure({
      openOnClick: true,
      autolink: true,
      linkOnPaste: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
    content: md.render(`# Привет! \n\n**Это жирный**, *а это курсивный* текст.`),
    // onUpdate: ({ editor }) => {
    //   const html = editor.getHTML();
    //   const markdown = turndownService.turndown(html);
    // },
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


//Вставка текста в редактор
  // useEffect(() => {
  //   if (!editor || !editorRef.current) return;

  //   const handlePaste = (event: ClipboardEvent) => {
  //     const html = event.clipboardData?.getData('text/html');
  //     const text = event.clipboardData?.getData('text/plain');

  //     if (html) {
  //       editor.commands.setContent(html, false);
  //       event.preventDefault();
  //     } else if (text) {
  //       editor.commands.setContent(md.render(text), false);
  //       event.preventDefault();
  //     }
  //   };

  //   document.addEventListener('paste', handlePaste);
  //   return () => document.removeEventListener('paste', handlePaste);
  // }, [editor]);




  //вставка изображений через кнопку
  useEffect(() => {
  if (!editor || !editorRef.current) return;

  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const file = item.getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = () => {
          const src = reader.result as string;
          editor.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);

        event.preventDefault();
        return;
      }
    }

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


  //вставка изображений из буфера
  useEffect(() => {
    if (!editor || !editorRef.current) return;

    const editorDom = editorRef.current as HTMLElement;

    const handleDrop = (event: DragEvent) => {
      const files = event.dataTransfer?.files;
      if (!files || files.length === 0) return;

      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            const src = reader.result as string;
            editor.chain().focus().setImage({ src }).run();
          };
          reader.readAsDataURL(file);

          event.preventDefault();
          return;
        }
      }
    };

    editorDom.addEventListener('drop', handleDrop);
    return () => editorDom.removeEventListener('drop', handleDrop);
  }, [editor]);


  //отображение кнопок добавления элементов таблицы рядом с выбранной ячейкой
  useEffect(() => {
  if (!editor || !editorRef.current) return;

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

  const handleCellClick = (action: TableCellActions) => {
  if (!editor || !editorRef.current) return;

  switch (action) {
    case 'add-column-left':
      editor.chain().focus().addColumnBefore().run();
      break;
    case 'add-column-right':
      editor.chain().focus().addColumnAfter().run();
      break;
    case 'delete-column':
      editor.chain().focus().deleteColumn().run();
      break;

    case 'add-row-top':
      editor.chain().focus().addRowBefore().run();
      break;
    case 'add-row-bottom':
      editor.chain().focus().addRowAfter().run();
      break;
    case 'delete-row':
      editor.chain().focus().deleteRow().run();
      break;

    case 'delete-table':
      editor.chain().focus().deleteTable().run();
      break;

    default:
      console.warn(`Несуществующая команда для таблицы!: ${action}`);
  }
};

const handlePasteDiagramm = (dataUrl: string) => {
    editor?.commands.insertContent({
      type: 'image',
      attrs: {
        src: dataUrl,
        alt: 'Диаграмма',
      },
    });
}


  return (
    <div className='editor-container'>
      <Toolbar editor={editor} onInsertTable={() => setShowTableGrid(true)} onClickCellAction={handleCellClick} onCLickCloseModal={() => setModalState(true)}/>

      {modalState && <Modal onClose={() => setModalState(prev => !prev)} insertDrawioContentOnSave={handlePasteDiagramm}/>}

      {selectedText && selectedTextPopupPosition && (
        <div style={{ top: selectedTextPopupPosition?.top, left: selectedTextPopupPosition?.left }} className='selected-text__popup'>
          <MapsUgcOutlinedIcon />
        </div>
      )}

      {selectedTableCellPosition && <TableCellControls position={selectedTableCellPosition} addTableElemOnCLick={handleCellClick} />}

      {showTableGrid && (
        <TableGridSizePickerPopup
          onSelect={(rows, cols) => {
            editor?.chain().focus().insertTable({
              rows,
              cols,
              withHeaderRow: false,
            }).run();
          } }
          onClose={() => setShowTableGrid(false)} />
      )}

      <div className='editor-container-inner'>
        <EditorContent editor={editor} ref={editorRef} onBlur={() => setSelectedText(null)} className='editor' />
      </div>
    </div>
  );
};

export default SmartMarkdownEditor;