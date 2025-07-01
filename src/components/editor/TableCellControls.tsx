import { type FC } from "react";
import './TableCellControls.css';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import type { TableCellAction } from "./EditorToolbar";
import ToolbarButtonTooltip from "./ButtonsTooltip";

const MUI_BTN_STYLES = {
    fontSize: '24px',
}

interface TableCellControlsProps {
  position: { top: number; left: number; width: number; height: number } | null;
  addTableElemOnCLick: (addAction: TableCellAction) => void;
}

const TableCellControls: FC<TableCellControlsProps> = ({position, addTableElemOnCLick}) => {

    return (
        <>
            <div className="table-cell-btn table-cell-btn_left" style={{top: position?.top! + (position?.height! / 2), left: position?.left}} onMouseDown={() => addTableElemOnCLick('add-column-left')} >
                <ToolbarButtonTooltip label='Добавить столбец слева'><div className="table-cell__btn-container"><AddCircleOutlinedIcon sx={MUI_BTN_STYLES}/></div></ToolbarButtonTooltip>
            </div>
            <div className="table-cell-btn table-cell-btn_right" style={{top: position?.top! + (position?.height! / 2), left: position?.left! + position?.width!}} onMouseDown={() => addTableElemOnCLick('add-column-right')}>
                <ToolbarButtonTooltip label="Добавить столбец справа"><div className="table-cell__btn-container"><AddCircleOutlinedIcon sx={MUI_BTN_STYLES}/></div></ToolbarButtonTooltip>
            </div>
            <div className="table-cell-btn table-cell-btn_top" style={{top: position?.top!, left: position?.left! + (position?.width! / 2)}} onMouseDown={() => addTableElemOnCLick('add-row-top')}>
                <ToolbarButtonTooltip label="Добавить строку сверху"><div className="table-cell__btn-container"><AddCircleOutlinedIcon sx={MUI_BTN_STYLES}/></div></ToolbarButtonTooltip>
            </div>
            <div className="table-cell-btn table-cell-btn_bottom" style={{top: position?.top! + position?.height!, left: position?.left! + (position?.width! / 2)}} onMouseDown={() => addTableElemOnCLick('add-row-bottom')}>
                <ToolbarButtonTooltip label="Добавить строку снизу"><div className="table-cell__btn-container"><AddCircleOutlinedIcon sx={MUI_BTN_STYLES}/></div></ToolbarButtonTooltip>
            </div>
        </>
    )
}

export default TableCellControls;