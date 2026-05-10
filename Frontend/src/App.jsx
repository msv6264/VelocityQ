import { useEffect, useState } from "react";

export default function App() {
  const [trafficData, setTrafficData] = useState({
    mainRoad: 16,
    incomingRoad: 18,
    mainRoadBreakdown: { car: 8, bus: 2, truck: 1, motorcycle: 5 },
    incomingRoadBreakdown: { car: 10, bus: 1, truck: 2, motorcycle: 5 },
    trafficLevel: "MEDIUM",
    signalMain: "RED",
    signalIncoming: "GREEN",
    activeLane: "Incoming Road",
    greenTime: 35,
    prediction: "Moderate Congestion",
    ambulance: false,
  });

  useEffect(() => {
    async function fetchTrafficData() {
      try {
        const response = await fetch("http://127.0.0.1:5000/traffic");

        const data = await response.json();

        setTrafficData(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchTrafficData();

    const interval = setInterval(fetchTrafficData, 500);

    return () => clearInterval(interval);
  }, []);

  const signalColor = {
    GREEN: "bg-green-500",
    YELLOW: "bg-yellow-400",
    RED: "bg-red-500",
  };

  const vehicleColors = {
    car: "bg-blue-400",
    bus: "bg-orange-400",
    truck: "bg-purple-400",
    motorcycle: "bg-pink-400",
    ambulance: "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-violet-400">VelocitiQ</h1>

            <p className="text-slate-400 mt-2 text-lg">
              AI Powered Smart Junction Optimization System
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 px-6 py-4 rounded-3xl">
            <p className="text-slate-400 text-sm">System Status</p>
            <h2 className="text-2xl font-bold text-green-400">ACTIVE</h2>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
            <p className="text-slate-400 text-lg">Main Road Vehicles</p>
            <h2 className="text-5xl font-bold mt-4 text-violet-400">
              {trafficData.mainRoad}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
            <p className="text-slate-400 text-lg">Incoming Road Vehicles</p>
            <h2 className="text-5xl font-bold mt-4 text-cyan-400">
              {trafficData.incomingRoad}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
            <p className="text-slate-400 text-lg">Traffic Level</p>
            <h2 className="text-4xl font-bold mt-4 text-yellow-400">
              {trafficData.trafficLevel}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
            <p className="text-slate-400 text-lg">Optimized Green Time</p>
            <h2 className="text-5xl font-bold mt-4 text-green-400">
              {trafficData.greenTime}s
            </h2>
          </div>
        </div>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Junction Intelligence
              </h2>

              <div
                className={`w-8 h-8 rounded-full ${signalColor[trafficData.signalMain || 'RED']}`}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <p className="text-slate-400 mb-3 text-lg">Prediction</p>

                <h3 className="text-3xl font-bold text-blue-400">
                  {trafficData.prediction}
                </h3>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <p className="text-slate-400 mb-3 text-lg">Active Lane</p>

                <h3 className="text-3xl font-bold text-white">
                  {trafficData.activeLane || "Main Road"}
                </h3>
              </div>
            </div>

            {/* ROAD VISUALIZATION */}
            <div className="bg-slate-950 rounded-3xl h-[400px] flex items-center justify-center relative overflow-hidden border border-slate-700">
              {/* Horizontal Road */}
              <div className="absolute w-full h-28 bg-slate-700"></div>

              {/* Vertical Road */}
              <div className="absolute h-full w-28 bg-slate-700"></div>

              {/* Main Road Signal (Controls Horizontal Traffic) */}
              <div className="absolute right-[55%] top-[65%] flex flex-col gap-1 p-1 bg-slate-800 border-2 border-slate-700 rounded-lg z-20 shadow-xl">
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 ${trafficData.signalMain === 'RED' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]' : 'bg-slate-900/50'}`}></div>
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 ${trafficData.signalMain === 'YELLOW' ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,1)]' : 'bg-slate-900/50'}`}></div>
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 ${trafficData.signalMain === 'GREEN' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]' : 'bg-slate-900/50'}`}></div>
                 <span className="absolute -top-6 -left-2 text-xs text-slate-400 font-bold whitespace-nowrap">Main Light</span>
              </div>

              {/* Incoming Road Signal (Controls Vertical Traffic) */}
              <div className="absolute bottom-[55%] left-[60%] flex flex-row gap-1 p-1 bg-slate-800 border-2 border-slate-700 rounded-lg z-20 shadow-xl">
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 ${trafficData.signalIncoming === 'RED' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)]' : 'bg-slate-900/50'}`}></div>
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 ${trafficData.signalIncoming === 'YELLOW' ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,1)]' : 'bg-slate-900/50'}`}></div>
                 <div className={`w-3 h-3 rounded-full transition-all duration-300 ${trafficData.signalIncoming === 'GREEN' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]' : 'bg-slate-900/50'}`}></div>
                 <span className="absolute -left-20 top-0.5 text-xs text-slate-400 font-bold whitespace-nowrap">Incoming Light</span>
              </div>

              {/* Cars */}
              <div className="absolute right-[55%] top-[45%] flex flex-row-reverse gap-3">
                {(() => {
                  const breakdown = trafficData.mainRoadBreakdown || { car: trafficData.mainRoad || 0 };
                  const types = Object.keys(breakdown);
                  const counts = { ...breakdown };
                  const interleaved = [];
                  let hasMore = true;
                  while (hasMore) {
                    hasMore = false;
                    for (const type of types) {
                      if (counts[type] > 0) {
                        interleaved.push(type);
                        counts[type]--;
                        hasMore = true;
                      }
                    }
                  }
                  
                  return interleaved.map((type, idx) => (
                    <div
                      key={`main-${idx}`}
                      className={`w-10 h-6 rounded shadow-sm ${vehicleColors[type] || vehicleColors.car} ${trafficData.signalMain === 'GREEN' ? 'animate-drive-right' : ''}`}
                      style={{ animationDelay: `${idx * 0.4}s` }}
                    ></div>
                  ));
                })()}
              </div>

              <div className="absolute bottom-[55%] left-[48%] flex flex-col-reverse gap-3">
                {(() => {
                  const breakdown = trafficData.incomingRoadBreakdown || { car: trafficData.incomingRoad || 0 };
                  const types = Object.keys(breakdown);
                  const counts = { ...breakdown };
                  const interleaved = [];
                  let hasMore = true;
                  while (hasMore) {
                    hasMore = false;
                    for (const type of types) {
                      if (counts[type] > 0) {
                        interleaved.push(type);
                        counts[type]--;
                        hasMore = true;
                      }
                    }
                  }
                  
                  return interleaved.map((type, idx) => (
                    <div
                      key={`inc-${idx}`}
                      className={`w-6 h-10 rounded shadow-sm ${vehicleColors[type] || vehicleColors.car} ${trafficData.signalIncoming === 'GREEN' ? 'animate-drive-down' : ''}`}
                      style={{ animationDelay: `${idx * 0.4}s` }}
                    ></div>
                  ));
                })()}
              </div>
            </div>

            {/* LIVE AI VISION FEED */}
            <div className="mt-8 bg-slate-800/50 p-6 rounded-3xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                Live AI Vision Feed
              </h3>
              <div className="rounded-xl overflow-hidden border-2 border-slate-600 shadow-2xl relative bg-black aspect-[2/1]">
                <img 
                  src="http://127.0.0.1:5000/video_feed" 
                  alt="AI Video Feed" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden absolute inset-0 items-center justify-center text-slate-500 flex-col gap-2">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Backend Video Stream Offline</span>
                </div>
              </div>
            </div>

            {/* LEGEND */}
            <div className="mt-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <p className="text-sm text-slate-400 mb-3 font-semibold">Vehicle Types Detected</p>
              <div className="flex flex-wrap gap-6">
                {Object.entries(vehicleColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-sm shadow-md ${color}`}></div>
                    <span className="text-slate-300 capitalize text-sm">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">
            {/* Ambulance Alert */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
              <p className="text-slate-400 text-lg mb-4">
                Emergency Vehicle Status
              </p>

              {trafficData.ambulance ? (
                <div>
                  <h2 className="text-3xl font-bold text-red-400 mb-3">
                    Ambulance Detected
                  </h2>

                  <p className="text-slate-300 text-lg">
                    Activating Smart Green Corridor
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-bold text-green-400 mb-3">
                    No Emergency
                  </h2>

                  <p className="text-slate-300 text-lg">
                    Junction operating normally
                  </p>
                </div>
              )}
            </div>

            {/* AI Insights */}
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 text-violet-400">
                AI Insights
              </h2>

              <div className="space-y-5">
                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                  <p className="text-slate-400 mb-2">Congestion Risk</p>

                  <h3 className="text-2xl font-bold text-yellow-400">
                    {trafficData.trafficLevel}
                  </h3>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                  <p className="text-slate-400 mb-2">Traffic Optimization</p>

                  <h3 className="text-2xl font-bold text-cyan-400">
                    Adaptive Signals Active
                  </h3>
                </div>

                <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                  <p className="text-slate-400 mb-2">Multi-Camera Analysis</p>

                  <h3 className="text-2xl font-bold text-green-400">
                    Monitoring Nearby Roads
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
