/**
 * ParamPanel - 좌측 파라미터 조작 패널
 * Design: 다크 사이드바, 슬라이더 + 수치 인풋
 */
import { SimulationParams } from "@/lib/simulation";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import ScenarioPresets from "./ScenarioPresets";

interface ParamPanelProps {
  params: SimulationParams;
  onChange: (params: SimulationParams) => void;
}


interface ParamGroup {
  title: string;
  icon: string;
  color: string;
  items: {
    key: keyof SimulationParams;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    description: string;
  }[];
}

const PARAM_GROUPS: ParamGroup[] = [
  {
    title: "지역경제 지표",
    icon: "📊",
    color: "oklch(0.38 0.15 255)",
    items: [
      {
        key: "grdpGrowthRate",
        label: "GRDP 성장률",
        min: -2,
        max: 8,
        step: 0.1,
        unit: "%",
        description: "인천 지역내총생산 전년 대비 성장률",
      },
      {
        key: "taxGrowthRate",
        label: "지방세 증감율",
        min: -5,
        max: 10,
        step: 0.1,
        unit: "%",
        description: "지방세 세수 전년 대비 증감율",
      },
      {
        key: "fundBurnRate",
        label: "재원 소진 속도",
        min: 10,
        max: 95,
        step: 1,
        unit: "%",
        description: "재원 풀 잔액 대비 월간 포인트 발행 비율",
      },
      {
        key: "participationRate",
        label: "시민 참여율",
        min: 50,
        max: 99,
        step: 0.1,
        unit: "%",
        description: "전체 인구 대비 이음카드 활성 이용자 비율",
      },
    ],
  },
  {
    title: "3트랙 재원 자립",
    icon: "💰",
    color: "oklch(0.55 0.16 155)",
    items: [
      {
        key: "track1Rate",
        label: "트랙1 플랫폼 환원율",
        min: 5,
        max: 30,
        step: 0.5,
        unit: "%",
        description: "배달앱·PG사 수수료 수입 중 재원 환원 비율",
      },
      {
        key: "track2Rate",
        label: "트랙2 기업 출연율",
        min: 0.05,
        max: 1.0,
        step: 0.05,
        unit: "%",
        description: "지역 기업 이익 중 재원 출연 비율",
      },
      {
        key: "track3Rate",
        label: "트랙3 금융기관 분담율",
        min: 0.5,
        max: 5,
        step: 0.1,
        unit: "%",
        description: "금융기관 지역 운용 수익 중 분담 비율",
      },
    ],
  },
  {
    title: "성장 가정",
    icon: "📈",
    color: "oklch(0.65 0.17 55)",
    items: [
      {
        key: "paymentGrowthRate",
        label: "결제액 연간 성장률",
        min: 0,
        max: 20,
        step: 0.5,
        unit: "%",
        description: "이음카드 연간 결제액 성장률 가정",
      },
      {
        key: "bizGrowthRate",
        label: "기업 이익 성장률",
        min: 0,
        max: 15,
        step: 0.5,
        unit: "%",
        description: "인천 소재 기업 지역 사업 이익 성장률",
      },
    ],
  },
];

function getSliderColor(key: keyof SimulationParams, value: number): string {
  if (key === "fundBurnRate") {
    if (value >= 80) return "#E55A5A";
    if (value >= 50) return "#E07B2A";
    return "#1A9E5C";
  }
  return "#0B4F9E";
}

export default function ParamPanel({ params, onChange }: ParamPanelProps) {
  const update = (key: keyof SimulationParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <aside className="bg-[oklch(0.12_0.03_255)] text-white h-full overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          시뮬레이션 파라미터
        </h2>
        <p className="text-xs text-white/40 mt-0.5">슬라이더를 조작하면 즉시 반영됩니다</p>
      </div>

      <ScenarioPresets onApply={onChange} currentParams={params} />

      <div className="p-4 space-y-6">
        {PARAM_GROUPS.map((group, gi) => (
          <motion.div
            key={gi}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: gi * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{group.icon}</span>
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                {group.title}
              </h3>
            </div>

            <div className="space-y-4">
              {group.items.map((item) => {
                const value = params[item.key] as number;
                const sliderColor = getSliderColor(item.key, value);
                const isWarning = item.key === "fundBurnRate" && value >= 50;
                const isDanger = item.key === "fundBurnRate" && value >= 80;

                return (
                  <div key={item.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-white/60">{item.label}</label>
                      <div
                        className="font-mono text-sm font-bold px-2 py-0.5 rounded"
                        style={{
                          color: isDanger ? "#E55A5A" : isWarning ? "#E07B2A" : "white",
                          backgroundColor: isDanger
                            ? "rgba(229,90,90,0.15)"
                            : isWarning
                            ? "rgba(224,123,42,0.15)"
                            : "rgba(255,255,255,0.08)",
                        }}
                      >
                        {value.toFixed(item.step < 1 ? (item.step < 0.1 ? 2 : 1) : 0)}
                        {item.unit}
                      </div>
                    </div>

                    <Slider
                      min={item.min}
                      max={item.max}
                      step={item.step}
                      value={[value]}
                      onValueChange={([v]) => update(item.key, v)}
                      className="w-full"
                    />

                    <p className="text-xs text-white/30 leading-tight">{item.description}</p>

                    {isDanger && (
                      <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-400/10 rounded px-2 py-1">
                        <span>⚠️</span>
                        <span>긴급 조정 발동 (γ = 0.75)</span>
                      </div>
                    )}
                    {isWarning && !isDanger && (
                      <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-400/10 rounded px-2 py-1">
                        <span>⚡</span>
                        <span>주의 구간 (γ = 0.90)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 알고리즘 수식 패널 */}
      <div className="p-4 border-t border-white/10 bg-white/3">
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          동적 캡 알고리즘
        </h3>
        <div className="font-mono text-xs text-white/70 space-y-1 bg-black/20 rounded-lg p-3">
          <div className="text-[oklch(0.8_0.12_155)]">R_adj = R_base × α(G) × β(T) × γ(P)</div>
          <div className="text-white/40 mt-2">α(G): G≥3%→1.0, 1~3%→0.9, 0~1%→0.8, &lt;0→0.7</div>
          <div className="text-white/40">β(T): T≥5%→1.1, 0~5%→1.0, &lt;0→0.85</div>
          <div className="text-white/40">γ(P): P≤50%→1.0, 50~80%→0.9, &gt;80%→0.75</div>
          <div className="text-white/30 mt-2">범위: R_base×0.5 ~ R_base×1.2</div>
        </div>
      </div>
    </aside>
  );
}
