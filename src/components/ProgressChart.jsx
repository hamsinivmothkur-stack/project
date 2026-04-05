import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export const SubjectProgressChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Add subjects and topics to see progress</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
        <YAxis stroke="var(--text-muted)" fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="completed" name="Completed" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
        <Bar dataKey="total" name="Total" fill="var(--bg-tertiary)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CompletionDonut = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const completedPercentage = total > 0 ? Math.round((data[0]?.value / total) * 100) : 0;

  return (
    <div className="donut-wrapper">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="donut-center">
        <span className="donut-center__value">{completedPercentage}%</span>
        <span className="donut-center__label">Complete</span>
      </div>
    </div>
  );
};

export const WeeklyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-empty">Complete tasks to see weekly productivity</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
        <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="completed"
          name="Tasks Completed"
          stroke="var(--accent)"
          strokeWidth={3}
          dot={{ r: 5, fill: 'var(--accent)' }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
