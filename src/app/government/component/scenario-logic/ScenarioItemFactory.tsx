import React from "react";
import { Edit2, Trash2, List } from "lucide-react";
import { Scenario } from "./ScenarioTypes";
import { SCENARIO_TYPE_STRATEGY } from "./ScenarioStrategies";

/**
 * [FACTORY METHOD PATTERN] - ScenarioItemFactory: Encapsulates scenario item rendering.
 */
export class ScenarioItemFactory {
  static createItem(
    scenario: Scenario,
    selectedId: number | null,
    onSelect: (scenario: Scenario) => void,
    onEdit: (scenario: Scenario) => void,
    onDelete: (scenario: Scenario) => void,
    t: any
  ) {
    const isSelected = selectedId === scenario.id;
    const { icon: TypeIcon, color: typeColor } = SCENARIO_TYPE_STRATEGY[scenario.type] || { icon: List, color: "text-gray-500" };

    return (
      <div
        key={scenario.id}
        onClick={() => onSelect(scenario)}
        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left group
          ${isSelected
            ? "border-(--color-primary) bg-(--color-primary-bg)/20 shadow-sm"
            : "border-(--color-border) bg-(--color-surface) hover:border-(--color-primary)/50"
          }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 mb-1">
             <span className={typeColor}>
                <TypeIcon size={16} />
             </span>
             <h3 className={`font-bold text-(--text-base) ${isSelected ? "text-(--color-primary)" : "text-(--color-text-primary)"}`}>
                {scenario.name}
             </h3>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(scenario); }}
              className="p-1.5 rounded-sm hover:bg-(--color-bg) text-(--color-text-muted) transition-colors"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(scenario); }}
              className="p-1.5 rounded-sm hover:bg-(--color-danger-bg) hover:text-(--color-danger) text-(--color-text-muted) transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <p className="text-(--color-text-secondary) mb-3 line-clamp-2 text-(--text-xs)">
          {scenario.description}
        </p>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg bg-(--color-bg-secondary) text-(--color-text-secondary) font-medium flex items-center gap-1 text-(--text-xxs)">
            <List size={12} />
            {scenario.steps} {t("scenarioManagement.list.steps")}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
            ${scenario.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {scenario.status}
          </span>
        </div>
      </div>
    );
  }
}
