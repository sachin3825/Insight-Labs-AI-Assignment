import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartMessageProps {
  content: { date: string; price: number }[];
}

export const ChartMessage = ({ content }: ChartMessageProps) => {
  const formatIndianNumber = (num: number): string => {
    if (num >= 1e7) return `${(num / 1e7).toFixed(2)}Cr`;
    if (num >= 1e5) return `${(num / 1e5).toFixed(2)}L`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  return (
    <div className="w-full  h-64 mt-2 min-w-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={content}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            fontSize={12}
            tick={{ fill: "#94a3b8" }}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickFormatter={(value) => `₹${formatIndianNumber(value)}`}
          />
          <Tooltip
            formatter={(value: number) => [
              `₹${formatIndianNumber(value)}`,
              "Price",
            ]}
            labelFormatter={(label) => `Date: ${label}`}
            labelStyle={{ color: "#f1f5f9" }}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
              color: "#f1f5f9",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="url(#gradient)"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
