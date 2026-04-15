import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { ManagedArea } from "./AreaTableTypes";
import { getHotspotDotClass } from "./AreaTableStrategies";

/**
 * [FACTORY METHOD PATTERN] - AreaRowFactory: Encapsulates row rendering.
 */
export class AreaRowFactory {
  static createRow(
    area: ManagedArea, 
    t: any, 
    onEdit: (area: ManagedArea) => void, 
    onDelete: (area: ManagedArea) => void
  ) {
    return (
      <tr key={area.id} className="hover:bg-(--color-bg)/50 transition-colors group">
        <td className="p-4">
          <div className="flex flex-col">
            <span className="font-bold text-(--color-text-primary)">{area.name}</span>
            <span className="text-(--text-xxs) mt-0.5 text-(--color-text-secondary)">
              {t("areaManagement.table.boundary")}: {area.boundary}
            </span>
          </div>
        </td>
        <td className="p-4 text-(--text-sm) font-medium text-(--color-text-secondary)">
          {area.adminUnit}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-(--color-text-primary)">{area.hotspotCount}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${getHotspotDotClass(area.hotspotCount)}`} />
          </div>
        </td>
        <td className="p-4 text-right">
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => onEdit(area)}
              className="p-2 rounded-sm border border-(--color-border) hover:bg-(--color-bg) text-(--color-text-secondary) transition-all hover:scale-110"
              title={t("areaManagement.actions.edit")}
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(area)}
              className="p-2 rounded-sm border border-(--color-border) hover:bg-(--color-danger-bg) hover:text-(--color-danger) text-(--color-text-secondary) transition-all hover:scale-110"
              title={t("areaManagement.actions.delete")}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }
}
