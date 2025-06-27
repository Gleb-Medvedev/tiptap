import { useState, type FC } from 'react';
import './EditorTableSizePicker.css';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

interface TableGridSizePickerPopupProps {
  onSelect: (rows: number, cols: number) => void;
  onClose: () => void;
}

const TableGridSizePickerPopup: FC<TableGridSizePickerPopupProps> = ({ onSelect, onClose }) => {
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });

  return (
    <div
      className='editor-table-picker'
      onMouseLeave={onClose}
    >
      <div className='editor-table-picker__grid-size'>
        <span className='editor-table-picker__grid-size-text'>Размер таблицы: {gridSize.cols} <ClearOutlinedIcon fontSize='small' color='primary' /> {gridSize.rows}</span>
      </div>
      <div className='editor-table-picker__grid'>
        {Array.from({ length: 100 }).map((_, i) => {
          const x = (i % 10) + 1;
          const y = Math.floor(i / 10) + 1;
          const isActive = x <= gridSize.cols && y <= gridSize.rows;

          return (
            <div
              key={i}
              onMouseEnter={() => setGridSize({ cols: x, rows: y })}
              onClick={() => {
                onSelect(y, x);
                onClose();
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
  );
};

export default TableGridSizePickerPopup;
