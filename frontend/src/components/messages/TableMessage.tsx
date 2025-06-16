interface TableMessageProps {
  content: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export const TableMessage = ({ content }: TableMessageProps) => {
  const { headers, rows } = content;

  // Sort by first column ("Rank") if it's a number
  const sortedRows = [...rows].sort((a, b) => {
    const rankA = typeof a[0] === "number" ? a[0] : Number.MAX_SAFE_INTEGER;
    const rankB = typeof b[0] === "number" ? b[0] : Number.MAX_SAFE_INTEGER;
    return rankA - rankB;
  });

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-600">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="text-left py-2 px-3 font-semibold text-white dark:text-slate-300 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-600/20 dark:hover:bg-slate-600/20 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-2 px-3 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
