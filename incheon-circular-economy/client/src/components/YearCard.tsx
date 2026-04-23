/**
 * YearCard - 연도별 시뮬레이션 결과 카드
 * Design: 데이터 저널리즘 스타일, 수치 강조
 */
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { YearResult, formatBillion } from "@/lib/simulation";
import IndependenceGauge from "./IndependenceGauge";

interface YearCardProps {
  result: YearResult;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v * 10) / 10),
    });
    prevRef.current = value;
    return controls.stop;
  }, [value]);

  return (
    <span className="font-mono tabular-nums">
      {display.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}
      {suffix}
    </span>
  );
}

const YEAR_COLORS = [
  { bg: "oklch(0.97 0.005 240)", border: "oklch(0.88 0.01 240)", accent: "oklch(0.38 0.15 255)" },
  { bg: "oklch(0.97 0.008 155)", border: "oklch(0.85 0.05 155)", accent: "oklch(0.45 0.16 155)" },
  { bg: "oklch(0.97 0.008 155)", border: "oklch(0.75 0.1 155)", accent: "oklch(0.5 0.18 155)" },
  { bg: "oklch(0.96 0.01 155)", border: "oklch(0.65 0.14 155)", accent: "oklch(0.55 0.2 155)" },
];

export default function YearCard({ result, isSelected, onClick, index }: YearCardProps) {
  const colors = YEAR_COLORS[index];

  const selfRatioPercent = result.selfRatio;
  const govRatioPercent = result.govRatio;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="cursor-pointer rounded-xl border-2 transition-all duration-200 overflow-hidden"
      style={{
        borderColor: isSelected ? colors.accent : colors.border,
        boxShadow: isSelected ? `0 0 0 3px ${colors.accent}30, 0 4px 16px ${colors.accent}20` : "0 1px 4px rgba(0,0,0,0.06)",
        background: isSelected ? `linear-gradient(135deg, ${colors.bg}, white)` : "white",
      }}
    >
      {/* 연도 헤더 */}
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: isSelected ? colors.accent : "oklch(0.15 0.04 255)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-white font-mono">{result.year}</span>
          <span className="text-xs text-white/60">
            {index === 0 ? "기반 구축" : index === 1 ? "전환 시작" : index === 2 ? "자립 가속" : "완전 자립"}
          </span>
        </div>
        <div
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: result.fundStatus === "safe" ? "#1A9E5C20" : result.fundStatus === "warning" ? "#E07B2A20" : "#E55A5A20",
            color: result.fundStatus === "safe" ? "#1A9E5C" : result.fundStatus === "warning" ? "#E07B2A" : "#E55A5A",
          }}
        >
          {result.fundStatus === "safe" ? "✓ 안전" : result.fundStatus === "warning" ? "⚡ 주의" : "⚠️ 위험"}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 자립도 게이지 */}
        <div className="flex justify-center">
          <IndependenceGauge result={result} size={140} />
        </div>

        {/* 재원 스택 바 */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>재원 구성</span>
            <span className="font-mono">{formatBillion(result.totalFund)}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden flex bg-muted">
            <motion.div
              className="h-full"
              style={{ backgroundColor: "oklch(0.38 0.15 255)" }}
              initial={{ width: "100%" }}
              animate={{ width: `${govRatioPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.div
              className="h-full"
              style={{ backgroundColor: "oklch(0.55 0.16 155)" }}
              initial={{ width: "0%" }}
              animate={{ width: `${selfRatioPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-[oklch(0.38_0.15_255)]">정부 {formatBillion(result.govBudget)}</span>
            <span className="text-[oklch(0.45_0.16_155)]">자립 {formatBillion(result.selfFund)}</span>
          </div>
        </div>

        {/* 3트랙 재원 */}
        <div className="space-y-1.5">
          {[
            { label: "트랙1 플랫폼", value: result.track1Fund, color: "#4A9EE0" },
            { label: "트랙2 기업", value: result.track2Fund, color: "#1A9E5C" },
            { label: "트랙3 금융", value: result.track3Fund, color: "#9E5CC8" },
          ].map((track) => (
            <div key={track.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: track.color }} />
              <span className="text-xs text-muted-foreground flex-1">{track.label}</span>
              <span className="text-xs font-mono font-medium" style={{ color: track.color }}>
                {formatBillion(track.value)}
              </span>
            </div>
          ))}
        </div>

        {/* 핵심 지표 */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">결제액</div>
            <div className="text-sm font-bold font-mono" style={{ color: colors.accent }}>
              <AnimatedNumber value={result.paymentVol / 10000} suffix="조" />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">1인 혜택</div>
            <div className="text-sm font-bold font-mono" style={{ color: colors.accent }}>
              <AnimatedNumber value={result.benefitPerPerson} suffix="만원" />
            </div>
          </div>
        </div>

        {/* 동적 캡 계수 */}
        <div className="bg-muted/50 rounded-lg p-2.5">
          <div className="text-xs text-muted-foreground mb-1.5 font-medium">동적 캡 계수</div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { label: "α(G)", value: result.alpha },
              { label: "β(T)", value: result.beta },
              { label: "γ(P)", value: result.gamma },
            ].map((coef) => (
              <div key={coef.label} className="text-center">
                <div
                  className="font-mono text-sm font-bold"
                  style={{
                    color: coef.value >= 1 ? "#1A9E5C" : coef.value >= 0.85 ? "#E07B2A" : "#E55A5A",
                  }}
                >
                  {coef.value.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">{coef.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-border/50 grid grid-cols-3 gap-1 text-center">
            {[
              { label: "기본", value: result.rAdjStandard },
              { label: "전략", value: result.rAdjStrategic },
              { label: "특별", value: result.rAdjSpecial },
            ].map((r) => (
              <div key={r.label}>
                <div className="font-mono text-xs font-bold text-foreground">{r.value}%</div>
                <div className="text-xs text-muted-foreground">{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
