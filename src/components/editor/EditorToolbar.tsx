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
import AddIcon from '@mui/icons-material/Add';
import Crop169Icon from '@mui/icons-material/Crop169';
import { Editor } from '@tiptap/react';
import { useState, type FC, type ReactNode } from 'react';
import './EditorToolbar.css'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GridOffOutlinedIcon from '@mui/icons-material/GridOffOutlined';
import ToolbarButtonTooltip from './ButtonsTooltip';

const MUI_TOOLBAR_BTNS_STYLES = (isActive: boolean) => ({
  backgroundColor: isActive ? 'blue' : 'transparent',
  color: isActive ? 'white' : 'default',
});

const MUI_TABLE_BTNS_STYLES = {
  fontSize: 'medium',
} as const;

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
  keyCommand?: string,
  action?: 'mark' | 'node' | 'alignment' | 'custom';
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

export const TOOLBAR_GROUPS_CONFIG: ToolbarButtonConfig[][] = [
  // форматирование текста
  [
    {
      label: 'Жирный текст',
      keyCommand: 'B',
      action: 'mark',
      actionValue: 'bold',
      icon: <FormatBoldIcon />,
    },
    {
      label: 'Курсив',
      keyCommand: 'I',
      action: 'mark',
      actionValue: 'italic',
      icon: <FormatItalicIcon />,
    },
    {
      label: 'Подчёркнутый текст',
      keyCommand: 'U',
      action: 'mark',
      actionValue: 'underline',
      icon: <FormatUnderlinedIcon />,
    },
    {
      label: 'Зачеркнутый текст',
      keyCommand: 'S',
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
    icon: <HelpOutlineIcon cursor={'help'}/>,
    label: 'Помощь',
  },
  {
    icon: <SettingsIcon />,
    label: 'Настройки',
  }
];

interface ToolbarTableBtnsConfig extends ToolbarButtonConfigBase {
  additionalIcon?: ReactNode,
}

export type TableCellAction =
  | 'add-column-left'
  | 'add-column-right'
  | 'delete-column'
  | 'add-row-top'
  | 'add-row-bottom'
  | 'delete-row'
  | 'delete-table';

const TOOLBAR_TABLE_BUTTONS: ToolbarTableBtnsConfig[][] = [
  [
    {
      label: 'Добавить столбец слева',
      actionValue: 'add-column-left',
      icon: <Crop169Icon />,
      additionalIcon: <AddIcon sx={MUI_TABLE_BTNS_STYLES} />,
    },
      {
      label: 'Добавить столбец справа',
      actionValue: 'add-column-right',
      icon: <Crop169Icon />,
      additionalIcon: <AddIcon sx={MUI_TABLE_BTNS_STYLES} />,
    },
      {
      label: 'Удалить выделенный столбец',
      actionValue: 'delete-column',
      icon: <Crop169Icon />,
      additionalIcon: <CloseOutlinedIcon />,
    },
  ],
  [
        {
      label: 'Добавить строку сверху',
      actionValue: 'add-row-top',
      icon: <Crop169Icon />,
      additionalIcon: <AddIcon sx={MUI_TABLE_BTNS_STYLES} />,
    },
      {
      label: 'Добавить строку снизу',
      actionValue: 'add-row-bottom',
      icon: <Crop169Icon />,
      additionalIcon: <AddIcon sx={MUI_TABLE_BTNS_STYLES} />,
    },
      {
      label: 'Удалить выделенную строку',
      actionValue: 'delete-row',
      icon: <Crop169Icon />,
      additionalIcon: <CloseOutlinedIcon />,
    },
  ],
  [
    {
      label: 'Удалить текущую таблицу',
      actionValue: 'delete-table',
      icon: <GridOffOutlinedIcon />,
    }
  ]
];

interface ToolbarProps {
    editor: Editor | null;
    onInsertTable?: () => void;
    onClickCellAction?: (actionValue: TableCellAction) => void;
}

const Toolbar: FC<ToolbarProps> = ({editor, onInsertTable, onClickCellAction}) => {
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

  const renderTableBtnIcon = (tableGroupIndex: number, btnConfig: ToolbarTableBtnsConfig, tableBtnIndex: number) => {
    return (
        <span className='table-button__inner-wrapper'>
          <span className='table-button__icon-container' style={{transform: tableGroupIndex === 0 ? 'rotate(90deg)' : 'unset'}}>
            {btnConfig.icon}
          </span>

          {tableGroupIndex === 0 && btnConfig.additionalIcon && <span className='table-button__secondary-text' style={{color: editor?.isActive('table') ? tableBtnIndex !== 2 ? 'green' : 'red' : '#666', left: tableBtnIndex === 0 ? '20%' : tableBtnIndex !== 2 ? '80%' : '50%', top: tableBtnIndex === 2 ? '55%' : '50%' }}>{btnConfig.additionalIcon}</span>}
          {tableGroupIndex === 1 && btnConfig.additionalIcon && <span className='table-button__secondary-text' style={{color: editor?.isActive('table') ? tableBtnIndex !== 2 ? 'green' : 'red' : '#666', top: tableBtnIndex === 0 ? '20%' : tableBtnIndex !== 2 ? '80%' : '55%' }}>{btnConfig.additionalIcon}</span>}
      </span>
    )
  }

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
            {TOOLBAR_SECONDARY_BUTTONS.map((secondaryButton, index) =>
              <li key={`Secondary-button-${index}`} className='secondary-buttons__list-item'>
                <ToolbarButtonTooltip {...secondaryButton}>
                  <IconButton
                    disableRipple
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
                          onClick={() => onClickCellAction!(buttonConfig.actionValue as TableCellAction)}
                          disabled={!editor?.isActive('table')}
                          disableRipple
                        >
                        {renderTableBtnIcon(groupIndex, buttonConfig, btnIndex)}
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