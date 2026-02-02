
import React from 'react';
import ProgressChart from './ProgressChart';

const Analytics = () => {
	// Example summary data
	const summary = {
		resumesUploaded: 12,
		interviewsCompleted: 5,
		chatSessions: 20,
		improvement: '15%'
	};

	return (
		<div style={{ padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px #eee' }}>
			<h2>Analytics Overview</h2>
			<div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
				<div>
					<strong>Resumes Uploaded:</strong> {summary.resumesUploaded}
				</div>
				<div>
					<strong>Interviews Completed:</strong> {summary.interviewsCompleted}
				</div>
				<div>
					<strong>Chat Sessions:</strong> {summary.chatSessions}
				</div>
				<div>
					<strong>Improvement:</strong> {summary.improvement}
				</div>
			</div>
			<ProgressChart />
		</div>
	);
};

export default Analytics;
