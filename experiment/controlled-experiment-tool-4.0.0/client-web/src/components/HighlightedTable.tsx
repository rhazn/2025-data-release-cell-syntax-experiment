import { useEffect, useState } from "react";

interface HighlightedTableProps {
  showHeader: boolean;
  editable?: boolean;
  header: string[];
  data: (string | number)[][];
  highlightStart?: number[];
  highlightEnd?: number[];
  onHighlightChange?: (highlightedCells: number[][]) => void;
}

export const HighlightedTable: React.FC<HighlightedTableProps> = ({
  showHeader,
  editable,
  header,
  data,
  highlightStart,
  highlightEnd,
  onHighlightChange,
}: HighlightedTableProps) => {
  const [isMousedown, setIsMouseDown] = useState<boolean>(false);
  // Array of [row, col] pairs
  const [highlightedCells, setHighlightedCells] = useState<number[][]>([]);

  useEffect(() => {
    if (onHighlightChange) {
      onHighlightChange(highlightedCells);
    }
  }, [highlightedCells, onHighlightChange]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMouseDown(false);
    };
    const handleMouseDown = () => {
      setIsMouseDown(true);
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    const initiallyHighlightedCells = [];

    if (highlightStart && highlightEnd) {
      for (
        let rowIndex = highlightStart[0];
        rowIndex <= highlightEnd[0];
        rowIndex++
      ) {
        for (
          let columnIndex = highlightStart[1];
          columnIndex <= highlightEnd[1];
          columnIndex++
        ) {
          initiallyHighlightedCells.push([rowIndex, columnIndex]);
        }
      }
    }

    setHighlightedCells(initiallyHighlightedCells);
  }, [highlightStart, highlightEnd]);

  const shouldBeHighlighted = (
    rowIndex: number,
    columnIndex: number
  ): boolean => {
    return Boolean(
      highlightedCells.find(
        (cell) => cell[0] === rowIndex && cell[1] === columnIndex
      )
    );
  };

  const onCellToggle = (rowIndex: number, columnIndex: number) => {
    if (!editable) {
      return;
    }

    if (shouldBeHighlighted(rowIndex, columnIndex)) {
      setHighlightedCells(
        highlightedCells.filter(
          (cell) => cell[0] !== rowIndex || cell[1] !== columnIndex
        )
      );
    } else {
      setHighlightedCells([...highlightedCells, [rowIndex, columnIndex]]);
    }
  };

  const onMouseEnter = (rowIndex: number, columnIndex: number) => {
    if (!isMousedown) {
      return;
    }
    onCellToggle(rowIndex, columnIndex);
  };

  const onMouseLeave = (rowIndex: number, columnIndex: number) => {
    if (!isMousedown) {
      return;
    }
    onCellToggle(rowIndex, columnIndex);
  };

  return (
    <>
      <table
        className={`table-fixed w-full border border-solid border-black p-2 border-collapse select-none ${
          editable ? "cursor-pointer" : ""
        }`}
      >
        {showHeader && (
          <thead>
            <tr className="border border-solid border-black p-1">
              {header.map((header) => (
                <td className="border border-solid border-black p-1">
                  {header}
                </td>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={`${row}`}>
              {row.map((value, columnIndex) => (
                <td
                  key={`${rowIndex}+${columnIndex}`}
                  onMouseDown={() => onCellToggle(rowIndex, columnIndex)}
                  onMouseEnter={() => onMouseEnter(rowIndex, columnIndex)}
                  onMouseLeave={() => onMouseLeave(rowIndex, columnIndex)}
                  className={`${
                    shouldBeHighlighted(rowIndex, columnIndex)
                      ? "bg-blue-300"
                      : ""
                  } border border-solid border-black p-1 overflow-hidden`}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
