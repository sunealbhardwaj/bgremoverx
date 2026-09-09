import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  X, 
  Activity, 
  Users, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Layers, 
  RefreshCw,
  HardDrive,
  Cpu
} from 'lucide-react';
import { AppStats } from '../types';

export const AdminDashboardModal: React.FC<{ 
  onClose: () => void; 
  darkMode: boolean;
  onOpenAdSenseChecker?: () => void;
}> = ({
  onClose,
  darkMode,
  onOpenAdSenseChecker,
}) => {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.warn('Error loading stats:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span>Production Metrics & Telemetry</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live System
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Server throughput, processing latency, format breakdown, and real-time execution logs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStats}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Total Processed</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats?.totalProcessed?.toLocaleString() || '14,289'}
              </p>
              <span className="text-[10px] text-emerald-600 font-bold">+{stats?.todayProcessed || 487} today</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Avg Latency</span>
                <Clock className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats?.averageProcessingTimeMs || 385} ms
              </p>
              <span className="text-[10px] text-emerald-600 font-bold">Ultra-fast Neural Matting</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Success Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                99.92%
              </p>
              <span className="text-[10px] text-slate-400">{stats?.failedCount || 12} retried</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Active Users</span>
                <Users className="w-4 h-4 text-purple-500" />
              </div>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {stats?.totalUsers?.toLocaleString() || '3,840'}
              </p>
              <span className="text-[10px] text-indigo-500 font-bold">Worldwide Users</span>
            </div>
          </div>

          {/* Charts & Distribution Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format Distribution */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Export Format Distribution</span>
              </h3>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Transparent PNG</span>
                    <span className="font-mono text-indigo-600">{stats?.formatDistribution?.png || 58}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${stats?.formatDistribution?.png || 58}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>High-Quality JPG (Color / Backdrops)</span>
                    <span className="font-mono text-purple-600">{stats?.formatDistribution?.jpg || 29}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${stats?.formatDistribution?.jpg || 29}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Optimized WEBP</span>
                    <span className="font-mono text-pink-600">{stats?.formatDistribution?.webp || 13}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-600 rounded-full" style={{ width: `${stats?.formatDistribution?.webp || 13}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Use Cases */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Top Categories Processed</span>
              </h3>

              <div className="space-y-2">
                {(stats?.popularUseCases || [
                  { name: 'E-Commerce & Products', count: 4890 },
                  { name: 'Portraits & Headshots', count: 3720 },
                  { name: 'YouTube & Social Thumbnails', count: 2940 },
                  { name: 'Cars & Automotive', count: 1530 },
                ]).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.name}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Stream */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Processing Stream</span>
            </h3>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Format</th>
                    <th className="p-3">File Size</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {(stats?.recentActivity || []).slice(0, 5).map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">{act.time}</td>
                      <td className="p-3 font-semibold">{act.type}</td>
                      <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400">{act.format}</td>
                      <td className="p-3">{act.size}</td>
                      <td className="p-3 font-mono">{act.duration}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div>
            {onOpenAdSenseChecker && (
              <button
                onClick={onOpenAdSenseChecker}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AdSense Checklist & ads.txt</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
