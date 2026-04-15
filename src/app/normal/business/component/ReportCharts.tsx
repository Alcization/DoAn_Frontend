"use client";

import { useTranslation } from "react-i18next";
import { TrendingUp, PieChart, Loader2 } from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { WEATHER_DISTRIBUTION, CHART_SERIES } from "@/context/services/mock/normal/business/reports";
import { useTheme } from "@/context/theme/ThemeContext";

// --- CUSTOM HOOK LẤY DỮ LIỆU TỪ OPENWEATHER HISTORY 2.5 ---
export interface WeatherDataPoint {
  label: string;
  temp: number;
  rain: number;
  wind: number;
  weatherId: number;
}

export function useOpenWeatherHistory(lat?: number, lng?: number, timeRange: string = "24h") {
  const [chartData, setChartData] = useState<WeatherDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lng) {
      setChartData([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "YOUR_API_KEY";
        
        const end = Math.floor(Date.now() / 1000);
        const start = timeRange === "24h" ? end - 86400 : end - 604800;

        const url = `https://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lng}&type=hour&start=${start}&end=${end}&units=metric&appid=${API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Lỗi gọi API: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (!result.list || result.list.length === 0) {
          throw new Error("Không có dữ liệu lịch sử trong khoảng thời gian này.");
        }

        // --- Cập nhật Step ---
        // 24h: lấy mỗi 1 tiếng = lấy tất cả 24 điểm
        // 7 days: lấy mỗi 24 tiếng = lấy 7 điểm
        const step = timeRange === "24h" ? 1 : 24;
        const filteredList = result.list.filter((_: any, index: number) => index % step === 0);

        const formattedData: WeatherDataPoint[] = filteredList.map((item: any) => {
          const date = new Date(item.dt * 1000);
          
          // Định dạng label theo yêu cầu
          let labelStr = "";
          if (timeRange === "24h") {
            labelStr = `${date.getHours()}h`;
          } else {
            // Chỉ lấy Thứ (Ví dụ: Thứ Hai, Thứ Ba...) và viết hoa chữ cái đầu cho đẹp
            const weekday = date.toLocaleDateString("vi-VN", { weekday: "long" });
            labelStr = weekday.charAt(0).toUpperCase() + weekday.slice(1);
          }

          return {
            label: labelStr,
            temp: item.main?.temp || 0,
            rain: item.rain ? item.rain["1h"] || 0 : 0,
            wind: item.wind?.speed || 0,
            weatherId: item.weather && item.weather.length > 0 ? item.weather[0].id : 800,
          };
        });

        setChartData(formattedData);
      } catch (err: any) {
        console.error("Lỗi fetch dữ liệu thời tiết:", err);
        setError("Không thể tải dữ liệu thời tiết. (Vui lòng kiểm tra gói API Key của bạn).");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [lat, lng, timeRange]);

  return { chartData, isLoading, error };
}

// --- WEATHER TREND CHART ---
interface WeatherTrendChartProps {
  timeRange: string;
  lat?: number;
  lng?: number;
}

export function WeatherTrendChart({ timeRange, lat, lng }: WeatherTrendChartProps) {
  const { t } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const { chartData, isLoading, error } = useOpenWeatherHistory(lat, lng, timeRange);

  const series = CHART_SERIES;

  // Chart layout
  const W = 480;
  const H = 260;
  const padLeft = 40;
  const padRight = 40;
  const padTop = 16;
  const padBottom = 32;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  const maxY = useMemo(() => {
    if (!chartData.length) return 40;
    let max = 0;
    for (const d of chartData) {
      max = Math.max(max, d.temp, d.rain, d.wind);
    }
    return Math.ceil(max / 5) * 5 + 5;
  }, [chartData]);

  if (!lat || !lng) {
    return (
      <div className="bg-(--color-surface) rounded-3xl p-4 sm:p-6 shadow-(--shadow-md) border border-(--color-border) flex items-center justify-center min-h-[300px]">
        <span className="text-(--color-text-secondary)">Vui lòng chọn một tuyến đường để xem dữ liệu</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-(--color-surface) rounded-3xl p-4 sm:p-6 shadow-(--shadow-md) border border-(--color-border) flex flex-col items-center justify-center gap-2 min-h-[300px]">
        <Loader2 className="animate-spin text-(--color-primary)" size={32} />
        <span className="text-(--color-text-secondary)">Đang tải dữ liệu thời tiết...</span>
      </div>
    );
  }

  if (error || !chartData.length) {
    return (
      <div className="bg-(--color-surface) rounded-3xl p-4 sm:p-6 shadow-(--shadow-md) border border-(--color-border) flex items-center justify-center min-h-[300px]">
        <span className="text-red-500">{error || "Không có dữ liệu cho tuyến đường này."}</span>
      </div>
    );
  }

  const getX = (i: number) => padLeft + (i / (chartData.length - 1)) * chartW;
  const getY = (val: number) => padTop + chartH - (val / maxY) * chartH;

  const buildSmoothPath = (key: "temp" | "rain" | "wind") => {
    const points = chartData.map((d, i) => ({ x: getX(i), y: getY(d[key]) }));
    if (points.length < 2) return "";

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const tension = 0.3;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const buildAreaPath = (key: "temp" | "rain" | "wind") => {
    const linePath = buildSmoothPath(key);
    const lastX = getX(chartData.length - 1);
    const firstX = getX(0);
    const bottomY = padTop + chartH;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => (maxY / yTickCount) * i);

  return (
    <div className="bg-(--color-surface) rounded-3xl p-4 sm:p-6 shadow-(--shadow-md) border border-(--color-border)">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-(--color-primary)">
          <TrendingUp size={20} />
          <h2 className="m-0 text-(--text-lg) sm:text-(--text-xl) text-(--color-text-primary)">
            {t("businessReports.charts.weatherTrend")}
          </h2>
        </div>
        <div className="flex gap-4 flex-wrap">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[11px] text-(--color-text-secondary)">
                {t(`businessReports.kpi.${s.key === "temp" ? "avgTemp" : s.key === "rain" ? "avgRain" : "avgWind"}`)} ({s.label})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div id="weather-chart" ref={chartRef} className="relative bg-(--color-bg) rounded-xl border border-(--color-border) overflow-hidden" style={{ aspectRatio: `${W}/${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {series.map((s) => (
              <linearGradient key={s.gradientId} id={s.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.01" />
              </linearGradient>
            ))}
          </defs>

          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line x1={padLeft} y1={y} x2={W - padRight} y2={y} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4,3" />
                <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--color-text-secondary)" fontFamily="system-ui">
                  {tick.toFixed(0)}
                </text>
              </g>
            );
          })}

          {chartData.map((d, i) => {
            const x = getX(i);
            // Hạ size font xuống 9 nếu hiển thị 24h để chữ không bị dính vào nhau
            const labelFontSize = timeRange === "24h" ? "9" : "11";
            
            return (
              <text key={i} x={x} y={H - 8} textAnchor="middle" fontSize={labelFontSize} fill="var(--color-text-secondary)" fontFamily="system-ui">
                {d.label}
              </text>
            );
          })}

          {series.map((s) => (
            <path key={`area-${s.key}`} d={buildAreaPath(s.key)} fill={`url(#${s.gradientId})`} />
          ))}

          {series.map((s) => (
            <path key={s.key} d={buildSmoothPath(s.key)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          ))}

          {hoveredIndex !== null && (
            <line x1={getX(hoveredIndex)} y1={padTop} x2={getX(hoveredIndex)} y2={padTop + chartH} stroke="var(--color-text-secondary)" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.5" />
          )}

          {series.map((s) =>
            chartData.map((d, i) => {
              const x = getX(i);
              const y = getY(d[s.key]);
              const isHovered = hoveredIndex === i;
              
              // Nếu 24h thì điểm tròn bình thường nên nhỏ lại một chút để đồ thị bớt rối
              const normalRadius = timeRange === "24h" ? 2.5 : 4;
              
              return (
                <g key={`${s.key}-${i}`}>
                  <circle cx={x} cy={y} r={isHovered ? 6 : normalRadius} fill="white" stroke={s.color} strokeWidth={isHovered ? 2.5 : 2} style={{ transition: 'r 0.15s, stroke-width 0.15s' }} />
                </g>
              );
            })
          )}

          {chartData.map((_, i) => {
            const x = getX(i);
            return (
              <rect
                key={`hover-${i}`}
                x={x - (chartW / chartData.length) / 2}
                y={padTop}
                width={chartW / chartData.length}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </svg>

        {hoveredIndex !== null && (() => {
          const d = chartData[hoveredIndex];
          const xPercent = (getX(hoveredIndex) / W) * 100;
          const isRightHalf = xPercent > 60;
          return (
            <div className="absolute z-10 pointer-events-none" style={{ top: '12px', left: isRightHalf ? undefined : `${xPercent + 2}%`, right: isRightHalf ? `${100 - xPercent + 2}%` : undefined }}>
              <div className="bg-(--color-surface) rounded-xl shadow-lg border border-(--color-border) px-3.5 py-2.5 min-w-[140px]">
                <p className="text-(--text-xs) font-semibold text-(--color-text-primary) m-0 mb-1.5 pb-1.5 border-b border-(--color-border)">
                  {d.label}
                </p>
                {series.map((s) => (
                  <div key={s.key} className="flex items-center justify-between gap-3 py-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-[11px] text-(--color-text-secondary)">
                        {t(`businessReports.kpi.${s.key === "temp" ? "avgTemp" : s.key === "rain" ? "avgRain" : "avgWind"}`)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-(--color-text-primary)">
                      {d[s.key].toFixed(1)} {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// --- WEATHER FREQUENCY CHART ---
interface WeatherFrequencyChartProps {
  timeRange: string;
  lat?: number;
  lng?: number;
}

export function WeatherFrequencyChart({ timeRange, lat, lng }: WeatherFrequencyChartProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { chartData, isLoading } = useOpenWeatherHistory(lat, lng, timeRange);

  const distributionData = useMemo(() => {
    if (!chartData.length) return WEATHER_DISTRIBUTION;

    let heavyRain = 0;
    let strongWind = 0;
    let extremeTemp = 0;
    let fog = 0;

    chartData.forEach(d => {
      if ((d.weatherId >= 200 && d.weatherId < 600) || d.rain > 5) heavyRain++;
      if (d.wind > 10) strongWind++;
      if (d.temp > 35 || d.temp < 10) extremeTemp++;
      if (d.weatherId >= 700 && d.weatherId < 800) fog++;
    });

    const data = [
      { name: "heavyRain", value: heavyRain, colorLight: "#3B82F6", colorDark: "#60A5FA" },
      { name: "strongWind", value: strongWind, colorLight: "#10B981", colorDark: "#34D399" },
      { name: "extremeTemp", value: extremeTemp, colorLight: "#EF4444", colorDark: "#F87171" },
      { name: "fog", value: fog, colorLight: "#8B5CF6", colorDark: "#A78BFA" }
    ].filter(item => item.value > 0);

    return data.length > 0 ? data : WEATHER_DISTRIBUTION;
  }, [chartData]);

  const totalBadWeather = distributionData.reduce((sum: number, item: any) => sum + item.value, 0);
  
  const pieChartData = distributionData.map((item: any) => ({
    ...item,
    color: isDark ? item.colorDark : item.colorLight,
    percentage: totalBadWeather === 0 ? 0 : (item.value / totalBadWeather) * 100,
    angle: totalBadWeather === 0 ? 0 : (item.value / totalBadWeather) * 360,
  }));

  return (
    <div className="bg-(--color-surface) rounded-3xl p-4 sm:p-6 shadow-(--shadow-md) border border-(--color-border)">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-(--color-primary)">
          <PieChart size={20} />
          <h2 className="m-0 text-(--text-lg) sm:text-(--text-xl) text-(--color-text-primary)">
             {t("businessReports.charts.weatherDistribution")}
          </h2>
        </div>
      </div>

      {!lat || !lng || isLoading ? (
        <div className="h-64 sm:h-80 flex flex-col items-center justify-center gap-2">
           {isLoading && <Loader2 className="animate-spin text-(--color-primary)" size={24} />}
           <span className="text-(--color-text-secondary)">{isLoading ? "Đang xử lý..." : "Chưa có dữ liệu"}</span>
        </div>
      ) : (
        <>
          <div id="pie-chart" className="h-64 sm:h-80 flex items-center justify-center">
             <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                 <svg className="w-full h-full" viewBox="0 0 100 100">
                    {(() => {
                      let currentAngle = -90;
                      return pieChartData.map((item: any) => {
                        if (item.angle === 0) return null;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + item.angle;
                        currentAngle = endAngle;

                        const startAngleRad = (startAngle * Math.PI) / 180;
                        const endAngleRad = (endAngle * Math.PI) / 180;

                        if (item.angle >= 359.9) {
                           return (
                             <circle key={item.name} cx="50" cy="50" r="50" fill={item.color} />
                           )
                        }

                        const x1 = 50 + 50 * Math.cos(startAngleRad);
                        const y1 = 50 + 50 * Math.sin(startAngleRad);
                        const x2 = 50 + 50 * Math.cos(endAngleRad);
                        const y2 = 50 + 50 * Math.sin(endAngleRad);

                        const largeArcFlag = item.angle > 180 ? 1 : 0;

                        const pathData = [
                          "M 50 50",
                          `L ${x1} ${y1}`,
                          `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          "Z",
                        ].join(" ");

                        return (
                            <g key={item.name}>
                            <path
                              d={pathData}
                              fill={item.color}
                              className="transition-all hover:opacity-80"
                              style={{ cursor: "pointer" }}
                            />
                            <title>{`${t(`businessReports.charts.types.${item.name}`)}: ${item.percentage.toFixed(1)}%`}</title>
                          </g>
                        );
                      });
                    })()}
                    <circle cx="50" cy="50" r="30" fill="var(--color-surface)" />
                    <text x="50" y="55" textAnchor="middle" className="text-xs font-bold" fill="var(--color-text-primary)">
                        {totalBadWeather}
                    </text>
                      {/* <text x="50" y="55" textAnchor="middle" className="text-[8px]" fill="var(--color-text-secondary)">
                         {t("businessReports.charts.incidents")}
                      </text> */}
                 </svg>
             </div>
          </div>
          
           <div className="mt-4 space-y-2">
                {pieChartData.map((item: any) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 hover:bg-(--color-bg) rounded-lg transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-(--text-sm) text-(--color-text-primary)">{t(`businessReports.charts.types.${item.name}`)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* <span className="text-(--text-xs) text-(--color-text-secondary)">{item.value} {t("businessReports.charts.incidents")}</span> */}
                      <span className="font-semibold text-(--text-sm) w-12 text-right text-(--color-text-primary)">{item.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
        </>
      )}
    </div>
  );
}