"use client";

import React from "react";
import { MapPin, Navigation, GripVertical, Edit2, Bell, Trash2 } from "lucide-react";

/**
 * Abstract Factory Interface for Favorite Item Rendering (Bridge Pattern)
 */
export interface FavoriteItemRenderer {
  renderIcon(): React.ReactNode;
  renderContent(item: any): React.ReactNode;
}

/**
 * Concrete Renderer for Location Favorites
 */
export class LocationItemRenderer implements FavoriteItemRenderer {
  renderIcon() {
    return (
      <div className="p-2 rounded-xl bg-(--color-bg-secondary)">
        <MapPin className="text-(--color-text-secondary)" size={20} />
      </div>
    );
  }

  renderContent(item: any) {
    return (
      <div className="min-w-0">
        <p className="m-0 font-semibold text-[var(--text-sm)] sm:text-[var(--text-base)] text-[var(--color-text-primary)]">
          {item.name}
        </p>
        <span className="text-[var(--text-xs)] sm:text-[var(--text-sm)] text-[var(--color-text-secondary)]">
          {item.address}
        </span>
      </div>
    );
  }
}

/**
 * Concrete Renderer for Route Favorites
 */
export class RouteItemRenderer implements FavoriteItemRenderer {
  renderIcon() {
    return (
      <div className="p-2 rounded-xl bg-(--color-primary-bg)">
        <Navigation className="text-[var(--color-primary)]" size={20} />
      </div>
    );
  }

  renderContent(item: any) {
    return (
      <div className="min-w-0">
        <p className="m-0 font-semibold text-[var(--text-sm)] sm:text-[var(--text-base)] text-[var(--color-text-primary)]">
          {item.name}
        </p>
        <div className="flex flex-col gap-0.5 mt-1">
          <div className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="truncate">{item.origin.address}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--text-xs)] text-[var(--color-text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="truncate">{item.destination.address}</span>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Generic Favorite Item Component (Composite Pattern)
 */
export function FavoriteItem({ item, index, renderer, onDragStart, onDragOver, onDrop, commands }: any) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[var(--color-bg)] rounded-[var(--radius-lg)] cursor-move hover:bg-[var(--color-bg-secondary)] transition-colors group border border-[var(--color-border)]"
    >
      <div className="flex gap-3 items-center min-w-0 flex-1">
        <GripVertical
          size={18}
          className="text-[var(--color-text-muted)] flex-shrink-0 cursor-grab active:cursor-grabbing"
        />
        {renderer.renderIcon()}
        <div className="min-w-0 flex-1">
          <span className="text-[10px] uppercase font-black text-(--color-text-muted)/30 absolute top-2 right-4">
             #{index + 1}
          </span>
          {renderer.renderContent(item)}
        </div>
      </div>
      
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={() => commands.edit(item)}
          className="w-10 h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors cursor-pointer text-[var(--color-text-primary)]"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => commands.alert(item)}
          className="w-10 h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors cursor-pointer text-[var(--color-text-primary)]"
        >
          <Bell size={16} />
        </button>
        <button
          onClick={() => commands.delete(item)}
          className="w-10 h-10 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center hover:bg-[var(--color-bg)] transition-colors cursor-pointer text-[var(--color-danger)]"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
