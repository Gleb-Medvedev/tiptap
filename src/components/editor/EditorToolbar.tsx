import { Select, MenuItem, Typography, IconButton, Divider } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
// import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
// import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import FormatAlignJustifyOutlinedIcon from '@mui/icons-material/FormatAlignJustifyOutlined';
import FormatAlignLeftOutlinedIcon from '@mui/icons-material/FormatAlignLeftOutlined';
import FormatAlignRightOutlinedIcon from '@mui/icons-material/FormatAlignRightOutlined';
import StrikethroughSOutlinedIcon from '@mui/icons-material/StrikethroughSOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import BorderTopIcon from '@mui/icons-material/BorderTop';
import BorderBottomIcon from '@mui/icons-material/BorderBottom';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import Crop169Icon from '@mui/icons-material/Crop169';
import { Editor } from '@tiptap/react';
import { useState, type FC, type ReactNode } from 'react';
import './EditorToolbar.css'

const MUI_SELECT_STYLES = {
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& > div': {
        minWidth: '91px',
        padding: '5.75px 14px',
        '& > p': {
            color: 'rgba(0, 0, 0, .64)',
        }
    },
} as const;

type HeadingLevels = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface ToolbarButtonConfigBase {
  label: string;
  action?: 'mark' | 'node' | 'alignment' | 'custom';
  actionValue: string;
  icon: ReactNode;
  secondaryText?: string;
}

type SelectButtonConfig = {
  label: string;
  action: string;
  selectOptions: {
    optionTitle: string;
    selectType: 'heading' | 'paragraph';
    level: number;
  }[];
};

export type ToolbarButtonConfig = ToolbarButtonConfigBase | SelectButtonConfig;

export const TOOLBAR_GROUPS_CONFIG: ToolbarButtonConfig[][] = [
  // форматирование текста
  [
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
      icon: <StrikethroughSOutlinedIcon />,
    },
  ],
  // списки
  [
    {
      label: 'Нумерованный список',
      action: 'node',
      actionValue: 'orderedList',
      icon: <FormatListNumberedIcon />,
    },
    {
      label: 'Маркированный список',
      action: 'node',
      actionValue: 'bulletList',
      icon: <FormatListBulletedIcon />,
    },
  ],
  // селект с заголовками
  [
    {
      label: 'Список заголовков',
      action: 'heading',
      selectOptions: [
        { optionTitle: 'Обычный', selectType: 'paragraph', level: 0 },
        { optionTitle: 'Заголовок 1', selectType: 'heading', level: 1 },
        { optionTitle: 'Заголовок 2', selectType: 'heading', level: 2 },
        { optionTitle: 'Заголовок 3', selectType: 'heading', level: 3 },
        { optionTitle: 'Заголовок 4', selectType: 'heading', level: 4 },
        { optionTitle: 'Заголовок 5', selectType: 'heading', level: 5 },
        { optionTitle: 'Заголовок 6', selectType: 'heading', level: 6 },
      ],
    },
  ],
  // таблица
  [
    {
      label: 'Добавить таблицу',
      action: 'custom',
      actionValue: 'insertTable',
      icon: <BorderAllIcon />,
    },
  ],
  // выравнивание
  [
    {
      label: 'Выравнивание по левому краю',
      action: 'alignment',
      actionValue: 'left',
      icon: <FormatAlignLeftOutlinedIcon />,
    },
    {
      label: 'Выравнивание по центру',
      action: 'alignment',
      actionValue: 'center',
      icon: <FormatAlignJustifyOutlinedIcon />,
    },
    {
      label: 'Выравнивание по правому краю',
      action: 'alignment',
      actionValue: 'right',
      icon: <FormatAlignRightOutlinedIcon />,
    },
  ],
];

type ToolbarSecondaryButtonsConfig = Pick<ToolbarButtonConfigBase, 'label' | 'icon'>;

const TOOLBAR_SECONDARY_BUTTONS: ToolbarSecondaryButtonsConfig[] = [
  {
    icon: <HelpOutlineIcon />,
    label: 'Помощь',
  },
  {
    icon: <SettingsIcon />,
    label: 'Настройки',
  }
];

// type TableButtonsConfig = Omit<ToolbarButtonConfig>

const TOOLBAR_TABLE_BUTTONS: ToolbarButtonConfigBase[][] = [
  [
    {
      label: 'Добавить столбец слева',
      actionValue: 'addRowBefore',
      icon: <Crop169Icon sx={{ transform: 'rotate(90deg)'}} />,
      secondaryText: '+',
    },
      {
      label: 'Добавить столбец справа',
      actionValue: 'addRowAfter',
      icon: <Crop169Icon sx={{ transform: 'rotate(90deg)'}} />,
      secondaryText: '+',
    },
      {
      label: 'Удалить выделенный столбец',
      actionValue: 'addRowBefore',
      icon: <Crop169Icon sx={{ transform: 'rotate(90deg)'}} />,
      secondaryText: '-',
    },
  ],
  [
        {
      label: 'Добавить строку сверху',
      actionValue: 'addRowBefore',
      icon: <Crop169Icon />,
      secondaryText: '+',
    },
      {
      label: 'Добавить строку снизу',
      actionValue: 'addRowAfter',
      icon: <Crop169Icon />,
      secondaryText: '+',
    },
      {
      label: 'Удалить выделенную строку',
      actionValue: 'addRowBefore',
      icon: <Crop169Icon />,
      secondaryText: '-',
    },
  ],
  [
    {
      label: 'Удалить текущую страницу',
      actionValue: 'CHTO-to',
      icon: <PlaylistRemoveIcon />,
    }
  ]
]




  // const handleTableCellAction = (action: any) => {
  //   switch (action) {
  //     case 'add-column-left':
  //       editor?.chain().focus().addColumnBefore().run();
  //       break;
  //     case 'add-column-right':
  //       editor?.chain().focus().addColumnAfter().run();
  //       break;
  //     case 'add-row-top':
  //       editor?.chain().focus().addRowBefore().run();
  //       break;
  //     case 'add-row-bottom':
  //       editor?.chain().focus().addRowAfter().run();
  //       break;
  //   }
  // };





interface ToolbarProps {
    editor: Editor | null;
    onInsertTable?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({editor, onInsertTable}) => {
    const [currentHeadingLever, setCurrentHeadingLevel] = useState<HeadingLevels>(0);

    const handleHeadingChange = (level: HeadingLevels) => {
    if (!editor) return;

    if (level === 0) {
        editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: level }).run();
    }
};

const handleButtonClick = (btn: ToolbarButtonConfig) => {
  if (!editor) return;

  if ('selectOptions' in btn) return;

  const actionValue = btn.actionValue;

  switch (btn.action) {
    case 'mark':
      editor.chain().focus().toggleMark(actionValue).run();
      break;

    case 'node':
      if (actionValue === 'orderedList') {
        editor.chain().focus().toggleOrderedList().run();
      } else {
        editor.chain().focus().toggleBulletList().run();
      }
      break;

    case 'alignment':
      editor.chain().focus().setTextAlign(actionValue).run();
      break;

    case 'custom':
      if (actionValue === 'insertTable') {
        onInsertTable?.();
      }
      break;

    default:
      break;
  }
};

    return (
        <div className='toolbar-container'>
          <div className='editor-toolbar__buttons-container'>
              {TOOLBAR_GROUPS_CONFIG.map((group, groupIndex: number) => (
              <ul key={`Group-${groupIndex}`} className='toolbar-group' style={{ marginRight: groupIndex === TOOLBAR_GROUPS_CONFIG.length -1 ? '40px' : 'unset' }}>
                {group.map((btnConfig, configIndex: number) => (
                  <li key={`Btn-${configIndex}`} className='toolbar-group__item'>
                    {'selectOptions' in btnConfig ? (
                      <Select
                        title={btnConfig.label}
                        value={currentHeadingLever}
                        sx={MUI_SELECT_STYLES}
                        name='headings-select'
                        onChange={(e) => {
                          setCurrentHeadingLevel(e.target.value);
                          handleHeadingChange(e.target.value);
                        }}
                      >
                        {btnConfig.selectOptions.map((option, optionIndex) => (
                          <MenuItem
                            key={option.optionTitle}
                            title={option.optionTitle}
                            value={option.level}
                          >
                            <Typography sx={{ fontSize: `${20 - (optionIndex + 1)}px` }}>
                              {option.optionTitle}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <IconButton
                        title={btnConfig.label}
                        onMouseDown={() => handleButtonClick(btnConfig)}
                      >
                        {btnConfig.icon}
                      </IconButton>
                    )}
                  </li>
                ))}
                {groupIndex !== TOOLBAR_GROUPS_CONFIG.length - 1 && <Divider orientation='vertical' flexItem sx={{ opacity: .6, backgroundColor: '#666' }} />}
              </ul>
          ))}
          </div>
          <Divider />
          <div className='secondary-buttons-container'>
            <ul className='secondary-buttons__list'>
            {TOOLBAR_SECONDARY_BUTTONS.map((secondaryButton, index) =>
              <li key={`Secondary-button-${index}`} className='secondary-buttons__list-item'>
                <IconButton
                  title={secondaryButton.label}
                >
                  {secondaryButton.icon}
                </IconButton>
              </li>
            )}
            </ul>
          </div>

          <div className='table-buttons-container'>
            {/* <ul className="table-buttons__list"> */}
              {TOOLBAR_TABLE_BUTTONS.map((buttonGroup, groupIndex) => (
                <ul key={`Table-group-${groupIndex}`} className="table-buttons__list">
                  {buttonGroup.map((buttonConfig, index) => (
                    <li key={`Table-button-${index}`} className='secondary-buttons__list-item'>
                      <IconButton
                        title={buttonConfig.label}
                      >
                        <span>{buttonConfig.secondaryText}{buttonConfig.icon}</span>
                      </IconButton>
                    </li>
                  ))}
                  {groupIndex !== TOOLBAR_GROUPS_CONFIG.length - 1 && <Divider orientation='vertical' flexItem sx={{ opacity: .6, backgroundColor: '#666' }} />}
                </ul>
              ) )}
            {/* </ul> */}
          </div>
        </div>
    )
}

export default Toolbar;