"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import type { FamilyData } from "@/lib/types/family-data";
import { loadFamilyData, saveFamilyData } from "@/lib/services/storage";
import { defaultFamilyData } from "@/lib/types/family-data";

const FamilyChartFull = dynamic(
  () => import("@/components/family-tree/family-chart-full"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center bg-gray-900">
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

  // 控制面板状态
  const [showControls, setShowControls] = useState(true);
  const [cardType, setCardType] = useState<"html" | "svg">("html");
  const [spacing, setSpacing] = useState({ x: 250, y: 150 });
  const [fields, setFields] = useState(["first name", "last name", "birthday", "avatar"]);

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
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Header */}
      <header className="border-b border-gray-300 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <a
              href={`/${locale}`}
              className="text-xl font-bold text-gray-900 hover:text-blue-600"
            >
              ← Back to Home
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {showControls ? "Hide" : "Show"} Controls
            </button>
            <button
              onClick={handleExport}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Export JSON
            </button>
            <button
              onClick={handleReset}
              className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
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
          <aside className="w-80 border-r border-gray-300 bg-white overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Settings</h2>
              </div>

              {/* Card Style */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Style
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCardType("html")}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      cardType === "html"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    HTML Cards
                  </button>
                  <button
                    onClick={() => setCardType("svg")}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      cardType === "svg"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    SVG Cards
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  HTML cards support more customization. SVG cards are more performant.
                </p>
              </div>

              {/* Spacing Controls */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Spacing
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Horizontal Spacing: {spacing.x}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      value={spacing.x}
                      onChange={(e) =>
                        setSpacing({ ...spacing, x: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Vertical Spacing: {spacing.y}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="300"
                      value={spacing.y}
                      onChange={(e) =>
                        setSpacing({ ...spacing, y: parseInt(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Fields Configuration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Display Fields
                </label>
                <div className="space-y-2">
                  {["first name", "last name", "birthday", "avatar", "gender"].map((field) => (
                    <label key={field} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={fields.includes(field)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFields([...fields, field]);
                          } else {
                            setFields(fields.filter((f) => f !== field));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{field}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Select which fields to show on the cards and in the edit form.
                </p>
              </div>

              {/* Info Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">How to Use</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">👆</span>
                    <span>Click on a person to view/edit details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">➕</span>
                    <span>Use the + buttons to add family members</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🖱️</span>
                    <span>Drag to pan, scroll to zoom</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">💾</span>
                    <span>Changes auto-save to your browser</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        )}

        {/* Chart Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            <FamilyChartFull
              data={familyData}
              onDataChange={handleDataChange}
              cardType={cardType}
              cardSpacing={spacing}
              fields={fields}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
