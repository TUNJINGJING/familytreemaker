"use client";

import { useEffect, useRef, useCallback } from "react";
import type { FamilyData } from "@/lib/types/family-data";
import type { ChartConfig } from "./control-panel";

interface FamilyChartProps {
  data: FamilyData;
  onDataChange?: (data: FamilyData) => void;
  config: ChartConfig;
}

export default function FamilyChartFull({
  data,
  onDataChange,
  config,
}: FamilyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const f3Ref = useRef<any>(null);
  const chartInstanceRef = useRef<any>(null);
  const editTreeRef = useRef<any>(null);
  const cardRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

  // 应用配置到图表（不重建图表）
  const applyConfig = useCallback((chart: any, editTree: any, card: any, f3: any) => {
    if (!chart) return;

    // Layout Options
    chart.setTransitionTime(config.transitionTime);
    chart.setCardXSpacing(config.cardXSpacing);
    chart.setCardYSpacing(config.cardYSpacing);

    // Orientation
    if (config.horizontalOrientation) {
      chart.setOrientationHorizontal();
    } else {
      chart.setOrientationVertical();
    }

    // Single Parent Empty Card
    chart.setSingleParentEmptyCard(config.singleParentEmptyCard, { label: config.emptyCardLabel });

    // Show Siblings of Main
    chart.setShowSiblingsOfMain(config.showSiblingsOfMain);

    // Duplicate Branch Toggle
    chart.setDuplicateBranchToggle(config.showDuplicateBranchToggle);

    // Ancestry/Progeny Depth
    if (config.ancestryDepth !== null) {
      chart.setAncestryDepth(config.ancestryDepth);
    }
    if (config.progenyDepth !== null) {
      chart.setProgenyDepth(config.progenyDepth);
    }

    // Sort Children
    if (config.sortChildrenBy !== "false") {
      const field = config.sortChildrenBy;
      const desc = config.sortChildrenDesc;
      chart.setSortChildrenFunction((a: any, b: any) => {
        const aVal = a.data.data[field] || "";
        const bVal = b.data.data[field] || "";
        return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      });
    } else {
      chart.setSortChildrenFunction(null);
    }

    // Edit Tree settings
    if (editTree) {
      editTree.setFields(config.editableFields);
      editTree.setEditFirst(config.editFirst);

      if (config.viewOnly) {
        editTree.setNoEdit();
      } else {
        editTree.setEdit();
      }
    }

    // Card settings
    if (card) {
      card.setCardDisplay(config.displayFields);

      // Mini tree
      if (config.showMiniTree) {
        card.setMiniTree(true);
      } else {
        card.setMiniTree(false);
      }

      // Path to main on hover
      if (config.onCardHoverPathToMain) {
        card.setOnHoverPathToMain(true);
      } else {
        card.setOnHoverPathToMain(false);
      }

      // Card dimensions for HTML cards
      if (config.cardStyle === "image-rect" || config.cardStyle === "image-circle" || config.cardStyle === "rect") {
        try {
          const cardDim: any = {
            w: config.cardWidth,
            img_w: config.imageWidth,
            img_h: config.imageHeight,
            img_x: config.imageXPosition,
            img_y: config.imageYPosition,
          };
          if (!config.cardHeightAuto) {
            cardDim.h = config.cardHeight;
          }
          card.setCardDim(cardDim);
        } catch (e) {
          // Some card types may not support setCardDim
        }
      }
    }
  }, [config]);

  // 初始化图表（只执行一次）
  useEffect(() => {
    if (typeof window === "undefined" || !chartRef.current || isInitializedRef.current) return;

    import("../../src/index").then((f3Module) => {
      const f3 = f3Module.default;
      f3Ref.current = f3;

      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }

      // 创建图表
      const chart = f3.createChart("#family-chart-container", data);
      chartInstanceRef.current = chart;

      // 创建卡片
      let card;
      if (config.cardStyle === "image-circle") {
        card = chart.setCardHtml();
        card.setStyle("imageCircle");
      } else if (config.cardStyle === "rect") {
        card = chart.setCardHtml();
        card.setStyle("rect");
      } else {
        card = chart.setCardHtml();
        card.setStyle("imageRect");
      }
      cardRef.current = card;

      // 创建编辑树
      const editTree = chart.editTree();
      editTreeRef.current = editTree;

      // 设置卡片点击
      if (config.enableDetailView) {
        editTree.setCardClickOpen(card);
      }

      // 数据变化回调
      if (onDataChange) {
        editTree.setOnChange(() => {
          try {
            const exportedData = editTree.exportData() as FamilyData;
            onDataChange(exportedData);
          } catch (error) {
            console.error("Error exporting data:", error);
          }
        });
      }

      // 应用配置
      applyConfig(chart, editTree, card, f3);

      // 初始渲染
      chart.updateTree({ initial: true });

      // 初始化后激活添加亲属模式
      setTimeout(() => {
        const mainDatum = chart.getMainDatum();
        if (mainDatum && !config.viewOnly) {
          editTree.addRelative(mainDatum);
        }
      }, 100);

      isInitializedRef.current = true;
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
      chartInstanceRef.current = null;
      editTreeRef.current = null;
      cardRef.current = null;
      isInitializedRef.current = false;
    };
  }, []); // 只初始化一次

  // 监听配置变化，实时更新（不重建图表）
  useEffect(() => {
    if (!isInitializedRef.current || !chartInstanceRef.current) return;

    const chart = chartInstanceRef.current;
    const editTree = editTreeRef.current;
    const card = cardRef.current;
    const f3 = f3Ref.current;

    // 应用新配置
    applyConfig(chart, editTree, card, f3);

    // 更新树（使用配置的 transition time 实现平滑过渡）
    chart.updateTree({ initial: false });
  }, [
    config.transitionTime,
    config.cardXSpacing,
    config.cardYSpacing,
    config.horizontalOrientation,
    config.singleParentEmptyCard,
    config.emptyCardLabel,
    config.showSiblingsOfMain,
    config.showDuplicateBranchToggle,
    config.ancestryDepth,
    config.progenyDepth,
    config.sortChildrenBy,
    config.sortChildrenDesc,
    config.editableFields,
    config.displayFields,
    config.editFirst,
    config.viewOnly,
    config.showMiniTree,
    config.onCardHoverPathToMain,
    config.cardWidth,
    config.cardHeight,
    config.cardHeightAuto,
    config.imageWidth,
    config.imageHeight,
    config.imageXPosition,
    config.imageYPosition,
    applyConfig,
  ]);

  // 监听卡片样式变化（需要重建卡片）
  useEffect(() => {
    if (!isInitializedRef.current || !chartInstanceRef.current || !f3Ref.current) return;

    const chart = chartInstanceRef.current;
    const f3 = f3Ref.current;

    // 重建卡片
    let card;
    if (config.cardStyle === "image-circle") {
      card = chart.setCardHtml();
      try { card.setStyle("imageCircle"); } catch (e) {}
    } else if (config.cardStyle === "rect") {
      card = chart.setCardHtml();
      try { card.setStyle("rect"); } catch (e) {}
    } else {
      card = chart.setCardHtml();
      try { card.setStyle("imageRect"); } catch (e) {}
    }
    cardRef.current = card;

    // 重新设置编辑树的卡片点击
    if (editTreeRef.current && config.enableDetailView) {
      editTreeRef.current.setCardClickOpen(card);
    }

    // 应用配置
    applyConfig(chart, editTreeRef.current, card, f3);

    // 更新树
    chart.updateTree({ initial: false });
  }, [config.cardStyle, config.enableDetailView, applyConfig]);

  return (
    <div
      id="family-chart-container"
      ref={chartRef}
      className="f3 f3-cont w-full h-full"
      style={{ minHeight: "600px" }}
    />
  );
}
