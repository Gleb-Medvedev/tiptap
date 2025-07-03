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
import { Editor } from '@tiptap/react';
import { useState, type FC, type ReactNode } from 'react';
import './EditorToolbar.css'
import ToolbarButtonTooltip from './ButtonsTooltip';
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import FormatQuoteOutlinedIcon from '@mui/icons-material/FormatQuoteOutlined';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import PlaylistRemoveOutlinedIcon from '@mui/icons-material/PlaylistRemoveOutlined';

const MUI_TOOLBAR_BTNS_STYLES = (isActive: boolean) => ({
  backgroundColor: isActive ? 'blue' : 'transparent',
  color: isActive ? 'white' : 'default',
});

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

type ToolbarButtonActionValues = 'mark' | 'node' | 'alignment' | 'custom';

export interface ToolbarButtonConfigBase {
  label: string;
  additionalInfo?: string,
  action?: ToolbarButtonActionValues;
  actionValue: string;
  icon: ReactNode;
}

type SelectOptionConfig = {
  label: string;
  action: string;
  selectOptions: {
    optionTitle: string;
    selectType: 'heading' | 'paragraph';
    level: number;
  }[];
};

export type ToolbarButtonConfig = ToolbarButtonConfigBase | SelectOptionConfig;

const TOOLBAR_GROUPS_CONFIG: ToolbarButtonConfig[][] = [
  // форматирование текста
  [
    {
      label: 'Жирный текст',
      additionalInfo: 'CTRL + B',
      action: 'mark',
      actionValue: 'bold',
      icon: <FormatBoldIcon />,
    },
    {
      label: 'Курсив',
      additionalInfo: 'CTRL + I',
      action: 'mark',
      actionValue: 'italic',
      icon: <FormatItalicIcon />,
    },
    {
      label: 'Подчёркнутый текст',
      additionalInfo: 'CTRL + U',
      action: 'mark',
      actionValue: 'underline',
      icon: <FormatUnderlinedIcon />,
    },
    {
      label: 'Зачеркнутый текст',
      additionalInfo: 'CTRL + Shift + S',
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
  //Цитата
  [
    {
      label: 'Цитата',
      action: 'node',
      actionValue: 'blockquote',
      icon: <FormatQuoteOutlinedIcon />,
      additionalInfo: 'CTRL + SHIFT + B'
    }
  ],
  //Ссылка и картинка
  [
    {
      label: 'Ссылка',
      action: 'mark',
      actionValue: 'link',
      additionalInfo: 'CTRL + SHIFT + L',
      icon: <LinkOutlinedIcon />,
    },
    {
      label: 'Изображение',
      action: 'node',
      actionValue: 'image',
      additionalInfo: 'CTRL + M',
      icon: <ImageOutlinedIcon />,
    },
  ],
  //Код
  [
    {
      label: 'Однострочный код',
      action: 'mark',
      actionValue: 'code',
      additionalInfo: 'пока хз',
      icon: <CodeOutlinedIcon />,
    },
    {
      label: 'Многострочный код',
      action: 'node',
      actionValue: 'codeBlock',
      additionalInfo: 'тоже хз',
      icon: <DataObjectOutlinedIcon />,
    }
  ]
];

type ToolbarSecondaryButtonsConfig = Omit<ToolbarButtonConfigBase, 'actionValue'> & {actionValue?: string};

const TOOLBAR_SECONDARY_BUTTONS: ToolbarSecondaryButtonsConfig[] = [
  {
    icon: <DrawOutlinedIcon />,
    label: 'Редактор диаграмм',
    additionalInfo: 'Откроется поверх окна',
    action: 'custom',
    actionValue: 'openModal',
  },
  {
    icon: <HelpOutlineIcon cursor={'help'}/>,
    label: 'Помощь',
  },
  {
    icon: <SettingsIcon />,
    label: 'Настройки',
  },
];

export type TableCellActions =
  | 'add-column-left'
  | 'add-column-right'
  | 'delete-column'
  | 'add-row-top'
  | 'add-row-bottom'
  | 'delete-row'
  | 'delete-table';

  const addColLeftTableIcon =
    <svg viewBox="-4 -4 24 24" focusable="false" aria-hidden="true">
      <rect width="16" height="16" fill="transparent" />
      <path fill="currentColor" id="table-add-column" d="M12,11l-0,2l2,0l-0,-2l2,0l-0,-2l-2,0l-0,-2l-2,0l-0,2l-2,0l-0,2l2,0Zm2,-5l-0,-5c0,-0.265 -0.105,-0.52 -0.293,-0.707c-0.187,-0.188 -0.442,-0.293 -0.707,-0.293l-10,-0c-0.552,-0 -1,0.448 -1,1c-0,2.577 -0,11.423 0,14c0,0.552 0.448,1 1,1c1.916,0 8.084,0 10,0c0.552,-0 1,-0.448 1,-1l-0,-1l-5,0l-0,-12l3,0l-0,4l2,0Zm-10,-4l3,0l-0,12l-3,0l-0,-12Z"/>
    </svg>

  const addColRightTableIcon =
    <svg viewBox="-4 -4 24 24" focusable="false" aria-hidden="true" style={{transform: 'scaleX(-1)'}}>
      <rect width="16" height="16" fill="transparent" />
      <path fill="currentColor" id="table-add-column" d="M12,11l-0,2l2,0l-0,-2l2,0l-0,-2l-2,0l-0,-2l-2,0l-0,2l-2,0l-0,2l2,0Zm2,-5l-0,-5c0,-0.265 -0.105,-0.52 -0.293,-0.707c-0.187,-0.188 -0.442,-0.293 -0.707,-0.293l-10,-0c-0.552,-0 -1,0.448 -1,1c-0,2.577 -0,11.423 0,14c0,0.552 0.448,1 1,1c1.916,0 8.084,0 10,0c0.552,-0 1,-0.448 1,-1l-0,-1l-5,0l-0,-12l3,0l-0,4l2,0Zm-10,-4l3,0l-0,12l-3,0l-0,-12Z"/>
    </svg>

  const deleteRowTableIcon =
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1z" stroke-width="2"/>
      <path d="M10 16l4 4"/><path d="M10 20l4 -4"/>
    </svg>

  const addRowTopTableIcon =
    <svg viewBox="-4 -4 24 24" focusable="false" aria-hidden="true" style={{transform: 'rotate(-90deg)'}}>
      <rect width="16" height="16" fill="transparent" />
      <path fill="currentColor" id="table-add-column" d="M12,11l-0,2l2,0l-0,-2l2,0l-0,-2l-2,0l-0,-2l-2,0l-0,2l-2,0l-0,2l2,0Zm2,-5l-0,-5c0,-0.265 -0.105,-0.52 -0.293,-0.707c-0.187,-0.188 -0.442,-0.293 -0.707,-0.293l-10,-0c-0.552,-0 -1,0.448 -1,1c-0,2.577 -0,11.423 0,14c0,0.552 0.448,1 1,1c1.916,0 8.084,0 10,0c0.552,-0 1,-0.448 1,-1l-0,-1l-5,0l-0,-12l3,0l-0,4l2,0Zm-10,-4l3,0l-0,12l-3,0l-0,-12Z"/>
    </svg>

  const addRowBottomTableIcon =
    <svg viewBox="-4 -4 24 24" focusable="false" aria-hidden="true" style={{transform: 'rotate(90deg)'}}>
      <rect width="16" height="16" fill="transparent" />
      <path fill="currentColor" id="table-add-column" d="M12,11l-0,2l2,0l-0,-2l2,0l-0,-2l-2,0l-0,-2l-2,0l-0,2l-2,0l-0,2l2,0Zm2,-5l-0,-5c0,-0.265 -0.105,-0.52 -0.293,-0.707c-0.187,-0.188 -0.442,-0.293 -0.707,-0.293l-10,-0c-0.552,-0 -1,0.448 -1,1c-0,2.577 -0,11.423 0,14c0,0.552 0.448,1 1,1c1.916,0 8.084,0 10,0c0.552,-0 1,-0.448 1,-1l-0,-1l-5,0l-0,-12l3,0l-0,4l2,0Zm-10,-4l3,0l-0,12l-3,0l-0,-12Z"/>
    </svg>

  const deleteColTableIcon =
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{transform: 'rotate(-90deg)'}}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 6v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1z" stroke-width="2"/>
      <path d="M10 16l4 4"/><path d="M10 20l4 -4"/>
    </svg>

const TOOLBAR_TABLE_BUTTONS: ToolbarButtonConfigBase[][] = [
  [
    {
      label: 'Добавить столбец слева',
      actionValue: 'add-column-left',
      icon: addColRightTableIcon,
    },
      {
      label: 'Добавить столбец справа',
      actionValue: 'add-column-right',
      icon: addColLeftTableIcon,
    },
      {
      label: 'Удалить выделенный столбец',
      actionValue: 'delete-column',
      icon: deleteColTableIcon,
    },
  ],
  [
    {
      label: 'Добавить строку сверху',
      actionValue: 'add-row-top',
      icon: addRowTopTableIcon,
    },
      {
      label: 'Добавить строку снизу',
      actionValue: 'add-row-bottom',
      icon: addRowBottomTableIcon,
    },
      {
      label: 'Удалить выделенную строку',
      actionValue: 'delete-row',
      icon: deleteRowTableIcon,
    },
  ],
  [
    {
      label: 'Удалить выделенную таблицу',
      actionValue: 'delete-table',
      icon: <PlaylistRemoveOutlinedIcon />,
    }
  ]
];

interface ToolbarProps {
    editor: Editor | null;
    onInsertTable?: () => void;
    onClickCellAction?: (actionValue: TableCellActions) => void;
    onCLickCloseModal?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({editor, onInsertTable, onClickCellAction, onCLickCloseModal}) => {
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
      if (actionValue === 'link') {
        const linkUrl = window.prompt('Введите ссылку');
        if (!linkUrl) return;
          setTimeout(() => {
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: linkUrl })
              .run();
          }, 0);
      }
      editor.chain().focus().toggleMark(actionValue).run();
      break;

    case 'node':
      if (actionValue === 'orderedList') {
        editor.chain().focus().toggleOrderedList().run();
      } else if (actionValue === 'bulletList') {
        editor.chain().focus().toggleBulletList().run();
      } else if (actionValue === 'blockquote') {
        editor.chain().focus().toggleBlockquote().run();
      } else if (actionValue === 'codeBlock') {
        editor.chain().focus().toggleCodeBlock().run();
      } else if (actionValue === 'image') {
        const imageUrl = window.prompt('Введите ссылку на изображение');
        if (!imageUrl) return;
        editor.chain().focus().setImage({ src: imageUrl }).run();
        return; // ← важно
      }
      break;

    case 'alignment':
      editor.chain().focus().setTextAlign(actionValue).run();
      break;

    case 'custom':
      if (actionValue === 'insertTable') {
        onInsertTable?.();
      } else if (actionValue === 'openModal') {
        onCLickCloseModal?.();
      }
      break;

    default:
      break;
  }
};

    return (
        <div className='toolbar-container'>
          <div className='editor-toolbar__buttons-container'>
              {TOOLBAR_GROUPS_CONFIG.map((group: ToolbarButtonConfig[], groupIndex: number) => (
              <ul key={`Group-${groupIndex}`} className='toolbar-group' style={{ marginRight: groupIndex === TOOLBAR_GROUPS_CONFIG.length -1 ? '40px' : 'unset' }}>
                {group.map((btnConfig: ToolbarButtonConfig, configIndex: number) => {
                  const isActive = (() => {
                    if (!editor || !('actionValue' in btnConfig)) return false;

                    switch (btnConfig.action) {
                      case 'mark':
                        return editor.isActive(btnConfig.actionValue);
                      case 'node':
                        return editor.isActive(btnConfig.actionValue);
                      case 'alignment':
                        return editor.isActive({ textAlign: btnConfig.actionValue });
                      default:
                        return false;
                    }
                  })();                  

                  return (
                    <li key={`Btn-${configIndex}`} className='toolbar-group__item'>
                    {'selectOptions' in btnConfig ? (
                      <ToolbarButtonTooltip {...btnConfig}>
                        <Select
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
                            disableRipple
                          >
                            <Typography sx={{ fontSize: `${20 - (optionIndex + 1)}px` }}>
                              {option.optionTitle}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                      </ToolbarButtonTooltip>
                    ) : (
                      <ToolbarButtonTooltip {...btnConfig}>
                        <IconButton
                          onMouseDown={() => handleButtonClick(btnConfig)}
                          disableRipple
                          sx={MUI_TOOLBAR_BTNS_STYLES(isActive)}
                        >
                        {btnConfig.icon}
                      </IconButton>
                      </ToolbarButtonTooltip>
                    )}
                  </li>
                  )
                }
                )}
                {groupIndex !== TOOLBAR_GROUPS_CONFIG.length - 1 && <Divider orientation='vertical' flexItem sx={{ opacity: .6, backgroundColor: '#666' }} />}
              </ul>
          ))}
          </div>
          <Divider />
          <div className='secondary-buttons-container'>
            <ul className='secondary-buttons__list'>
            {TOOLBAR_SECONDARY_BUTTONS.map((secondaryButton, index: number) =>
              <li key={`Secondary-button-${index}`} className='secondary-buttons__list-item'>
                <ToolbarButtonTooltip {...secondaryButton}>
                  <IconButton
                    disableRipple
                    // todo пофиксить типы
                    onMouseDown={() => handleButtonClick(secondaryButton as ToolbarButtonConfig)}
                  >
                  {secondaryButton.icon}
                </IconButton>
                </ToolbarButtonTooltip>
              </li>
            )}
            </ul>
          </div>

          <div className='table-buttons-container'>
              {TOOLBAR_TABLE_BUTTONS.map((buttonGroup, groupIndex) => (
                <ul key={`Table-group-${groupIndex}`} className="table-buttons__list">
                  {buttonGroup.map((buttonConfig, btnIndex) => (
                    <li key={`Table-button-${btnIndex}`} className='secondary-buttons__list-item'>
                      <ToolbarButtonTooltip {...buttonConfig}>
                          <IconButton
                            onClick={() => onClickCellAction!(buttonConfig.actionValue as TableCellActions)}
                            disabled={!editor?.isActive('table')}
                            disableRipple
                          >
                            {/* {renderTableBtnIcon(groupIndex, buttonConfig, btnIndex)} */}
                            <span className='table-button__inner-wrapper'>
                              {buttonConfig.icon}
                            </span>
                          </IconButton>
                      </ToolbarButtonTooltip>
                    </li>
                  ))}
                  {groupIndex !== TOOLBAR_TABLE_BUTTONS.length - 1 && <Divider orientation='vertical' flexItem sx={{ opacity: .6, backgroundColor: '#666' }} />}
                </ul>
              ) )}
          </div>
        </div>
    )
}

export default Toolbar;