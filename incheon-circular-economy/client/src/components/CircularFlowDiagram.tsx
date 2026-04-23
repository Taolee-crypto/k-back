/**
 * CircularFlowDiagram - 순환경제 흐름 SVG 다이어그램
 * Design: 3트랙 재원 흐름 + 순환 화살표 애니메이션
 */
import { motion } from "framer-motion";
import { YearResult, formatBillion } from "@/lib/simulation";

interface CircularFlowDiagramProps {
  result: YearResult;
}

export default function CircularFlowDiagram({ result }: CircularFlowDiagramProps) {
  const total = result.totalFund;
  const t1Pct = total > 0 ? (result.track1Fund / total * 100).toFixed(1) : "0";
  const t2Pct = total > 0 ? (result.track2Fund / total * 100).toFixed(1) : "0";
  const t3Pct = total > 0 ? (result.track3Fund / total * 100).toFixed(1) : "0";
  const govPct = total > 0 ? (result.govBudget / total * 100).toFixed(1) : "0";

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        {result.year}년 재원 순환 흐름도
      </h3>

      <div className="relative">
        <svg viewBox="0 0 500 320" className="w-full" xmlns="http://www.w3.org/2000/svg">
          {/* 중앙 재원 풀 */}
          <motion.circle
            cx="250" cy="160" r="55"
            fill="oklch(0.38 0.15 255)"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <text x="250" y="152" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">재원 풀</text>
          <text x="250" y="167" textAnchor="middle" fill="white" fontSize="10" fontFamily="JetBrains Mono, monospace">
            {formatBillion(total)}
          </text>
          <text x="250" y="180" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">총 재원</text>

          {/* 트랙1: 플랫폼 (상단 좌) */}
          <motion.rect x="30" y="20" width="120" height="60" rx="8"
            fill="#4A9EE0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} />
          <text x="90" y="44" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">트랙1</text>
          <text x="90" y="57" textAnchor="middle" fill="white" fontSize="9">플랫폼 수수료</text>
          <text x="90" y="70" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontFamily="JetBrains Mono, monospace">
            {formatBillion(result.track1Fund)} ({t1Pct}%)
          </text>

          {/* 트랙2: 기업 (하단 좌) */}
          <motion.rect x="30" y="240" width="120" height="60" rx="8"
            fill="#1A9E5C" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} />
          <text x="90" y="264" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">트랙2</text>
          <text x="90" y="277" textAnchor="middle" fill="white" fontSize="9">기업 이익 출연</text>
          <text x="90" y="290" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontFamily="JetBrains Mono, monospace">
            {formatBillion(result.track2Fund)} ({t2Pct}%)
          </text>

          {/* 트랙3: 금융기관 (우측) */}
          <motion.rect x="350" y="130" width="120" height="60" rx="8"
            fill="#9E5CC8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} />
          <text x="410" y="154" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">트랙3</text>
          <text x="410" y="167" textAnchor="middle" fill="white" fontSize="9">금융기관 수익</text>
          <text x="410" y="180" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontFamily="JetBrains Mono, monospace">
            {formatBillion(result.track3Fund)} ({t3Pct}%)
          </text>

          {/* 정부 예산 (상단 우) */}
          <motion.rect x="350" y="20" width="120" height="60" rx="8"
            fill="oklch(0.38 0.15 255)" stroke="white" strokeWidth="1.5" strokeDasharray="4 2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} />
          <text x="410" y="44" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">정부 예산</text>
          <text x="410" y="57" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="9">시비 보조</text>
          <text x="410" y="70" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontFamily="JetBrains Mono, monospace">
            {formatBillion(result.govBudget)} ({govPct}%)
          </text>

          {/* 화살표: 트랙1 → 재원풀 */}
          <motion.path d="M 150 50 C 200 50, 200 120, 205 130"
            fill="none" stroke="#4A9EE0" strokeWidth="2" markerEnd="url(#arrowBlue)"
            strokeDasharray="6 3"
            animate={{ strokeDashoffset: [0, -18] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />

          {/* 화살표: 트랙2 → 재원풀 */}
          <motion.path d="M 150 270 C 200 270, 200 200, 205 190"
            fill="none" stroke="#1A9E5C" strokeWidth="2" markerEnd="url(#arrowGreen)"
            strokeDasharray="6 3"
            animate={{ strokeDashoffset: [0, -18] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.7 }} />

          {/* 화살표: 트랙3 → 재원풀 */}
          <motion.path d="M 350 160 C 320 160, 310 160, 305 160"
            fill="none" stroke="#9E5CC8" strokeWidth="2" markerEnd="url(#arrowPurple)"
            strokeDasharray="6 3"
            animate={{ strokeDashoffset: [0, -18] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.4 }} />

          {/* 화살표: 정부 → 재원풀 */}
          <motion.path d="M 350 50 C 310 50, 300 100, 295 130"
            fill="none" stroke="rgba(100,140,220,0.7)" strokeWidth="1.5" markerEnd="url(#arrowGray)"
            strokeDasharray="4 3"
            animate={{ strokeDashoffset: [0, -14] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />

          {/* 재원풀 → 포인트 발행 (하단) */}
          <motion.path d="M 250 215 L 250 260"
            fill="none" stroke="white" strokeWidth="2" markerEnd="url(#arrowWhite)"
            strokeDasharray="5 3"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
          <rect x="190" y="260" width="120" height="40" rx="6" fill="oklch(0.65 0.17 55)" />
          <text x="250" y="276" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">포인트 발행</text>
          <text x="250" y="290" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="9" fontFamily="JetBrains Mono, monospace">
            {formatBillion(result.pointIssued)}
          </text>

          {/* 화살 마커 정의 */}
          <defs>
            {[
              { id: "arrowBlue", color: "#4A9EE0" },
              { id: "arrowGreen", color: "#1A9E5C" },
              { id: "arrowPurple", color: "#9E5CC8" },
              { id: "arrowGray", color: "rgba(100,140,220,0.7)" },
              { id: "arrowWhite", color: "white" },
            ].map(({ id, color }) => (
              <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill={color} />
              </marker>
            ))}
          </defs>
        </svg>
      </div>

      {/* 자립 vs 정부 요약 */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="bg-[oklch(0.38_0.15_255)/8] border border-[oklch(0.38_0.15_255)/20] rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground">정부 의존</div>
          <div className="text-xl font-black font-mono text-[oklch(0.38_0.15_255)]">
            {result.govRatio.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">{formatBillion(result.govBudget)}</div>
        </div>
        <div className="bg-[#1A9E5C]/8 border border-[#1A9E5C]/20 rounded-lg p-3 text-center">
          <div className="text-xs text-muted-foreground">자립 재원</div>
          <div className="text-xl font-black font-mono text-[#1A9E5C]">
            {result.selfRatio.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">{formatBillion(result.selfFund)}</div>
        </div>
      </div>
    </div>
  );
}
