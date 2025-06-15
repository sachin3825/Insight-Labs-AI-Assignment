
interface TableMessageProps {
  content: {
    columns: string[];
    rows: Record<string, any>[];
  };
}

export const TableMessage = ({ content }: TableMessageProps) => {
  const { columns, rows } = content;

  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-600">
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="text-left py-2 px-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-600/20 dark:hover:bg-slate-600/20 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex}
                    className="py-2 px-3 whitespace-nowrap"
                  >
                    <span className={`
                      ${column === '24h Change' 
                        ? row[column]?.startsWith('+') 
                          ? 'text-green-600 dark:text-green-400' 
                          : row[column]?.startsWith('-')
                          ? 'text-red-600 dark:text-red-400'
                          : ''
                        : ''
                      }
                    `}>
                      {row[column]}
                    </span>
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
