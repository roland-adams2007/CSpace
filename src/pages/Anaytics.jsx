import { useEffect, useCallback } from "react";
import { useWebsiteStore, useAnalyticsStore } from "../store/store";
import * as Icons from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RANGES = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

const DEVICE_ICONS = { desktop: "Monitor", mobile: "Smartphone", tablet: "Tablet", bot: "Bot" };
const DEVICE_COLORS = { desktop: "blue", mobile: "emerald", tablet: "purple", bot: "gray" };

function fmt(n) {
  if (n == null || isNaN(n)) return "0";
  n = Number(n);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return String(Math.round(n));
}

function fmtMs(ms) {
  if (!ms) return "—";
  ms = Number(ms);
  return ms >= 1000 ? (ms / 1000).toFixed(2) + "s" : Math.round(ms) + "ms";
}

function fmtPct(n) { return n == null ? "—" : Number(n).toFixed(1) + "%"; }

function fmtDur(s) {
  if (!s) return "—";
  s = Math.round(Number(s));
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function delta(curr, prev) {
  if (!prev || !curr) return null;
  const d = ((curr - prev) / (prev || 1)) * 100;
  return Math.round(d);
}

function flagEmoji(cc) {
  if (!cc || cc.length !== 2) return "🌍";
  return String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}

function MiniBar({ value, max, color = "indigo" }) {
  const pct = max > 0 ? Math.max((value / max) * 100, 2) : 0;
  const map = { 
    indigo: "bg-indigo-500", 
    blue: "bg-blue-500", 
    emerald: "bg-emerald-500", 
    purple: "bg-purple-500", 
    orange: "bg-orange-500", 
    rose: "bg-rose-500", 
    gray: "bg-gray-300" 
  };
  
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
      <div 
        className={`h-1.5 rounded-full ${map[color] || "bg-indigo-500"} transition-all duration-500`} 
        style={{ width: `${pct}%` }} 
      />
    </div>
  );
}

function Skeleton({ className = "" }) { 
  return <div className={`animate-pulse bg-gray-100 rounded ${className}`} />; 
}

function EmptyState({ icon: Icon, msg }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <p className="text-xs text-gray-400">{msg}</p>
    </div>
  );
}

function Card({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
        <Icon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "indigo", change }) {
  const map = {
    blue: { bg: "bg-blue-50", ic: "text-blue-600", ring: "ring-blue-100" },
    indigo: { bg: "bg-indigo-50", ic: "text-indigo-600", ring: "ring-indigo-100" },
    purple: { bg: "bg-purple-50", ic: "text-purple-600", ring: "ring-purple-100" },
    emerald: { bg: "bg-emerald-50", ic: "text-emerald-600", ring: "ring-emerald-100" },
    orange: { bg: "bg-orange-50", ic: "text-orange-600", ring: "ring-orange-100" },
    rose: { bg: "bg-rose-50", ic: "text-rose-600", ring: "ring-rose-100" },
  };
  const c = map[color] || map.indigo;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-start gap-3">
      <div className={`w-9 h-9 ${c.bg} ring-1 ${c.ring} rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-4 h-4 ${c.ic}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900 mt-0.5">{value}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {sub && <p className="text-xs text-gray-400">{sub}</p>}
          {change != null && (
            <span className={`text-xs font-medium ${change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function RangeButton({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick} 
      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
        active ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function TwoLineChart({ data }) {
  if (!data?.length) return <EmptyState icon={Icons.TrendingUp} msg="No data for this period." />;
  
  const labels = data.map(d => new Date(d.date || d.day || d.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Page Views',
        data: data.map(d => Number(d.total_views) || 0),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Unique Visitors',
        data: data.map(d => Number(d.unique_visitors) || 0),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          callback: (value) => fmt(value),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  return (
    <div className="h-36 w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}

function BarChartComponent({ data, keyX, keyY, color = "bg-indigo-500" }) {
  if (!data?.length) return <EmptyState icon={Icons.TrendingUp} msg="No data for this period." />;
  
  const labels = data.map(d => {
    if (d[keyX]) {
      return new Date(d[keyX]).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    return '';
  });
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Count',
        data: data.map(d => Number(d[keyY]) || 0),
        backgroundColor: '#f97316',
        borderRadius: 4,
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => fmt(context.raw),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
        },
        ticks: {
          callback: (value) => fmt(value),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  return (
    <div className="h-36 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}

function DonutRing({ data, total }) {
  if (!data?.length || !total) return <EmptyState icon={Icons.PieChart} msg="No data." />;
  
  const colors = ["#6366f1", "#10b981", "#a855f7", "#9ca3af", "#f59e0b"];
  
  const chartData = {
    labels: data.map(d => d.device_type || d.browser || d.os || "Unknown"),
    datasets: [
      {
        data: data.map(d => Number(d.count)),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 0,
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${fmt(value)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',
  };
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 flex-shrink-0">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="space-y-1.5 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[i % colors.length] }} />
            <span className="text-gray-600 capitalize truncate">{d.device_type || d.browser || d.os || "Unknown"}</span>
            <span className="text-gray-400 ml-auto pl-2">{fmtPct((Number(d.count) / total) * 100)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { selectedWebsite } = useWebsiteStore();
  const { data, loading, error, range, setRange, fetchOverview, clearError } = useAnalyticsStore();

  const load = useCallback((r) => {
    if (selectedWebsite?.id) fetchOverview(selectedWebsite.id, r);
  }, [selectedWebsite?.id, fetchOverview]);

  useEffect(() => { load(range); }, [range, load]);

  if (!selectedWebsite) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
        <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center">
          <Icons.BarChart2 className="w-7 h-7 text-indigo-400" />
        </div>
        <h2 className="text-base font-semibold text-gray-800">No website selected</h2>
        <p className="text-sm text-gray-400">Select a website to view analytics.</p>
      </div>
    );
  }

  const d = data || {};
  const s = d.summary || {};
  const p = d.prevSummary || {};
  const perf = d.performance || {};

  const totalDevices = (d.deviceBreakdown || []).reduce((a, x) => a + Number(x.count), 0) || 1;
  const totalBrowsers = (d.browserBreakdown || []).reduce((a, x) => a + Number(x.count), 0) || 1;
  const maxPage = d.topPages?.[0]?.views || 1;
  const maxRef = d.topReferrers?.[0]?.visits || 1;
  const maxEntry = d.topEntryPages?.[0]?.entries || 1;
  const maxExit = d.topExitPages?.[0]?.exits || 1;
  const maxEvent = d.topEvents?.[0]?.count || 1;
  const maxCountry = d.geoStats?.[0]?.views || 1;
  const maxPerfPage = d.perfByPage?.[0]?.avg_load_time || 1;
  const nvr = d.newVsReturning || {};
  const nvrTotal = (Number(nvr.new_visitors) + Number(nvr.returning_visitors)) || 1;

  const skRow = (n = 5) => (
    <div className="space-y-3">
      {Array.from({ length: n }).map((_, i) => (
        <Skeleton key={i} className="h-9 rounded" />
      ))}
    </div>
  );

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Stats for <span className="font-medium text-indigo-700">{selectedWebsite.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {RANGES.map((r) => (
            <RangeButton 
              key={r.value} 
              label={r.label} 
              active={range === r.value} 
              onClick={() => { setRange(r.value); }} 
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          <Icons.AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={clearError} className="ml-auto">
            <Icons.X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {loading ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />) : (
          <>
            <StatCard icon={Icons.Eye} label="Page Views" value={fmt(s.total_views)} change={delta(s.total_views, p.total_views)} color="blue" />
            <StatCard icon={Icons.Users} label="Unique Visitors" value={fmt(s.unique_visitors)} change={delta(s.unique_visitors, p.unique_visitors)} color="indigo" />
            <StatCard icon={Icons.Activity} label="Sessions" value={fmt(s.sessions)} change={delta(s.sessions, p.sessions)} color="purple" />
            <StatCard icon={Icons.Percent} label="Bounce Rate" value={fmtPct(s.bounce_rate)} change={s.bounce_rate != null && p.bounce_rate != null ? -delta(s.bounce_rate, p.bounce_rate) : null} color="orange" />
            <StatCard icon={Icons.Clock} label="Avg Session" value={fmtDur(s.avg_duration)} sub={`${fmtPct(100 - (s.bounce_rate || 0))} engaged`} color="emerald" />
            <StatCard icon={Icons.Layers} label="Pages / Session" value={s.avg_pages ? Number(s.avg_pages).toFixed(1) : "—"} color="blue" />
            <StatCard icon={Icons.Zap} label="Total Events" value={fmt(s.total_events)} color="purple" />
            <StatCard icon={Icons.FileCheck} label="Form Completions" value={fmt(s.form_completions)} sub={s.form_starts ? `of ${fmt(s.form_starts)} starts` : undefined} color="emerald" />
          </>
        )}
      </div>

      {/* Traffic Over Time */}
      <div className="mb-6">
        <Card title="Traffic Over Time" icon={Icons.TrendingUp}>
          {loading ? <Skeleton className="h-36 rounded" /> : <TwoLineChart data={d.pageViewTimeSeries} />}
        </Card>
      </div>

      {/* New vs Returning + Daily Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card title="New vs Returning" icon={Icons.Users}>
          {loading ? <Skeleton className="h-24 rounded" /> : (
            <div className="space-y-3">
              {[
                { label: "New Visitors", value: nvr.new_visitors, color: "indigo" },
                { label: "Returning Visitors", value: nvr.returning_visitors, color: "emerald" },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{row.label}</span>
                    <span className="font-semibold text-gray-900">{fmt(row.value)}</span>
                  </div>
                  <MiniBar value={Number(row.value)} max={nvrTotal} color={row.color} />
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                {fmtPct((Number(nvr.new_visitors) / nvrTotal) * 100)} new · {fmtPct((Number(nvr.returning_visitors) / nvrTotal) * 100)} returning
              </div>
            </div>
          )}
        </Card>

        <div className="lg:col-span-2">
          <Card title="Daily Breakdown" icon={Icons.Calendar}>
            {loading ? <Skeleton className="h-36 rounded" /> : !d.dailyStats?.length ? (
              <EmptyState icon={Icons.Calendar} msg="No daily stats yet." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      {["Date", "Views", "Visitors", "Sessions", "Bounce", "Avg Duration", "New", "Returning", "Form Conv."].map((h) => (
                        <th key={h} className="pb-2 pr-4 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {d.dailyStats.slice(-14).reverse().map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="py-1.5 pr-4 text-gray-500 whitespace-nowrap">
                          {new Date(row.stat_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="py-1.5 pr-4 font-medium text-gray-900">{fmt(row.page_views)}</td>
                        <td className="py-1.5 pr-4 text-gray-700">{fmt(row.unique_visitors)}</td>
                        <td className="py-1.5 pr-4 text-gray-700">{fmt(row.sessions)}</td>
                        <td className="py-1.5 pr-4 text-gray-700">{fmtPct(row.bounce_rate)}</td>
                        <td className="py-1.5 pr-4 text-gray-700">{fmtDur(row.avg_session_duration)}</td>
                        <td className="py-1.5 pr-4 text-gray-700">{fmt(row.new_visitors)}</td>
                        <td className="py-1.5 pr-4 text-gray-700">{fmt(row.returning_visitors)}</td>
                        <td className="py-1.5 pr-4 text-gray-700">{fmtPct(row.form_completion_rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Top Pages + Entry/Exit */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <Card title="Top Pages" icon={Icons.FileText}>
            {loading ? skRow() : !d.topPages?.length ? <EmptyState icon={Icons.File} msg="No page data." /> : (
              <div className="space-y-3">
                {d.topPages.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-mono truncate max-w-[55%]">{p.page_url}</span>
                      <div className="flex items-center gap-3 flex-shrink-0 text-right">
                        <span className="text-gray-400">{fmt(p.unique_visitors)} uniq</span>
                        {p.avg_duration ? <span className="text-gray-400">{fmtDur(p.avg_duration)}</span> : null}
                        <span className="font-semibold text-gray-900 w-10">{fmt(p.views)}</span>
                      </div>
                    </div>
                    <MiniBar value={p.views} max={maxPage} color="indigo" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Entry Pages" icon={Icons.LogIn}>
            {loading ? skRow(4) : !d.topEntryPages?.length ? <EmptyState icon={Icons.LogIn} msg="No entry data." /> : (
              <div className="space-y-3">
                {d.topEntryPages.slice(0, 5).map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700 font-mono truncate max-w-[70%]">{p.entry_page}</span>
                      <span className="font-semibold text-gray-900">{fmt(p.entries)}</span>
                    </div>
                    <MiniBar value={p.entries} max={maxEntry} color="blue" />
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card title="Exit Pages" icon={Icons.LogOut}>
            {loading ? skRow(4) : !d.topExitPages?.length ? <EmptyState icon={Icons.LogOut} msg="No exit data." /> : (
              <div className="space-y-3">
                {d.topExitPages.slice(0, 5).map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700 font-mono truncate max-w-[70%]">{p.exit_page}</span>
                      <span className="font-semibold text-gray-900">{fmt(p.exits)}</span>
                    </div>
                    <MiniBar value={p.exits} max={maxExit} color="rose" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Devices + Browsers + OS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card title="Devices" icon={Icons.Monitor}>
          {loading ? <Skeleton className="h-32 rounded" /> : !d.deviceBreakdown?.length ? <EmptyState icon={Icons.Monitor} msg="No device data." /> : (
            <DonutRing data={d.deviceBreakdown} total={totalDevices} />
          )}
        </Card>

        <Card title="Browsers" icon={Icons.Globe}>
          {loading ? skRow(4) : !d.browserBreakdown?.length ? <EmptyState icon={Icons.Globe} msg="No browser data." /> : (
            <div className="space-y-3">
              {d.browserBreakdown.map((b, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">{b.browser}</span>
                    <div className="flex gap-2">
                      <span className="text-gray-400">{fmtPct((Number(b.count) / totalBrowsers) * 100)}</span>
                      <span className="font-semibold text-gray-900">{fmt(b.count)}</span>
                    </div>
                  </div>
                  <MiniBar value={Number(b.count)} max={totalBrowsers} color="purple" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Operating Systems" icon={Icons.Cpu}>
          {loading ? skRow(4) : !d.osBreakdown?.length ? <EmptyState icon={Icons.Cpu} msg="No OS data." /> : (
            <div className="space-y-3">
              {d.osBreakdown.map((o, i) => {
                const total = d.osBreakdown.reduce((a, x) => a + Number(x.count), 0) || 1;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-700">{o.os}</span>
                      <div className="flex gap-2">
                        <span className="text-gray-400">{fmtPct((Number(o.count) / total) * 100)}</span>
                        <span className="font-semibold text-gray-900">{fmt(o.count)}</span>
                      </div>
                    </div>
                    <MiniBar value={Number(o.count)} max={total} color="emerald" />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Referrers + Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Top Referrers" icon={Icons.Link}>
          {loading ? skRow() : !d.topReferrers?.length ? <EmptyState icon={Icons.Link2} msg="No referrer data." /> : (
            <div className="space-y-3">
              {d.topReferrers.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700 truncate max-w-[65%]">{r.referer_url}</span>
                    <div className="flex gap-2">
                      <span className="text-gray-400">{fmt(r.unique_visitors)} uniq</span>
                      <span className="font-semibold text-gray-900">{fmt(r.visits)}</span>
                    </div>
                  </div>
                  <MiniBar value={r.visits} max={maxRef} color="blue" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Countries" icon={Icons.Globe2}>
          {loading ? skRow() : !d.geoStats?.length ? <EmptyState icon={Icons.MapPin} msg="No geo data." /> : (
            <div className="space-y-3">
              {d.geoStats.slice(0, 10).map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate max-w-[60%]">
                      <span>{flagEmoji(c.country_code)}</span>
                      <span className="text-gray-700">{c.country_name || c.country_code || "Unknown"}</span>
                      {c.city && <span className="text-gray-400">· {c.city}</span>}
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-400">{fmt(c.unique_visitors)} uniq</span>
                      <span className="font-semibold text-gray-900">{fmt(c.views)}</span>
                    </div>
                  </div>
                  <MiniBar value={c.views} max={maxCountry} color="emerald" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Top Events" icon={Icons.Zap}>
          {loading ? skRow() : !d.topEvents?.length ? <EmptyState icon={Icons.Zap} msg="No events tracked yet." /> : (
            <div className="space-y-3">
              {d.topEvents.map((e, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-medium text-gray-800 truncate">{e.event_name}</span>
                      {e.event_category && (
                        <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px] flex-shrink-0">
                          {e.event_category}
                        </span>
                      )}
                      {e.event_label && <span className="text-gray-400 truncate">· {e.event_label}</span>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className="text-gray-400">{fmt(e.unique_visitors)} uniq</span>
                      <span className="font-semibold text-gray-900">{fmt(e.count)}</span>
                    </div>
                  </div>
                  <MiniBar value={e.count} max={maxEvent} color="orange" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Events Over Time" icon={Icons.Activity}>
          {loading ? <Skeleton className="h-36 rounded" /> : !d.eventTimeSeries?.length ? (
            <EmptyState icon={Icons.Activity} msg="No event data." />
          ) : (
            <BarChartComponent data={d.eventTimeSeries} keyX="date" keyY="count" />
          )}
        </Card>
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Performance Overview" icon={Icons.Gauge}>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded" />)}
            </div>
          ) : !perf.avg_load_time && !perf.avg_fcp ? (
            <EmptyState icon={Icons.Gauge} msg="No performance data yet." />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Avg Load Time", value: fmtMs(perf.avg_load_time), min: fmtMs(perf.min_load_time), max: fmtMs(perf.max_load_time), icon: Icons.Clock, good: perf.avg_load_time < 3000 },
                { label: "First Paint", value: fmtMs(perf.avg_fp), icon: Icons.Paintbrush2, good: perf.avg_fp < 1000 },
                { label: "FCP", value: fmtMs(perf.avg_fcp), icon: Icons.Image, good: perf.avg_fcp < 1800 },
                { label: "TTI", value: fmtMs(perf.avg_tti), icon: Icons.MousePointer, good: perf.avg_tti < 3800 },
                { label: "DOM Interactive", value: fmtMs(perf.avg_dom_interactive), icon: Icons.Code2, good: perf.avg_dom_interactive < 2000 },
                { label: "Samples", value: fmt(perf.sample_count), icon: Icons.Database, good: true },
              ].map((m, i) => (
                <div key={i} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center gap-1 mb-1">
                    <m.icon className="w-3 h-3 text-gray-400" />
                    <p className="text-[11px] text-gray-400">{m.label}</p>
                  </div>
                  <span className={`text-base font-semibold px-1.5 py-0.5 rounded ${
                    m.good ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
                  }`}>
                    {m.value}
                  </span>
                  {m.min && <p className="text-[10px] text-gray-400 mt-0.5">min {m.min} · max {m.max}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Slowest Pages" icon={Icons.Timer}>
          {loading ? skRow() : !d.perfByPage?.length ? (
            <EmptyState icon={Icons.Timer} msg="No page performance data." />
          ) : (
            <div className="space-y-3">
              {d.perfByPage.map((p, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700 font-mono truncate max-w-[55%]">{p.page_url}</span>
                    <div className="flex gap-2">
                      <span className="text-gray-400">FCP {fmtMs(p.avg_fcp)}</span>
                      <span className={`font-semibold ${Number(p.avg_load_time) > 3000 ? "text-rose-600" : "text-gray-900"}`}>
                        {fmtMs(p.avg_load_time)}
                      </span>
                    </div>
                  </div>
                  <MiniBar 
                    value={Number(p.avg_load_time)} 
                    max={maxPerfPage} 
                    color={Number(p.avg_load_time) > 3000 ? "rose" : "emerald"} 
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Forms */}
      {(loading || d.formStats?.length > 0) && (
        <div className="mb-6">
          <Card title="Form Analytics" icon={Icons.ClipboardList}>
            {loading ? skRow(3) : !d.formStats?.length ? (
              <EmptyState icon={Icons.Clipboard} msg="No form data." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      {["Form", "Starts", "Completions", "Conv. Rate", "Avg Time"].map((h) => (
                        <th key={h} className="pb-2 pr-6 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {d.formStats.map((f, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2 pr-6 font-medium text-gray-800">{f.form_name || `Form #${f.form_id || i + 1}`}</td>
                        <td className="py-2 pr-6 text-gray-700">{fmt(f.total_starts)}</td>
                        <td className="py-2 pr-6 text-gray-700">{fmt(f.completions)}</td>
                        <td className="py-2 pr-6">
                          <span className={`px-1.5 py-0.5 rounded font-medium ${
                            Number(f.completion_rate) >= 50 ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"
                          }`}>
                            {fmtPct(f.completion_rate)}
                          </span>
                        </td>
                        <td className="py-2 pr-6 text-gray-700">{fmtDur(f.avg_completion_seconds)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}