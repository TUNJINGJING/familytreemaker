"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { FamilyData } from "@/lib/types/family-data";

// 遵循 SRP: 此组件只负责 D3.js 可视化和配置
interface FamilyChartProps {
  data: FamilyData;
  onDataChange?: (data: FamilyData) => void;
  cardType?: "html" | "svg";
  cardSpacing?: { x: number; y: number };
  fields?: string[];
}

export default function FamilyChartFull({
  data,
  onDataChange,
  cardType = "html",
  cardSpacing = { x: 250, y: 150 },
  fields = ["first name", "last name", "birthday", "avatar"],
}: FamilyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const f3ChartRef = useRef<any>(null);
  const editTreeRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化图表的核心函数
  const initChart = useCallback((f3: any, chartData: FamilyData, isInitial: boolean) => {
    if (chartRef.current) {
      chartRef.current.innerHTML = "";
    }

    // 创建图表
    const chart = f3.createChart(`#family-chart-container`, chartData);
    chart.setTransitionTime(500);
    chart.setCardXSpacing(cardSpacing.x);
    chart.setCardYSpacing(cardSpacing.y);

    // 配置卡片类型
    let card;
    if (cardType === "svg") {
      card = chart.setCardSvg();
      card.setCardDisplay([["first name", "last name"], ["birthday"]]);
      card.setCardDim({ w: 200, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 });
    } else {
      card = chart.setCardHtml();
      card.setCardDisplay([["first name", "last name"], ["birthday"]]);
    }

    // 配置编辑功能（原库的完整功能）
    const editTree = chart.editTree();
    editTree.setFields(fields);
    editTree.setEditFirst(true); // 点击打开编辑表单
    editTree.setCardClickOpen(card);

    // 设置数据变化回调
    if (onDataChange) {
      editTree.setOnChange(() => {
        try {
          const exportedData = editTree.exportData();
          onDataChange(exportedData);
        } catch (error) {
          console.error("Error exporting data:", error);
        }
      });
    }

    // 初始渲染
    chart.updateTree({ initial: isInitial });

    // 保存引用
    f3ChartRef.current = chart;
    editTreeRef.current = editTree;

    // 初始化后自动激活添加亲属模式，显示 Add Father/Mother 等按钮
    setTimeout(() => {
      const mainDatum = chart.getMainDatum();
      if (mainDatum) {
        // 激活添加亲属模式
        editTree.addRelative(mainDatum);
      }
    }, 100);

    return chart;
  }, [cardType, cardSpacing.x, cardSpacing.y, fields, onDataChange]);

  // 初始化图表
  useEffect(() => {
    if (typeof window === "undefined" || !chartRef.current || isInitialized) return;

    import("../../src/index").then((f3Module) => {
      const f3 = f3Module.default;
      initChart(f3, data, true);
      setIsInitialized(true);
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
      f3ChartRef.current = null;
      editTreeRef.current = null;
      setIsInitialized(false);
    };
  }, []); // 只初始化一次

  // 更新配置（当配置变化时重新渲染）
  useEffect(() => {
    if (!isInitialized || !f3ChartRef.current) return;

    import("../../src/index").then((f3Module) => {
      const f3 = f3Module.default;
      let currentData;
      try {
        currentData = editTreeRef.current?.exportData() || f3ChartRef.current.getData();
      } catch {
        currentData = data;
      }
      initChart(f3, currentData, false);
    });
  }, [cardType, cardSpacing.x, cardSpacing.y, fields.join(","), isInitialized, initChart]);

  return (
    <div
      id="family-chart-container"
      ref={chartRef}
      className="f3 f3-cont w-full h-full"
      style={{ minHeight: "600px" }}
    />
  );
}
