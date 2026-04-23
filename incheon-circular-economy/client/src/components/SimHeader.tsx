/**
 * SimHeader - 시뮬레이터 헤더
 * Design: 인천 청색 배경, 순환경제 SVG 애니메이션 배경
 */
import { motion } from "framer-motion";

export default function SimHeader() {
  return (
    <header className="relative overflow-hidden bg-[oklch(0.12_0.06_255)] text-white">
      {/* 배경 SVG 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 순환 흐름 SVG 애니메이션 */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 hidden lg:block">
        <svg viewBox="0 0 400 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* 순환 화살표 1 */}
          <motion.path
            d="M 200 100 C 200 50, 300 50, 300 100 C 300 150, 200 150, 200 100"
            fill="none"
            stroke="#1A9E5C"
            strokeWidth="2"
            strokeDasharray="8 4"
            animate={{ strokeDashoffset: [0, -48] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          {/* 순환 화살표 2 */}
          <motion.path
            d="M 100 80 C 150 30, 250 30, 300 80"
            fill="none"
            stroke="#4A9EE0"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            animate={{ strokeDashoffset: [0, -36] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
          />
          {/* 노드들 */}
          {[
            { cx: 200, cy: 100, r: 6, color: "#1A9E5C" },
            { cx: 300, cy: 100, r: 6, color: "#4A9EE0" },
            { cx: 250, cy: 50, r: 5, color: "#E07B2A" },
          ].map((node, i) => (
            <motion.circle
              key={i}
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={node.color}
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
            />
          ))}
        </svg>
      </div>

      <div className="container relative z-10 py-6 lg:py-8">
        <div className="flex items-start gap-4">
          {/* 로고 배지 */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[oklch(0.55_0.16_155)] flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[oklch(0.55_0.16_155)/30] text-[oklch(0.8_0.12_155)] border border-[oklch(0.55_0.16_155)/40]">
                인천광역시 · 특허명세서 v2.0
              </span>
              <span className="text-xs text-white/40">2026–2029</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-white leading-tight">
              인천형 순환경제 자립구조 시뮬레이터
            </h1>
            <p className="mt-1 text-sm text-white/60 max-w-2xl">
              2026년 이음카드 예산(2,496억 원)을 시작으로 4개년 재원 자립 전환 시뮬레이션 —
              동적 적립률 캡 알고리즘 · 3트랙 재원 자립 메커니즘
            </p>
          </div>
        </div>

        {/* 핵심 지표 요약 바 */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "2026 이음카드 예산", value: "2,496억", sub: "본예산+추경" },
            { label: "2025 연간 결제액", value: "2.6조", sub: "이음카드 기준" },
            { label: "2024 인천 GRDP", value: "126조", sub: "전국 2위" },
            { label: "이음카드 가입자", value: "260만", sub: "시민 86.7%" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2"
            >
              <div className="text-xs text-white/50 mb-0.5">{item.label}</div>
              <div className="text-base font-bold text-white font-mono">{item.value}</div>
              <div className="text-xs text-white/40">{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </header>
  );
}
