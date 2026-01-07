"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import type { FamilyData } from "@/lib/types/family-data";
import { loadFamilyData, saveFamilyData } from "@/lib/services/storage";
import { defaultFamilyData } from "@/lib/types/family-data";
import ControlPanel, { ChartConfig, defaultConfig } from "@/components/family-tree/control-panel";

const FamilyChartFull = dynamic(
  () => import("@/components/family-tree/family-chart-full"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center bg-[rgb(33,33,33)]">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-white">Loading Family Tree...</p>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const locale = useLocale();
  const [familyData, setFamilyData] = useState<FamilyData>(defaultFamilyData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [config, setConfig] = useState<ChartConfig>(defaultConfig);

  useEffect(() => {
    const data = loadFamilyData();
    setFamilyData(data);
    setIsLoaded(true);
  }, []);

  const handleDataChange = (newData: FamilyData) => {
    setFamilyData(newData);
    saveFamilyData(newData);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your family tree?")) {
      setFamilyData(defaultFamilyData);
      saveFamilyData(defaultFamilyData);
      // Force re-render by reloading the page
      window.location.reload();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(familyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `family-tree-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen flex-col bg-[rgb(33,33,33)]">
      {/* Header */}
      <header className="border-b border-gray-700 bg-[rgb(40,40,40)] shadow-sm">
        <div className="mx-auto flex h-14 max-w-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <a
              href={`/${locale}`}
              className="text-lg font-bold text-white hover:text-blue-400"
            >
              ← Back to Home
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="rounded-lg border border-gray-600 bg-[rgb(50,50,50)] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(60,60,60)]"
            >
              {showControls ? "Hide" : "Show"} Controls
            </button>
            <button
              onClick={handleExport}
              className="rounded-lg border border-gray-600 bg-[rgb(50,50,50)] px-4 py-2 text-sm font-medium text-white hover:bg-[rgb(60,60,60)]"
            >
              Export JSON
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-red-600 bg-transparent px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-600 hover:text-white"
            >
              Reset Tree
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Control Panel Sidebar */}
        {showControls && (
          <ControlPanel config={config} onChange={setConfig} />
        )}

        {/* Chart Area */}
        <main className="flex-1 overflow-hidden">
          <FamilyChartFull
            data={familyData}
            onDataChange={handleDataChange}
            config={config}
          />
        </main>
      </div>
    </div>
  );
}
