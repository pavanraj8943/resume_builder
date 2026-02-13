import React, { useState, useEffect } from 'react';
import ProgressChart from './ProgressChart';
import { api } from '../../services/api';
import { Loader2, TrendingUp, Users, MessageSquare, FileText } from 'lucide-react';

const Analytics = () => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await api.get('/analytics/dashboard');
				if (response.success) {
					setStats(response.data);
				} else {
					setError('Failed to load analytics data');
				}
			} catch (err) {
				console.error('Analytics fetch error:', err);
				setError('Failed to connect to analytics service');
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
				{error}
			</div>
		);
	}

	if (!stats) return null;

	return (
		<div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
			<h2 className="text-xl font-bold text-slate-800 mb-6">Analytics Overview</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<StatCard
					title="Resumes Uploaded"
					value={stats.skillsAnalyzed > 0 ? 1 : 0} // Approximated for now as API returns skills count
					label={stats.skillsAnalyzed ? "Analyzed" : "None"}
					icon={FileText}
					color="blue"
				/>
				<StatCard
					title="Interviews"
					value={stats.totalSessions}
					label="Completed"
					icon={Users}
					color="indigo"
				/>
				<StatCard
					title="Avg Score"
					value={stats.averageScore}
					label="Points"
					icon={TrendingUp}
					color="green"
				/>
				<StatCard
					title="Recent Activity"
					value={stats.recentHistory?.length || 0}
					label="Sessions"
					icon={MessageSquare}
					color="purple"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div>
					<h3 className="font-semibold text-slate-800 mb-4">Top Strengths</h3>
					<div className="space-y-2">
						{stats.topStrengths && stats.topStrengths.length > 0 ? (
							stats.topStrengths.map((str, idx) => (
								<div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700 text-sm font-medium">
									<div className="w-2 h-2 rounded-full bg-green-500"></div>
									{str}
								</div>
							))
						) : (
							<p className="text-slate-500 text-sm">No strengths recorded yet.</p>
						)}
					</div>
				</div>

				<div>
					<h3 className="font-semibold text-slate-800 mb-4">Areas for Improvement</h3>
					<div className="space-y-2">
						{stats.topImprovements && stats.topImprovements.length > 0 ? (
							stats.topImprovements.map((imp, idx) => (
								<div key={idx} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg text-orange-700 text-sm font-medium">
									<div className="w-2 h-2 rounded-full bg-orange-500"></div>
									{imp}
								</div>
							))
						) : (
							<p className="text-slate-500 text-sm">No improvements recorded yet.</p>
						)}
					</div>
				</div>
			</div>

			<div className="mt-8 pt-8 border-t border-slate-100">
				<ProgressChart data={stats.recentHistory} />
			</div>
		</div>
	);
};

const StatCard = ({ title, value, label, icon: Icon, color }) => {
	const colorClasses = {
		blue: "bg-blue-50 text-blue-600",
		indigo: "bg-indigo-50 text-indigo-600",
		green: "bg-green-50 text-green-600",
		purple: "bg-purple-50 text-purple-600"
	};

	return (
		<div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
			<div className="flex items-start justify-between mb-2">
				<span className="text-slate-500 text-sm font-medium">{title}</span>
				<div className={`p-2 rounded-lg ${colorClasses[color]}`}>
					<Icon className="w-4 h-4" />
				</div>
			</div>
			<div className="flex items-baseline gap-2">
				<span className="text-2xl font-bold text-slate-900">{value}</span>
				<span className="text-xs text-slate-500">{label}</span>
			</div>
		</div>
	);
};

export default Analytics;
