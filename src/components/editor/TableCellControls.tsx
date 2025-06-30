import { type FC } from "react";
import './TableCellControls.css';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import type { TableCellAction } from "./EditorToolbar";

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
            <div className="table-cell-btn table-cell-btn_left" style={{top: position?.top! + (position?.height! / 2), left: position?.left}} onMouseDown={() => addTableElemOnCLick('add-column-left')} title='Добавить столбец слева'>
                <div className="table-cell__btn-container"><AddCircleOutlinedIcon sx={MUI_BTN_STYLES}/></div>
            </div>
            <div className="table-cell-btn table-cell-btn_right" style={{top: position?.top! + (position?.height! / 2), left: position?.left! + position?.width!}} onMouseDown={() => addTableElemOnCLick('add-column-right')} title='Добавить столбец справа'>
                <div className="table-cell__btn-container"><AddCircleOutlinedIcon sx={MUI_BTN_STYLES}/></div>
            </div>
            <div className="table-cell-btn table-cell-btn_top" style={{top: position?.top!, left: position?.left! + (position?.width! / 2)}} onMouseDown={() => addTableElemOnCLick('add-row-top')} title='Добавить строку сверху'>
                <div className="table-cell__btn-container"><AddCircleOutlinedIcon sx={MUI_BTN_STYLES}/></div>
            </div>
            <div className="table-cell-btn table-cell-btn_bottom" style={{top: position?.top! + position?.height!, left: position?.left! + (position?.width! / 2)}} onMouseDown={() => addTableElemOnCLick('add-row-bottom')} title='Добавить строку снизу'>
                <div className="table-cell__btn-container"><AddCircleOutlinedIcon sx={MUI_BTN_STYLES}/></div>
            </div>
        </>
    )
}

export default TableCellControls;