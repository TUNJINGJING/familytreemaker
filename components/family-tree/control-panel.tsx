"use client";

import { useState } from "react";

// 配置类型定义
export interface ChartConfig {
  // Detail Panel
  enableDetailView: boolean;
  viewOnly: boolean;
  editFirst: boolean;

  // Fields
  editableFields: string[];
  displayFields: string[][];

  // Card Elements
  showMiniTree: boolean;
  onCardHoverPathToMain: boolean;

  // Layout Options
  transitionTime: number;
  cardYSpacing: number;
  cardXSpacing: number;
  singleParentEmptyCard: boolean;
  horizontalOrientation: boolean;
  showSiblingsOfMain: boolean;
  showDuplicateBranchToggle: boolean;
  emptyCardLabel: string;
  ancestryDepth: number | null;
  progenyDepth: number | null;
  sortChildrenBy: string;
  sortChildrenDesc: boolean;

  // Card Style
  cardStyle: "image-rect" | "image-circle" | "rect";

  // Card Dimensions
  cardWidth: number;
  cardHeight: number;
  cardHeightAuto: boolean;

  // Image Dimensions
  imageWidth: number;
  imageHeight: number;

  // Image Position
  imageXPosition: number;
  imageYPosition: number;
}

export const defaultConfig: ChartConfig = {
  enableDetailView: true,
  viewOnly: false,
  editFirst: true,
  editableFields: ["first name", "last name", "birthday", "avatar"],
  displayFields: [["first name", "last name"], ["birthday"]],
  showMiniTree: true,
  onCardHoverPathToMain: true,
  transitionTime: 1000,
  cardYSpacing: 150,
  cardXSpacing: 250,
  singleParentEmptyCard: true,
  horizontalOrientation: false,
  showSiblingsOfMain: false,
  showDuplicateBranchToggle: false,
  emptyCardLabel: "ADD",
  ancestryDepth: null,
  progenyDepth: null,
  sortChildrenBy: "false",
  sortChildrenDesc: false,
  cardStyle: "image-rect",
  cardWidth: 200,
  cardHeight: 70,
  cardHeightAuto: true,
  imageWidth: 70,
  imageHeight: 70,
  imageXPosition: 5,
  imageYPosition: 5,
};

interface ControlPanelProps {
  config: ChartConfig;
  onChange: (config: ChartConfig) => void;
}

// 可用字段列表
const availableFields = ["first name", "last name", "birthday", "avatar", "gender", "phone", "email", "address", "notes"];

export default function ControlPanel({ config, onChange }: ControlPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateConfig = <K extends keyof ChartConfig>(key: K, value: ChartConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  // 添加可编辑字段
  const addEditableField = (field: string) => {
    if (!config.editableFields.includes(field)) {
      updateConfig("editableFields", [...config.editableFields, field]);
    }
  };

  // 移除可编辑字段
  const removeEditableField = (field: string) => {
    updateConfig("editableFields", config.editableFields.filter((f) => f !== field));
  };

  // 添加显示行
  const addDisplayRow = () => {
    updateConfig("displayFields", [...config.displayFields, []]);
  };

  // 删除显示行
  const removeDisplayRow = (index: number) => {
    updateConfig("displayFields", config.displayFields.filter((_, i) => i !== index));
  };

  // 切换显示字段
  const toggleDisplayField = (rowIndex: number, field: string) => {
    const newDisplayFields = [...config.displayFields];
    const row = [...newDisplayFields[rowIndex]];
    if (row.includes(field)) {
      newDisplayFields[rowIndex] = row.filter((f) => f !== field);
    } else {
      newDisplayFields[rowIndex] = [...row, field];
    }
    updateConfig("displayFields", newDisplayFields);
  };

  return (
    <div className="w-80 h-full bg-[rgb(33,33,33)] text-white overflow-y-auto text-sm">
      {/* Detail Panel */}
      <Section title="Detail Panel" collapsed={collapsed["detail"]} onToggle={() => toggleSection("detail")}>
        <Toggle label="Enable Detail View" checked={config.enableDetailView} onChange={(v) => updateConfig("enableDetailView", v)} />
        <Toggle label="View Only" checked={config.viewOnly} onChange={(v) => updateConfig("viewOnly", v)} />
        <Toggle label="Edit First (Open Form on Click)" checked={config.editFirst} onChange={(v) => updateConfig("editFirst", v)} />
      </Section>

      {/* Fields */}
      <Section title="Fields" collapsed={collapsed["fields"]} onToggle={() => toggleSection("fields")}>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Editable Fields</span>
            <DropdownAdd
              options={availableFields.filter((f) => !config.editableFields.includes(f))}
              onAdd={addEditableField}
            />
          </div>
          <div className="flex flex-wrap gap-2 p-3 bg-[rgb(50,50,50)] rounded">
            {config.editableFields.map((field) => (
              <Tag key={field} label={field} onRemove={() => removeEditableField(field)} color="blue" />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Display Fields</span>
            <button onClick={addDisplayRow} className="text-xs px-2 py-1 bg-[rgb(60,60,60)] rounded hover:bg-[rgb(80,80,80)]">
              + ADD ROW
            </button>
          </div>
          {config.displayFields.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-2 p-3 bg-[rgb(50,50,50)] rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Row {rowIndex + 1}</span>
                <button onClick={() => removeDisplayRow(rowIndex)} className="text-gray-400 hover:text-red-400">
                  <TrashIcon />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableFields.slice(0, 4).map((field) => (
                  <Tag
                    key={field}
                    label={field}
                    active={row.includes(field)}
                    onClick={() => toggleDisplayField(rowIndex, field)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Card Elements */}
      <Section title="Card Elements" collapsed={collapsed["cardElements"]} onToggle={() => toggleSection("cardElements")}>
        <Toggle label="Show Mini Tree" checked={config.showMiniTree} onChange={(v) => updateConfig("showMiniTree", v)} />
        <Toggle label="On Card Hover Path to Main" checked={config.onCardHoverPathToMain} onChange={(v) => updateConfig("onCardHoverPathToMain", v)} />
      </Section>

      {/* Layout Options */}
      <Section title="Layout Options" collapsed={collapsed["layout"]} onToggle={() => toggleSection("layout")}>
        <NumberInput
          label="Transition Time (ms)"
          value={config.transitionTime}
          onChange={(v) => updateConfig("transitionTime", v)}
          min={0}
          max={5000}
          step={100}
        />
        <Slider label="Card Y Spacing" value={config.cardYSpacing} onChange={(v) => updateConfig("cardYSpacing", v)} min={50} max={300} />
        <Slider label="Card X Spacing" value={config.cardXSpacing} onChange={(v) => updateConfig("cardXSpacing", v)} min={100} max={400} />
        <Toggle label="Single Parent Empty Card" checked={config.singleParentEmptyCard} onChange={(v) => updateConfig("singleParentEmptyCard", v)} />
        <Toggle label="Horizontal Orientation" checked={config.horizontalOrientation} onChange={(v) => updateConfig("horizontalOrientation", v)} />
        <Toggle label="Show Siblings of Main" checked={config.showSiblingsOfMain} onChange={(v) => updateConfig("showSiblingsOfMain", v)} />
        <Toggle label="Show Duplicate Branch Toggle" checked={config.showDuplicateBranchToggle} onChange={(v) => updateConfig("showDuplicateBranchToggle", v)} />
        <TextInput label="Empty Card Label" value={config.emptyCardLabel} onChange={(v) => updateConfig("emptyCardLabel", v)} />
        <NumberInput
          label="Ancestry Depth"
          value={config.ancestryDepth ?? ""}
          onChange={(v) => updateConfig("ancestryDepth", v === "" ? null : v)}
          placeholder="No limit"
        />
        <NumberInput
          label="Progeny Depth"
          value={config.progenyDepth ?? ""}
          onChange={(v) => updateConfig("progenyDepth", v === "" ? null : v)}
          placeholder="No limit"
        />
        <div className="flex items-center gap-2 mb-3">
          <Select
            label="Sort Children By"
            value={config.sortChildrenBy}
            onChange={(v) => updateConfig("sortChildrenBy", v)}
            options={[
              { value: "false", label: "false" },
              { value: "birthday", label: "birthday" },
              { value: "first name", label: "first name" },
            ]}
          />
          <Toggle label="Desc" checked={config.sortChildrenDesc} onChange={(v) => updateConfig("sortChildrenDesc", v)} small />
        </div>
      </Section>

      {/* Card Style */}
      <Section title="Card Style" collapsed={collapsed["cardStyle"]} onToggle={() => toggleSection("cardStyle")}>
        <div className="flex gap-2 mb-4">
          <StyleButton
            active={config.cardStyle === "image-rect"}
            onClick={() => updateConfig("cardStyle", "image-rect")}
            icon="📷"
            label="IMAGE RECT"
          />
          <StyleButton
            active={config.cardStyle === "image-circle"}
            onClick={() => updateConfig("cardStyle", "image-circle")}
            icon="⭕"
            label="IMAGE CIRCLE"
          />
          <StyleButton
            active={config.cardStyle === "rect"}
            onClick={() => updateConfig("cardStyle", "rect")}
            icon="⬜"
            label="RECT"
          />
        </div>

        <h4 className="font-semibold mb-2 text-gray-300">Card Dimensions</h4>
        <p className="text-xs text-gray-500 mb-3">
          It is recommended to look into the styling of this library and adjust dimensions in the css directly.
        </p>
        <Slider label="Card Width" value={config.cardWidth} onChange={(v) => updateConfig("cardWidth", v)} min={100} max={400} />
        <Slider label="Card Height" value={config.cardHeight} onChange={(v) => updateConfig("cardHeight", v)} min={50} max={200} disabled={config.cardHeightAuto} />
        <Toggle label="Card Height Auto" checked={config.cardHeightAuto} onChange={(v) => updateConfig("cardHeightAuto", v)} />

        <h4 className="font-semibold mb-2 mt-4 text-gray-300">Image Dimensions</h4>
        <Slider label="Image Width" value={config.imageWidth} onChange={(v) => updateConfig("imageWidth", v)} min={30} max={150} />
        <Slider label="Image Height" value={config.imageHeight} onChange={(v) => updateConfig("imageHeight", v)} min={30} max={150} />

        <h4 className="font-semibold mb-2 mt-4 text-gray-300">Image Position</h4>
        <Slider label="Image X Position" value={config.imageXPosition} onChange={(v) => updateConfig("imageXPosition", v)} min={0} max={100} />
        <Slider label="Image Y Position" value={config.imageYPosition} onChange={(v) => updateConfig("imageYPosition", v)} min={0} max={100} />
      </Section>
    </div>
  );
}

// Sub-components

function Section({ title, collapsed, onToggle, children }: { title: string; collapsed?: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-700">
      <button className="w-full p-4 flex justify-between items-center hover:bg-[rgb(40,40,40)]" onClick={onToggle}>
        <h3 className="font-bold">{title}</h3>
        <span className="text-gray-400">{collapsed ? "▶" : "▼"}</span>
      </button>
      {!collapsed && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function Toggle({ label, checked, onChange, small }: { label: string; checked: boolean; onChange: (v: boolean) => void; small?: boolean }) {
  return (
    <label className={`flex items-center justify-between ${small ? "" : "mb-3"} cursor-pointer`}>
      <span className={small ? "text-xs" : ""}>{label}</span>
      <div
        className={`relative ${small ? "w-10 h-5" : "w-12 h-6"} rounded-full transition-colors ${checked ? "bg-blue-500" : "bg-gray-600"}`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute ${small ? "w-4 h-4 top-0.5" : "w-5 h-5 top-0.5"} bg-white rounded-full transition-transform ${
            checked ? (small ? "translate-x-5" : "translate-x-6") : "translate-x-0.5"
          }`}
        />
      </div>
    </label>
  );
}

function Slider({ label, value, onChange, min, max, disabled }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; disabled?: boolean }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{value}px</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
      />
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step, placeholder }: { label: string; value: number | string; onChange: (v: any) => void; min?: number; max?: number; step?: number; placeholder?: string }) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-[rgb(50,50,50)] border border-gray-600 rounded text-white"
      />
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[rgb(50,50,50)] border border-gray-600 rounded text-white"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex-1">
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[rgb(50,50,50)] border border-gray-600 rounded text-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Tag({ label, onRemove, onClick, active, color }: { label: string; onRemove?: () => void; onClick?: () => void; active?: boolean; color?: string }) {
  const baseStyle = "px-3 py-1 rounded-full text-xs flex items-center gap-1 cursor-pointer transition-colors";
  const colorStyle = color === "blue" || active ? "bg-blue-500 text-white" : "bg-gray-600 text-gray-300 hover:bg-gray-500";

  return (
    <span className={`${baseStyle} ${colorStyle}`} onClick={onClick}>
      {label}
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="ml-1 hover:text-red-300">
          ×
        </button>
      )}
    </span>
  );
}

function StyleButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-2 py-2 rounded text-xs font-semibold transition-colors ${
        active ? "bg-blue-500 text-white" : "bg-[rgb(50,50,50)] text-gray-300 hover:bg-[rgb(60,60,60)]"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function DropdownAdd({ options, onAdd }: { options: string[]; onAdd: (field: string) => void }) {
  const [open, setOpen] = useState(false);

  if (options.length === 0) return null;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="text-xs px-2 py-1 bg-[rgb(60,60,60)] rounded hover:bg-[rgb(80,80,80)]">
        + ADD FIELD
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-[rgb(50,50,50)] border border-gray-600 rounded shadow-lg z-10">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onAdd(opt); setOpen(false); }}
              className="block w-full px-4 py-2 text-left text-xs hover:bg-[rgb(70,70,70)]"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
