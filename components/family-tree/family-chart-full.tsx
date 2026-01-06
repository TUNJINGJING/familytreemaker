"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化图表
  useEffect(() => {
    if (typeof window === "undefined" || !chartRef.current || isInitialized) return;

    import("../../src/index").then((f3Module) => {
      const f3 = f3Module.default;

      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }

      // 创建图表
      const chart = f3.createChart(`#family-chart-container`, data);
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

      // 初始渲染
      chart.updateTree({ initial: true });

      // 保存引用
      f3ChartRef.current = chart;
      setIsInitialized(true);

      // 数据同步
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
        }, 2000);

        return () => clearInterval(syncInterval);
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
      f3ChartRef.current = null;
      setIsInitialized(false);
    };
  }, []); // 只初始化一次

  // 更新配置（当配置变化时重新渲染）
  useEffect(() => {
    if (!isInitialized || !f3ChartRef.current) return;

    // 重新创建图表以应用新配置
    import("../../src/index").then((f3Module) => {
      const f3 = f3Module.default;

      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }

      const currentData = f3ChartRef.current.getData();
      const chart = f3.createChart(`#family-chart-container`, currentData);
      chart.setTransitionTime(500);
      chart.setCardXSpacing(cardSpacing.x);
      chart.setCardYSpacing(cardSpacing.y);

      let card;
      if (cardType === "svg") {
        card = chart.setCardSvg();
        card.setCardDisplay([["first name", "last name"], ["birthday"]]);
        card.setCardDim({ w: 200, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 });
      } else {
        card = chart.setCardHtml();
        card.setCardDisplay([["first name", "last name"], ["birthday"]]);
      }

      const editTree = chart.editTree();
      editTree.setFields(fields);
      editTree.setEditFirst(true);
      editTree.setCardClickOpen(card);

      chart.updateTree({ initial: false });

      f3ChartRef.current = chart;
    });
  }, [cardType, cardSpacing.x, cardSpacing.y, fields.join(",")]);

  return (
    <div
      id="family-chart-container"
      ref={chartRef}
      className="f3 w-full h-full bg-gray-900 text-white"
      style={{ minHeight: "600px" }}
    />
  );
}
