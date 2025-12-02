"use client";

import React, { useState, useMemo } from "react";
// Removed unused 'Link' import

// --- THEME CONFIGURATION ---
const BACKGROUND_COLOR = "bg-gray-950"; // Deep Black/Space Gray
const CARD_BG_COLOR = "bg-gray-900"; // Slightly lighter card background
const ACCENT_COLOR = "text-lime-400"; // Neon Lime/Green for primary accent
const BUTTON_BG_COLOR = "bg-lime-500 hover:bg-lime-400"; // Primary action button
const IDLE_COLOR = "bg-gray-700";
const MAX_TIME_UNIT = 500;

// Interfaces remain the same for type safety
interface Process {
  pid: string;
  arrival: number | "";
  burst: number | "";
}

interface ProcessResult extends Omit<Process, "arrival" | "burst"> {
  arrival: number;
  burst: number;
  completion: number;
  waiting: number;
  turnaround: number;
  remaining?: number;
}

interface GanttBlock {
  pid: string;
  start: number;
  end: number;
  duration: number;
}

const DEFAULT_PROCESS_DATA: Omit<Process, "pid"> = { arrival: "", burst: "" };

const getInitialProcesses = () => [
  { pid: "P1", ...DEFAULT_PROCESS_DATA, arrival: 0, burst: 10 },
  { pid: "P2", ...DEFAULT_PROCESS_DATA, arrival: 6, burst: 4 },
  { pid: "P3", ...DEFAULT_PROCESS_DATA, arrival: 13, burst: 5 },
];

// Helper to assign a stable color class to each process ID
const getProcessColor = (pid: string) => {
  if (pid === "IDLE") return IDLE_COLOR;
  
  // Simple deterministic color map for processes
  const colorMap: { [key: string]: string } = {
    P1: "bg-blue-600",
    P2: "bg-fuchsia-600",
    P3: "bg-teal-600",
    P4: "bg-amber-600",
    P5: "bg-sky-600",
  };
  return colorMap[pid] || "bg-orange-600";
};


// --- FCFS Logic (Modified to return proportional Gantt Chart data) ---
function fcfs(processes: { pid: string; arrival: number; burst: number }[]) {
  const procs = processes
    .map((p) => ({ ...p }))
    .sort((a, b) => a.arrival - b.arrival || a.pid.localeCompare(b.pid)); // Sort by arrival time, then PID

  const done: ProcessResult[] = [];
  let time = 0;
  const ganttChart: GanttBlock[] = [];

  for (const current of procs) {
    let startTime = time;

    // 1. Check for IDLE time
    if (current.arrival > time) {
      const idleDuration = current.arrival - time;
      ganttChart.push({
        pid: "IDLE",
        start: time,
        end: current.arrival,
        duration: idleDuration,
      });
      startTime = current.arrival;
    }

    // 2. Process Execution
    const completionTime = startTime + current.burst;
    const executionDuration = current.burst;
    ganttChart.push({
      pid: current.pid,
      start: startTime,
      end: completionTime,
      duration: executionDuration,
    });

    // 3. Update time and record results
    time = completionTime;

    done.push({
      ...current,
      completion: completionTime,
      turnaround: completionTime - current.arrival,
      waiting: completionTime - current.arrival - current.burst,
    });
  }

  return { ganttChart, results: done };
}

export default function FCFSSimulator() {
  const [processes, setProcesses] = useState<Process[]>(getInitialProcesses());
  const [results, setResults] = useState<ProcessResult[] | null>(null);
  const [ganttChart, setGanttChart] = useState<GanttBlock[] | null>(null);
  const [error, setError] = useState("");

  const updateField = (i: number, field: keyof Process, value: string | number) => {
    const updated = [...processes];
    setError("");

    if (field === "pid") {
      updated[i].pid = String(value);
    } else {
      // Ensure only non-negative integers or empty string are entered
      if (typeof value === 'string' && !/^\d*$/.test(value)) return;
      updated[i][field] = value === "" ? "" : Number(value);
    }

    setProcesses(updated);
    setResults(null);
    setGanttChart(null);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { pid: `P${processes.length + 1}`, arrival: "", burst: "" },
    ]);
    setResults(null);
    setGanttChart(null);
  };

  const removeProcess = (i: number) => {
    const copy = [...processes];
    copy.splice(i, 1);

    const renumbered = copy.map((p, index) => ({ ...p, pid: `P${index + 1}` }));
    setProcesses(renumbered);
    setResults(null);
    setGanttChart(null);
    setError("");
  };

  const resetProcesses = () => {
    setProcesses(getInitialProcesses());
    setResults(null);
    setGanttChart(null);
    setError("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
    field: "arrival" | "burst"
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const nextId = field === 'arrival' ? `burst-P${processes[i].pid}` : `arrival-P${processes[i+1]?.pid}`;
      const nextElement = document.getElementById(nextId);

      if (nextElement) {
        nextElement.focus();
      } else if (i === processes.length - 1 && field === 'burst') {
        document.getElementById("simulate-button")?.focus();
      }
    }
  };

  const simulate = () => {
    setError("");
    setResults(null);
    setGanttChart(null);

    const validProcesses: { pid: string; arrival: number; burst: number }[] = [];

    for (const p of processes) {
      if (!p.pid.trim()) {
        return setError("PID cannot be empty for any process.");
      }

      // Skip fully empty rows
      if (p.arrival === "" && p.burst === "") {
        continue;
      }

      if (p.arrival === "" || p.burst === "") {
        return setError(
          `Process ${p.pid}: Arrival Time and Burst Time must both be filled.`
        );
      }

      const arrival = Number(p.arrival);
      const burst = Number(p.burst);

      if (arrival < 0 || burst <= 0) {
        return setError(
          `Process ${p.pid}: Arrival Time must be ≥ 0 and Burst Time must be ≥ 1.`
        );
      }
      if (arrival > MAX_TIME_UNIT || burst > MAX_TIME_UNIT) {
        return setError(
          `Process ${p.pid}: Value too large. Times must be ≤ ${MAX_TIME_UNIT}.`
        );
      }

      validProcesses.push({ pid: p.pid, arrival, burst });
    }

    if (validProcesses.length === 0) {
      return setError("Please define at least one process.");
    }

    const out = fcfs(validProcesses);

    setResults(out.results.sort((a, b) => a.pid.localeCompare(b.pid)));
    setGanttChart(out.ganttChart);
  };

  const { avgW, avgT } = useMemo(() => {
    if (!results || results.length === 0) return { avgW: 0, avgT: 0 };
    
    const totalW = results.reduce((a, b) => a + b.waiting, 0);
    const totalT = results.reduce((a, b) => a + b.turnaround, 0);
    
    return {
      avgW: totalW / results.length,
      avgT: totalT / results.length,
    };
  }, [results]);

  return (
    // Updated: Use theme BACKGROUND_COLOR and rounded corners everywhere
    <main className={`min-h-screen text-white font-sans p-4 md:p-8 ${BACKGROUND_COLOR} antialiased`}>
      
      {/* Header/Title Section */}
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-700/50 pb-4 mb-10">
          <h1 className={`text-4xl font-extrabold ${ACCENT_COLOR} drop-shadow-lg`}>
            FCFS Scheduler v2.0
          </h1>
          <p className="text-sm text-gray-400 mt-2 sm:mt-0">First-Come, First-Served Simulation</p>
        </header>

        <section>
          
          {/* Input Parameters Section */}
          <div className={`mb-12 p-6 md:p-8 border border-gray-700/50 ${CARD_BG_COLOR} shadow-2xl rounded-xl`}>
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <span className={`text-3xl mr-3 ${ACCENT_COLOR}`}>&gt;</span> Input Queue
            </h2>

            <div className="mb-4 text-sm text-gray-400">
              <p className="font-semibold">
                Algorithm: FCFS (Non-Preemptive)
              </p>
              <p>
                Max Time Unit: {MAX_TIME_UNIT}. Enter Arrival Time (AT) and Burst Time (BT) in milliseconds.
              </p>
            </div>

            {error && (
              <div className="border border-red-700 bg-red-900/50 p-3 mb-5 rounded-lg">
                <p className="text-red-400 font-bold">🚨 Error: {error}</p>
              </div>
            )}

            {/* Process Input Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-lg overflow-hidden border border-gray-800">
                <thead>
                  <tr className="bg-gray-800 text-gray-300 uppercase text-xs">
                    <th className="p-3 border-r border-gray-700 w-[15%] min-w-[50px] rounded-tl-lg">Process</th>
                    <th className="p-3 border-r border-gray-700 w-[35%]">Arrival Time (ms)</th>
                    <th className="p-3 border-r border-gray-700 w-[35%]">Burst Time (ms)</th>
                    <th className="p-3 w-[15%] rounded-tr-lg">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {processes.map((p, i) => (
                    <tr key={i} className={`border-t border-gray-800 ${CARD_BG_COLOR} hover:bg-gray-800/70 transition-colors`}>
                      {/* PID */}
                      <td className="p-2 border-r border-gray-800 text-center">
                        <span className={`font-mono font-bold block p-2 rounded-md ${getProcessColor(p.pid)} text-white`}>
                          {p.pid}
                        </span>
                      </td>

                      {/* Arrival Time */}
                      <td className="p-2 border-r border-gray-800 text-center">
                        <input
                          type="text"
                          id={`arrival-${p.pid}`}
                          value={p.arrival}
                          onChange={(e) => updateField(i, "arrival", e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, i, "arrival")}
                          className={`w-full text-center border border-gray-700 p-3 font-mono focus:ring-2 focus:ring-lime-500 focus:border-lime-500 ${BACKGROUND_COLOR} text-white rounded-lg outline-none transition-all`}
                          placeholder="e.g., 0"
                          maxLength={MAX_TIME_UNIT.toString().length}
                        />
                      </td>

                      {/* Burst Time */}
                      <td className="p-2 border-r border-gray-800 text-center">
                        <input
                          type="text"
                          id={`burst-${p.pid}`}
                          value={p.burst}
                          onChange={(e) => updateField(i, "burst", e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, i, "burst")}
                          className={`w-full text-center border border-gray-700 p-3 font-mono focus:ring-2 focus:ring-lime-500 focus:border-lime-500 ${BACKGROUND_COLOR} text-white rounded-lg outline-none transition-all`}
                          placeholder="e.g., 5"
                          maxLength={MAX_TIME_UNIT.toString().length}
                        />
                      </td>

                      {/* Action */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => removeProcess(i)}
                          className="bg-red-700 hover:bg-red-600 text-white text-xs py-2 px-3 rounded-lg transition duration-150 shadow-md transform hover:scale-105"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd" />
                          </svg>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button
                onClick={simulate}
                id="simulate-button"
                // Updated: Use theme ACCENT_COLOR for primary action button with deep shadow
                className={`${BUTTON_BG_COLOR} text-gray-950 font-extrabold w-full sm:w-auto py-3 px-10 rounded-full shadow-[0_0_20px_rgba(190,242,100,0.6)] transition duration-300 transform hover:scale-105`}
              >
                🚀 RUN SIMULATION
              </button>

              <div className="flex space-x-4 w-full sm:w-auto justify-end">
                <button
                  id="add-process-button"
                  onClick={addProcess}
                  className={`${CARD_BG_COLOR} hover:bg-gray-800 text-lime-400 border border-lime-400/50 py-2 px-5 rounded-lg shadow-lg transition duration-150 transform hover:scale-105`}
                >
                  <span className="text-xl inline-block mr-1 align-middle">+</span> Add Process
                </button>
                <button
                  onClick={resetProcesses}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-5 rounded-lg shadow-md transition duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {ganttChart && results && (
            <div className="mt-8">
              <SimulationOutput
                results={results}
                ganttChart={ganttChart}
                avgW={avgW}
                avgT={avgT}
              />
            </div>
          )}
        </section>
      </div>
      
      {/* Footer */}
      <footer className="max-w-6xl mx-auto border-t border-gray-800 pt-6 mt-16 text-center text-sm text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} CPU Scheduling Simulator. All rights
          reserved.
        </p>
        <p className="mt-1">Built with React and Tailwind CSS for educational purposes.</p>
      </footer>
    </main>
  );
}

// Separate component for Simulation Output
interface OutputProps {
  results: ProcessResult[];
  ganttChart: GanttBlock[] | null;
  avgW: number;
  avgT: number;
}

function SimulationOutput({ results, ganttChart, avgW, avgT }: OutputProps) {
  const totalTime = ganttChart ? ganttChart[ganttChart.length - 1].end : 0;
  const processSequence = ganttChart ? ganttChart.map(b => b.pid).join(" → ") : '';

  return (
    // Updated: Use theme CARD_BG_COLOR and rounded corners
    <section className={`p-6 md:p-8 border border-gray-700/50 ${CARD_BG_COLOR} shadow-2xl rounded-xl`}>
      <div className="flex items-center border-b border-gray-700/50 pb-3 mb-6">
        <h2 className={`text-3xl font-bold ${ACCENT_COLOR}`}>🚀 Simulation Results</h2>
      </div>

      {/* Gantt Chart/Timeline */}
      {ganttChart && (
        <>
          <h3 className="text-xl font-semibold mb-3 text-white">
            Gantt Chart Visualization (Total Time: {totalTime} ms)
          </h3>
          
          <div className="overflow-x-auto relative pb-6">
            <div className="flex items-end h-24 min-w-[600px] w-full border-b border-white">
              {ganttChart.map((block, index) => {
                const widthPercentage = (block.duration / totalTime) * 100;
                const bgColor = getProcessColor(block.pid);
                const isIdle = block.pid === "IDLE";
                
                return (
                  <div
                    key={index}
                    // Proportional width based on duration relative to total time
                    style={{ width: `${widthPercentage}%`, minWidth: '40px' }}
                    className={`h-full relative flex flex-col justify-between items-center text-center ${bgColor} border-r border-gray-950 transition-all duration-500 rounded-sm`}
                    title={`${block.pid} | Start: ${block.start} | Duration: ${block.duration}`}
                  >
                    <span className={`text-xs font-bold p-1 ${isIdle ? 'text-gray-300' : 'text-white'}`}>
                      {isIdle ? 'IDLE' : block.pid}
                    </span>
                    <span className="text-[10px] text-gray-200/70 p-1">
                      {isIdle ? '' : `BT: ${block.duration}`}
                    </span>

                    {/* Time Marker Below */}
                    {/* Only show the start time for the very first block, and the end time for all blocks */}
                    {(index === 0 || block.end === totalTime) && (
                        <div className="absolute top-full text-xs font-mono mt-1 text-white whitespace-nowrap" style={{ left: '0' }}>
                            {block.start}
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Display the final time marker at the very end */}
            <div className="absolute top-full text-xs font-mono mt-1 text-white whitespace-nowrap" style={{ right: '0' }}>
                {totalTime}
            </div>
            
          </div>
          
          <p className="mt-8 text-sm text-gray-400 font-mono italic p-3 bg-gray-950 rounded-lg border border-gray-800">
            <span className="text-lime-400 font-bold">Sequence:</span> {processSequence}
          </p>
        </>
      )}
      <hr className="border-gray-800 my-8" />

      {/* Process Metrics Table */}
      <h3 className="text-xl font-semibold mb-4 text-white">
        Detailed Process Metrics
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse rounded-lg overflow-hidden border border-gray-800">
          <thead>
            <tr className="bg-gray-800 text-gray-300 uppercase text-xs">
              <th className="p-3 border-r border-gray-700">P</th>
              <th className="p-3 border-r border-gray-700">Arrival</th>
              <th className="p-3 border-r border-gray-700">Burst</th>
              <th className="p-3 border-r border-gray-700">Completion</th>
              <th className="p-3 border-r border-lime-700 bg-lime-900/40 text-lime-400">Turnaround</th>
              <th className="p-3 bg-cyan-900/40 text-cyan-400">Waiting</th>
            </tr>
          </thead>

          <tbody>
            {results.map((p) => (
              <tr key={p.pid} className={`${CARD_BG_COLOR} hover:bg-gray-800/70 transition-colors border-t border-gray-800`}>
                <td className="p-3 border-r border-gray-800 text-center font-bold">
                  <span className={`px-2 py-1 rounded ${getProcessColor(p.pid)} text-white`}>{p.pid}</span>
                </td>
                <td className="p-3 border-r border-gray-800 text-center text-gray-300">{p.arrival}</td>
                <td className="p-3 border-r border-gray-800 text-center text-gray-300">{p.burst}</td>
                <td className="p-3 border-r border-gray-800 text-center text-gray-300">{p.completion}</td>
                
                {/* Turnaround Time */}
                <td className="p-3 border-r border-lime-800 text-center bg-lime-900/20 text-lime-400 font-semibold text-lg">
                  {p.turnaround.toFixed(2)}
                </td>
                {/* Waiting Time */}
                <td className="p-3 text-center bg-cyan-900/20 text-cyan-400 font-semibold text-lg">
                  {p.waiting.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 border border-lime-400/50 bg-gray-950 rounded-xl flex flex-col md:flex-row justify-around text-xl font-extrabold space-y-4 md:space-y-0">
        <p className="text-gray-300">
          Average Waiting Time:{" "}
          <span className="text-cyan-400">{avgW.toFixed(2)} ms</span>
        </p>
        <p className="text-gray-300">
          Average Turnaround Time:{" "}
          <span className="text-lime-400">{avgT.toFixed(2)} ms</span>
        </p>
      </div>
    </section>
  );
}