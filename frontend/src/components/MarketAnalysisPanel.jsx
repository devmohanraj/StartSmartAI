import { useState, useEffect } from "react";
import ProjectSummary from "./ProjectSummary";

function Skeleton({ className = "" }) {
  return (
    <div className={`bg-gray-700 rounded-lg animate-pulse ${className}`} />
  );
}

function formatCurrency(value) {
  if (!value) return "—";
  const num = Number(value);
  if (num >= 1_000_000_000) return "$" + (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return "$" + (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return "$" + (num / 1_000).toFixed(1) + "K";
  return "$" + num.toLocaleString();
}

function SimpleBarChart({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3 flex-1 flex flex-col justify-center">
      {data.map((d) => (
        <div key={d.year} className="flex items-center gap-3">
          <span className="text-sm text-gray-300 w-10 shrink-0 text-right">
            {d.year}
          </span>
          <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-sm text-gray-300 font-medium w-16 text-right">
            {d.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

function MarketAnalysisPanel({
  projectId,
  onAnalysisComplete,
  project,
  onReset,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  // Initial fetch - try GET first to retrieve stored analysis
  useEffect(() => {
    let cancelled = false;

    // First, try to GET existing analysis from database
    fetch(`http://localhost:8080/api/projects/${projectId}/market-analysis`, {
      method: "GET",
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        // If no analysis exists (404), generate new one via POST
        if (res.status === 404) {
          throw new Error("NOT_FOUND");
        }
        throw new Error(`Request failed with status ${res.status}`);
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
          if (onAnalysisComplete) onAnalysisComplete();
        }
      })
      .catch(async (err) => {
        if (!cancelled && err.message === "NOT_FOUND") {
          // No cached analysis - generate new one via POST
          try {
            const postRes = await fetch(
              `http://localhost:8080/api/projects/${projectId}/market-analysis`,
              {
                method: "POST",
              },
            );
            if (!postRes.ok) {
              const body = await postRes.json().catch(() => null);
              throw new Error(
                body?.error || `Request failed with status ${postRes.status}`,
              );
            }
            const json = await postRes.json();
            if (!cancelled) {
              setData(json);
              setLoading(false);
              if (onAnalysisComplete) onAnalysisComplete();
            }
          } catch (postErr) {
            if (!cancelled) {
              setError(postErr.message);
              setLoading(false);
              if (onAnalysisComplete) onAnalysisComplete();
            }
          }
        } else if (!cancelled) {
          setError(err.message);
          setLoading(false);
          if (onAnalysisComplete) onAnalysisComplete();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, onAnalysisComplete]);

  // Poll for results when there's an error (backend still processing)
  useEffect(() => {
    if (!error || !isPolling) return;

    const isServerError = error.match(
      /Request failed with status (500|502|503)/,
    );
    if (!isServerError) return;

    const pollInterval = setInterval(() => {
      fetch(`http://localhost:8080/api/projects/${projectId}/market-analysis`, {
        method: "GET",
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Request failed with status ${res.status}`);
          }
          return res.json();
        })
        .then((json) => {
          setData(json);
          setError("");
          setIsPolling(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Polling...", err.message);
        });
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [error, isPolling, projectId]);

  const startPolling = () => {
    setIsPolling(true);
  };

  const retry = () => {
    setLoading(true);
    setError("");
    setData(null);

    fetch(`http://localhost:8080/api/projects/${projectId}/market-analysis`, {
      method: "POST",
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(
            body?.error || `Request failed with status ${res.status}`,
          );
        }
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  let trends = [];
  if (data?.marketTrendsJson) {
    try {
      trends = JSON.parse(data.marketTrendsJson);
    } catch {
      trends = [];
    }
  }

  // Loading state
  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[calc(100vh-6rem)]">
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="flex-1" />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="flex-1" />
        </div>
        <div className="lg:col-span-3 flex flex-col gap-4 h-full">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="flex-1" />
        </div>
      </div>
    );
  }

  // Error state
  if (error && !data) {
    const isServerError = error.match(
      /Request failed with status (500|502|503)/,
    );
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[calc(100vh-6rem)]">
        <div className="lg:col-span-9 flex flex-col gap-4 h-full">
          <div className="flex items-start gap-3 bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-3.5">
            <svg
              className="w-5 h-5 shrink-0 text-red-400 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-400">
                Analysis failed
              </p>
              <p className="text-sm text-red-300 mt-0.5">{error}</p>
              {isServerError && (
                <p className="text-sm text-gray-400 mt-1">
                  Backend is processing. This may take a minute...
                </p>
              )}
            </div>
          </div>
          {isServerError ? (
            <button
              onClick={startPolling}
              className="h-10 px-6 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Check for results
            </button>
          ) : (
            <button
              onClick={retry}
              className="h-10 px-6 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
        {project && (
          <div className="lg:col-span-3 h-full">
            <ProjectSummary project={project} onReset={onReset} />
          </div>
        )}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[calc(100vh-6rem)]">
      {/* Left column — Market Analysis */}
      <div className="lg:col-span-5 flex flex-col h-full">
        <div className="flex items-center justify-between pb-2 shrink-0">
          <h3 className="text-sm font-semibold text-white">Market Analysis</h3>
          <button
            onClick={retry}
            disabled={loading}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* TAM/SAM/SOM cards */}
        <div className="grid grid-cols-3 gap-2 pb-2 shrink-0">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
            <p className="text-lg font-bold text-white">
              {formatCurrency(data.marketSizeTam)}
            </p>
            <p className="text-[11px] text-gray-300 mt-0.5">TAM</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
            <p className="text-lg font-bold text-white">
              {formatCurrency(data.marketSizeSam)}
            </p>
            <p className="text-[11px] text-gray-300 mt-0.5">SAM</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-2.5">
            <p className="text-lg font-bold text-white">
              {formatCurrency(data.marketSizeSom)}
            </p>
            <p className="text-[11px] text-gray-300 mt-0.5">SOM</p>
          </div>
        </div>

        {/* Growth rate badge */}
        {data.growthRate && (
          <div className="flex items-center gap-2 pb-2 shrink-0">
            <span className="text-xs text-gray-300">Growth:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {data.growthRate}
            </span>
          </div>
        )}

        {/* Market trends chart — grows to fill remaining space */}
        {trends.length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 shrink-0">
              Market Trends
            </h4>
            <SimpleBarChart data={trends} />
          </div>
        )}
      </div>

      {/* Center column — Competitor Landscape */}
      <div className="lg:col-span-4 flex flex-col h-full">
        <div className="flex items-center justify-between pb-2 shrink-0">
          <h3 className="text-sm font-semibold text-white">
            Competitor Landscape
          </h3>
          <span className="text-xs text-gray-300">
            {data.competitors ? data.competitors.length : 0} competitors
          </span>
        </div>

        {data.competitors && data.competitors.length > 0 ? (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {data.competitors.map((c) => {
              const shareNum = parseFloat(c.marketShare) || 0;
              return (
                <div
                  key={c.id}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">
                      {c.competitorName}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.position === "Direct"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                      }`}
                    >
                      {c.position}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-300 mb-2">
                    <span>
                      Share:{" "}
                      <strong className="text-gray-300">{c.marketShare}</strong>
                    </span>
                    <span>
                      Revenue:{" "}
                      <strong className="text-gray-300">{c.revenue}</strong>
                    </span>
                    <span>
                      Growth:{" "}
                      <strong className="text-gray-300">{c.growth}</strong>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(shareNum, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 text-sm text-gray-300">
            No competitor data available
          </div>
        )}
      </div>

      {/* Right column — Project Summary */}
      {project && (
        <div className="lg:col-span-3 h-full">
          <ProjectSummary project={project} onReset={onReset} />
        </div>
      )}
    </div>
  );
}

export default MarketAnalysisPanel;