import { Select, MenuItem, Typography, IconButton } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
// import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
// import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
// import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { Editor } from '@tiptap/react';
import { useState, type FC } from 'react';
import './EditorToolbar.css'

type Level = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const muiSelectStyles = {
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& > div': {
        padding: '5.75px 14px',

        '& > p': {
            color: 'rgba(0, 0, 0, .64)',
        }
    },
}

const TOOLBAR_CONFIG = [
  {
    label: 'Жирный текст',
    action: 'mark',
    actionValue: 'bold',
    icon: <FormatBoldIcon />,
  },
  {
    label: 'Курсив',
    action: 'mark',
    actionValue: 'italic',
    icon: <FormatItalicIcon />,
  },
  {
    label: 'Подчёркнутый текст',
    action: 'mark',
    actionValue: 'underline',
    icon: <FormatUnderlinedIcon />,
  },
  {
    label: 'Зачеркнутый текст',
    action: 'mark',
    actionValue: 'strike',
    icon: <FormatStrikethroughIcon />,
  },
  {
    label: 'Нумерованный список',
    action: 'node',
    actionValue: 'orderedList',
    icon: <FormatListNumberedIcon />,
  },
  {
    label: 'Ненумерованный список',
    action: 'node',
    actionValue: 'bulletList',
    icon: <FormatListBulletedIcon />,
  },
  {
    label: 'Список заголовков',
    action: 'heading',
    selectOptions: [
      {
        optionTitle: 'Обычный',
        selectType: 'paragraph',
        level: 0,
      },
      {
        optionTitle: 'Заголовок 1',
        selectType: 'heading',
        level: 1,
      },
      {
        optionTitle: 'Заголовок 2',
        selectType: 'heading',
        level: 2,
      },
      {
        optionTitle: 'Заголовок 3',
        selectType: 'heading',
        level: 3,
      },
      {
        optionTitle: 'Заголовок 4',
        selectType: 'heading',
        level: 4,
      },
      {
        optionTitle: 'Заголовок 5',
        selectType: 'heading',
        level: 5,
      },
      {
        optionTitle: 'Заголовок 6',
        selectType: 'heading',
        level: 6,
      },
    ],
  },
  {
    label: 'Добавить таблицу',
    action: 'custom',
    actionValue: 'insertTable',
    icon: <TableChartOutlinedIcon />,
  },
  {
    label: 'Выравнивание по левому краю',
    action: 'alignment',
    actionValue: 'left',
    icon: <AlignHorizontalLeftIcon />,
  },
  {
    label: 'Выравнивание по центру',
    action: 'alignment',
    actionValue: 'center',
    icon: <FormatAlignCenterIcon />,
  },
  {
    label: 'Выравнивание по правому краю',
    action: 'alignment',
    actionValue: 'right',
    icon: <AlignHorizontalRightIcon />,
  },
];


interface ToolbarProps {
    editor: Editor | null;
    onInsertTable?: () => void
}

const Toolbar: FC<ToolbarProps> = ({editor, onInsertTable}) => {
    const [currentHeadingLever, setCurrentHeadingLevel] = useState<Level>(0);

    const handleHeadingChange = (level: Level) => {
    if (!editor) return;

    if (level === 0) {
        editor.chain().focus().setParagraph().run(); // сброс заголовка
    } else if ([1, 2, 3, 4, 5, 6].includes(level)) {
        editor.chain().focus().toggleHeading({ level: level }).run(); // заголовки 1–6
    }
};

    const handleButtonClick = (btn: typeof TOOLBAR_CONFIG[number]) => {
        if (!editor) return;

        switch (btn.action) {
        case 'mark':
            editor.chain().focus().toggleMark(btn.actionValue!).run();
            break;

        case 'node':
            if (btn.actionValue === 'orderedList') {
                editor.chain().focus().toggleOrderedList().run();
            } else {
                editor.chain().focus().toggleBulletList().run();
            }
            break;

        //   case 'alignment':
        //     editor.chain().focus().setTextAlign(btn.actionValue!).run();
        //     break;

            case 'custom':
                if (btn.actionValue === 'insertTable') {
                        onInsertTable?.();
                }
                break;

            default:
            break;
        }
    }

    return (
        <div className='toolbar-container'>
            {
                TOOLBAR_CONFIG.map((btn) => {
                    return (
                        !btn.selectOptions ? (
                        <IconButton
                            key={btn.label}
                            title={btn.label}
                            onMouseDown={() => handleButtonClick(btn)}
                        >
                            {btn.icon}
                        </IconButton>
                        ) : (
                            <Select
                            title={btn.label}
                            key={btn.label}
                            value={currentHeadingLever}
                            sx={muiSelectStyles}
                            // sx={{
                            //     '& .MuiOutlinedInput-notchedOutline': {
                            //     border: 'none',
                            //     },
                            //     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            //     border: 'none',
                            //     },
                            // }}
                            name='headings-select' 
                                onChange={(e) => {
                                setCurrentHeadingLevel(e.target.value);
                                handleHeadingChange(e.target.value);
                            }}>
                                {
                                    btn.selectOptions.map((option, optionIndex) =>
                                        <MenuItem key={option.optionTitle} title={option.optionTitle} value={option.level}>
                                            <Typography
                                                sx={{
                                                    fontSize: `${20 - (optionIndex + 1)}px`
                                                }}
                                        >
                                            {option.optionTitle}
                                            </Typography>
                                        </MenuItem>
                                    )
                                }
                            </Select>
                        )
                    )
                })
            }
        </div>
    )
}

export default Toolbar;