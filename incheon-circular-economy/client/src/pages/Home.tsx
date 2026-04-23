/**
 * Home - 인천형 순환경제 자립구조 시뮬레이터 메인 페이지
 * Design: 데이터 저널리즘 + 한국 공공 인포그래픽 미학
 * Layout: 헤더 → [좌: 파라미터 패널 | 우: 연도 카드 + 차트] 비대칭 구조
 */
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SimHeader from "@/components/SimHeader";
import ParamPanel from "@/components/ParamPanel";
import YearCard from "@/components/YearCard";
import ChartPanel from "@/components/ChartPanel";
import CircularFlowDiagram from "@/components/CircularFlowDiagram";
import { DEFAULT_PARAMS, runSimulation, SimulationParams, formatBillion } from "@/lib/simulation";
import { Button } from "@/components/ui/button";
import { RotateCcw, Info } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [showInfo, setShowInfo] = useState(false);

  const results = useMemo(() => runSimulation(params), [params]);
  const selectedResult = results.find((r) => r.year === selectedYear) || results[0];

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
    toast.success("파라미터가 기본값으로 초기화되었습니다.");
  };

  // 2029년 자립도
  const finalSelfRatio = results[3]?.selfRatio ?? 0;
  const finalSelfFund = results[3]?.selfFund ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SimHeader />

      {/* 목표 달성 배너 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-[oklch(0.12_0.06_255)] to-[oklch(0.18_0.08_155)] px-4 py-2.5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 text-sm">
          <span className="text-white/60">2029년 목표 자립도:</span>
          <span
            className="font-mono font-bold text-base"
            style={{ color: finalSelfRatio >= 80 ? "#1A9E5C" : finalSelfRatio >= 50 ? "#E07B2A" : "#E55A5A" }}
          >
            {finalSelfRatio.toFixed(1)}%
          </span>
          <span className="text-white/40 text-xs">자립재원 {formatBillion(finalSelfFund)}</span>
          {finalSelfRatio >= 80 && (
            <span className="text-xs bg-[#1A9E5C]/20 text-[#1A9E5C] px-2 py-0.5 rounded-full">
              ✓ 완전 자립 달성
            </span>
          )}
          {finalSelfRatio >= 50 && finalSelfRatio < 80 && (
            <span className="text-xs bg-[#E07B2A]/20 text-[#E07B2A] px-2 py-0.5 rounded-full">
              ⚡ 과반 자립
            </span>
          )}
          {finalSelfRatio < 50 && (
            <span className="text-xs bg-[#E55A5A]/20 text-[#E55A5A] px-2 py-0.5 rounded-full">
              ⚠️ 자립 미달 — 파라미터 조정 필요
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className="text-white/60 hover:text-white h-7 px-2"
          >
            <Info className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white/60 hover:text-white h-7 px-2 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-xs">초기화</span>
          </Button>
        </div>
      </motion.div>

      {/* 정보 패널 */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 border-b border-blue-200 px-4 py-3"
        >
          <div className="max-w-4xl text-xs text-blue-800 space-y-1">
            <p><strong>시뮬레이션 기반:</strong> 인천형 지역소비순환 특허명세서 v2.0 (이문웅, 2026) — 동적 적립률 캡 알고리즘 + 기업 이익 사회환원 재원 수집 메커니즘</p>
            <p><strong>초기 데이터:</strong> 2026년 이음카드 예산 2,496억 원 (본예산 1,351억 + 추경 1,145억), 2025년 결제액 2조 5,976억 원, 2024년 인천 GRDP 126조 원</p>
            <p><strong>3트랙 재원:</strong> 트랙1(플랫폼 수수료 환원) + 트랙2(기업 이익 출연) + 트랙3(금융기관 수익 분담) → 정부 보조금 없이 자립 조달</p>
          </div>
        </motion.div>
      )}

      {/* 메인 레이아웃 */}
      <div className="flex-1 flex overflow-hidden" style={{ minHeight: "calc(100vh - 180px)" }}>
        {/* 좌측: 파라미터 패널 */}
        <div className="w-72 xl:w-80 flex-shrink-0 border-r border-border overflow-y-auto">
          <ParamPanel params={params} onChange={setParams} />
        </div>

        {/* 우측: 메인 콘텐츠 */}
        <div className="flex-1 overflow-y-auto">
          {/* 연도 탭 네비게이터 */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">연도 선택:</span>
            {results.map((r) => (
              <button
                key={r.year}
                onClick={() => setSelectedYear(r.year)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: selectedYear === r.year
                    ? (r.selfRatio >= 50 ? "#1A9E5C" : "oklch(0.38 0.15 255)")
                    : "transparent",
                  color: selectedYear === r.year ? "white" : "oklch(0.5 0.02 255)",
                  border: `1.5px solid ${selectedYear === r.year
                    ? (r.selfRatio >= 50 ? "#1A9E5C" : "oklch(0.38 0.15 255)")
                    : "oklch(0.88 0.01 240)"}`,
                }}
              >
                {r.year}
                <span className="ml-1.5 text-xs opacity-70">
                  {r.selfRatio.toFixed(0)}%
                </span>
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {/* 4개년 카드 그리드 */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[oklch(0.38_0.15_255)] inline-block" />
                4개년 연도별 시뮬레이션 결과
              </h2>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                {results.map((result, i) => (
                  <YearCard
                    key={result.year}
                    result={result}
                    isSelected={selectedYear === result.year}
                    onClick={() => setSelectedYear(result.year)}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* 차트 패널 */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#1A9E5C] inline-block" />
                시계열 분석 차트
              </h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ minHeight: 480 }}>
                <ChartPanel results={results} selectedYear={selectedYear} />
              </div>
            </div>

            {/* 선택 연도 순환 흐름도 */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#E07B2A] inline-block" />
                재원 순환 흐름도
              </h2>
              <CircularFlowDiagram result={selectedResult} />
            </div>

            {/* 자립 로드맵 요약 */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[oklch(0.38_0.15_255)] inline-block" />
                4개년 자립 로드맵 요약
              </h2>
              <div className="relative">
                {/* 타임라인 선 */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border" />

                <div className="space-y-4">
                  {results.map((r, i) => {
                    const phaseLabel = ["기반 구축", "전환 시작", "자립 가속", "완전 자립"][i];
                    const phaseDesc = [
                      "3트랙 협약 체결 및 시스템 구축 시작. 정부 예산 100% 의존.",
                      "트랙1·2·3 가동 시작. 자립 재원 30% 달성 목표.",
                      "트랙 성숙도 85% 도달. 자립 재원 60% 달성 목표.",
                      "트랙 완전 가동. 정부 보조금 10% 이하로 축소. 재정 자립 완성.",
                    ][i];
                    const dotColor = r.selfRatio >= 50 ? "#1A9E5C" : "oklch(0.38 0.15 255)";

                    return (
                      <motion.div
                        key={r.year}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 pl-2"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-white text-xs font-bold"
                          style={{ backgroundColor: dotColor }}
                        >
                          {r.year - 2025}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm">{r.year}년</span>
                            <span className="text-xs text-muted-foreground">{phaseLabel}</span>
                            <span
                              className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                              style={{
                                color: dotColor,
                                backgroundColor: `${dotColor}15`,
                              }}
                            >
                              자립 {r.selfRatio.toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{phaseDesc}</p>
                          <div className="mt-2 flex gap-3 text-xs">
                            <span className="text-muted-foreground">
                              정부 <strong className="text-foreground">{formatBillion(r.govBudget)}</strong>
                            </span>
                            <span className="text-muted-foreground">
                              자립 <strong style={{ color: dotColor }}>{formatBillion(r.selfFund)}</strong>
                            </span>
                            <span className="text-muted-foreground">
                              결제액 <strong className="text-foreground">{formatBillion(r.paymentVol)}</strong>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 특허 알고리즘 설명 */}
            <div className="bg-[oklch(0.12_0.03_255)] text-white rounded-xl p-4">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#1A9E5C] inline-block" />
                특허 알고리즘 핵심 구조
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    title: "소비자 포인트 산정",
                    color: "#4A9EE0",
                    items: [
                      "기본 적립: 결제액 × 5% (전 업종)",
                      "전략 적립: 결제액 × 10% (전통시장)",
                      "특별 적립: 결제액 × 15% (지역 행사)",
                      "1포인트 = 1원 (카드대금·지방세 상쇄)",
                    ],
                  },
                  {
                    title: "기업 포인트 산정",
                    color: "#1A9E5C",
                    items: [
                      "조달: 지역 구매액 × 2%",
                      "고용: 신규 채용 1인 × 100만P",
                      "상생: 지역 B2B 거래액 × 5%",
                      "금리 인하 최대 1.5%p 혜택",
                    ],
                  },
                  {
                    title: "동적 캡 알고리즘",
                    color: "#E07B2A",
                    items: [
                      "R_adj = R_base × α × β × γ",
                      "α: GRDP 성장률 계수",
                      "β: 지방세 세수 계수",
                      "γ: 재원 소진 속도 계수",
                    ],
                  },
                ].map((section) => (
                  <div key={section.title} className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs font-bold mb-2" style={{ color: section.color }}>
                      {section.title}
                    </div>
                    <ul className="space-y-1">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                          <span style={{ color: section.color }} className="mt-0.5 flex-shrink-0">·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 푸터 */}
            <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
              인천형 지역소비순환 특허명세서 v2.0 기반 시뮬레이션 · 발명자: 이문웅 · 2026년
              <br />
              본 시뮬레이션은 실제 정책 결정에 참고용으로 사용될 수 있으며, 수치는 가정에 따라 변동됩니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
