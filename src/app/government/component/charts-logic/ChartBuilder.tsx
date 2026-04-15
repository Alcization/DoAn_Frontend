import React from "react";

/**
 * [BUILDER PATTERN] - SVGChartBuilder: A internal utility to construct SVG parts consistently.
 */
export class SVGChartBuilder {
  private points: string[] = [];

  addLinePoint(x: number, y: number) {
    this.points.push(`${x},${y}`);
    return this;
  }

  buildPolyline(color: string, strokeWidth: number = 1.5) {
    return (
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        points={this.points.join(" ")}
      />
    );
  }

  buildGradientPath(id: string, color: string) {
    const pointsStr = this.points.join(" ");
    return (
      <>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline 
          fill={`url(#${id})`} 
          points={`${this.points[0].split(',')[0]},38 ${pointsStr} ${this.points[this.points.length-1].split(',')[0]},38`} 
        />
      </>
    );
  }
}
