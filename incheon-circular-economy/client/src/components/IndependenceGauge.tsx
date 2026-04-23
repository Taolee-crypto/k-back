/**
 * IndependenceGauge - 반원형 자립도 게이지
 * Design: SVG 반원 프로그레스 + 애니메이션
 */
import { motion } from "framer-motion";
import { YearResult } from "@/lib/simulation";

interface IndependenceGaugeProps {
  result: YearResult;
  size?: number;
}

export default function IndependenceGauge({ result, size = 160 }: IndependenceGaugeProps) {
  const { selfRatio, govRatio, fundStatus, emergencyAdjust } = result;

  const cx = size / 2;
  const cy = size / 2;
  const r = (size / 2) * 0.75;
  const strokeWidth = (size / 2) * 0.12;

  // 반원 (하단 절반만 표시)
  const circumference = Math.PI * r;
  const selfDash = (selfRatio / 100) * circumference;
  const govDash = (govRatio / 100) * circumference;

  const statusColor = {
    safe: "#1A9E5C",
    warning: "#E07B2A",
    danger: "#E55A5A",
  }[fundStatus];

  const statusLabel = {
    safe: "안전",
    warning: "주의",
    danger: "위험",
  }[fundStatus];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size * 0.6 }}>
        <svg
          width={size}
          height={size * 0.6}
          viewBox={`0 0 ${size} ${size * 0.6}`}
          className="overflow-visible"
        >
          {/* 배경 반원 (정부 의존) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="oklch(0.88 0.01 240)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* 자립 재원 (녹색) */}
          <motion.path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - selfDash }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* 중앙 수치 */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            className="font-mono font-bold"
            style={{
              fontSize: size * 0.14,
              fill: statusColor,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: "700",
            }}
          >
            {selfRatio.toFixed(1)}%
          </text>
          <text
            x={cx}
            y={cy + size * 0.08}
            textAnchor="middle"
            style={{
              fontSize: size * 0.07,
              fill: "oklch(0.5 0.02 255)",
              fontFamily: "'Noto Sans KR', sans-serif",
            }}
          >
            자립도
          </text>
        </svg>

        {/* 좌우 레이블 */}
        <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">
          정부 {govRatio.toFixed(1)}%
        </div>
        <div
          className="absolute bottom-0 right-0 text-xs font-medium"
          style={{ color: statusColor }}
        >
          자립 {selfRatio.toFixed(1)}%
        </div>
      </div>

      {/* 상태 배지 */}
      <div
        className="mt-2 px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: `${statusColor}20`,
          color: statusColor,
          border: `1px solid ${statusColor}40`,
        }}
      >
        {emergencyAdjust ? "⚠️ 긴급 조정 발동" : `재원 ${statusLabel}`}
      </div>
    </div>
  );
}
