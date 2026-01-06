"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import type { FamilyData } from "@/lib/types/family-data";
import { loadFamilyData, saveFamilyData } from "@/lib/services/storage";
import { defaultFamilyData } from "@/lib/types/family-data";

// 遵循 SoC: 动态加载 D3.js 组件（避免 SSR）
const FamilyChart = dynamic(
  () => import("@/components/family-tree/family-chart"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-white">Loading Family Tree...</p>
      </div>
    </div>
  );
}

// 遵循 SRP: Editor 页面只负责布局和状态管理
export default function EditorPage() {
  const locale = useLocale();
  const [familyData, setFamilyData] = useState<FamilyData>(defaultFamilyData);
  const [isLoaded, setIsLoaded] = useState(false);

  // 加载数据（遵循 KISS: 简单的数据加载）
  useEffect(() => {
    const data = loadFamilyData();
    setFamilyData(data);
    setIsLoaded(true);
  }, []);

  // 保存数据（遵循幂等性: 多次保存结果一致）
  const handleDataChange = (newData: FamilyData) => {
    setFamilyData(newData);
    saveFamilyData(newData);
  };

  // 重置树
  const handleReset = () => {
    if (confirm("Are you sure you want to reset your family tree?")) {
      setFamilyData(defaultFamilyData);
      saveFamilyData(defaultFamilyData);
    }
  };

  // 导出数据（遵循 YAGNI: 只实现基本导出）
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
      {/* Header Toolbar */}
      <header className="border-b border-gray-300 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
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

      {/* Main Editor Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <div className="h-full rounded-lg border-2 border-gray-300 bg-white shadow-lg overflow-hidden">
            {/* 遵循 SoC: 可视化逻辑委托给 FamilyChart 组件 */}
            <FamilyChart data={familyData} onDataChange={handleDataChange} />
          </div>
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="border-t border-gray-300 bg-white py-4">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold">💡 Tip:</span>
              <span>Click on a person to edit or add family members</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">🖱️</span>
              <span>Drag to pan • Scroll to zoom</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">💾</span>
              <span>Auto-saves to your browser</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
