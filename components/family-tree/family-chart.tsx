"use client";

import { useEffect, useRef } from "react";
import type { FamilyData } from "@/lib/types/family-data";

// 遵循 SRP: 此组件只负责 D3.js 可视化渲染
interface FamilyChartProps {
  data: FamilyData;
  onDataChange?: (data: FamilyData) => void;
}

export default function FamilyChart({ data, onDataChange }: FamilyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const f3ChartRef = useRef<any>(null);

  useEffect(() => {
    // 遵循 KISS: 只在客户端加载 D3.js
    if (typeof window === "undefined" || !chartRef.current) return;

    // 动态导入 family-chart（避免 SSR 问题）
    import("../../src/index").then((f3Module) => {
      const f3 = f3Module.default;

      // 清理旧的图表
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }

      // 创建家族树图表
      const chart = f3.createChart(`#family-chart-container`, data);
      chart.setTransitionTime(500);
      chart.setCardXSpacing(250);
      chart.setCardYSpacing(150);

      // 配置卡片显示
      const card = chart.setCardHtml();
      card.setCardDisplay([
        ["first name", "last name"],
        ["birthday"],
      ]);

      // 配置编辑功能（遵循 YAGNI: 基本编辑功能）
      const editTree = chart.editTree();
      editTree.setFields(["first name", "last name", "birthday", "gender"]);
      editTree.setEditFirst(true);
      editTree.setCardClickOpen(card);

      // 初始渲染
      chart.updateTree({ initial: true });

      // 保存引用
      f3ChartRef.current = chart;

      // 遵循 KISS: 简单的数据同步（定时检查）
      if (onDataChange) {
        const syncInterval = setInterval(() => {
          if (f3ChartRef.current) {
            try {
              const currentData = f3ChartRef.current.getData();
              onDataChange(currentData);
            } catch (error) {
              console.error("Error syncing data:", error);
            }
          }
        }, 2000); // 每 2 秒同步一次

        // 清理定时器
        return () => clearInterval(syncInterval);
      }
    });

    // 清理函数
    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
      f3ChartRef.current = null;
    };
  }, []); // 只在挂载时初始化

  return (
    <div
      id="family-chart-container"
      ref={chartRef}
      className="f3 w-full h-full bg-gray-900 text-white rounded-lg"
      style={{ minHeight: "600px" }}
    />
  );
}
