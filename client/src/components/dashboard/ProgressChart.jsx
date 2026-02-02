
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Example progress data
const data = [
	{ name: 'Week 1', progress: 20 },
	{ name: 'Week 2', progress: 35 },
	{ name: 'Week 3', progress: 50 },
	{ name: 'Week 4', progress: 65 },
	{ name: 'Week 5', progress: 80 },
	{ name: 'Week 6', progress: 90 },
];

const ProgressChart = () => (
	<div style={{ width: '100%', height: 300 }}>
		<h3>Progress Over Time</h3>
		<ResponsiveContainer width="100%" height="85%">
			<LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis domain={[0, 100]} />
				<Tooltip />
				<Line type="monotone" dataKey="progress" stroke="#8884d8" strokeWidth={2} />
			</LineChart>
		</ResponsiveContainer>
	</div>
);

export default ProgressChart;
