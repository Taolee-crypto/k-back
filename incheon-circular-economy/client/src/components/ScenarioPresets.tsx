/**
 * ScenarioPresets - 시나리오 프리셋 선택 컴포넌트
 * Design: 빠른 시나리오 전환 버튼
 */
import { SimulationParams } from "@/lib/simulation";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Scenario {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  params: Partial<SimulationParams>;
}

const SCENARIOS: Scenario[] = [
  {
    id: "baseline",
    name: "기본 시나리오",
    description: "2026년 실제 데이터 기반 현실적 전망",
    color: "#0B4F9E",
    icon: "📋",
    params: {
      grdpGrowthRate: 3.1,
      taxGrowthRate: 2.5,
      fundBurnRate: 45,
      participationRate: 86.7,
      track1Rate: 15,
      track2Rate: 0.3,
      track3Rate: 2.0,
      paymentGrowthRate: 8.0,
      bizGrowthRate: 5.0,
    },
  },
  {
    id: "optimistic",
    name: "낙관 시나리오",
    description: "고성장 + 높은 기업 참여율",
    color: "#1A9E5C",
    icon: "🚀",
    params: {
      grdpGrowthRate: 6.0,
      taxGrowthRate: 7.0,
      fundBurnRate: 30,
      participationRate: 95,
      track1Rate: 20,
      track2Rate: 0.5,
      track3Rate: 3.0,
      paymentGrowthRate: 15.0,
      bizGrowthRate: 10.0,
    },
  },
  {
    id: "conservative",
    name: "보수 시나리오",
    description: "저성장 + 낮은 기업 참여율",
    color: "#E07B2A",
    icon: "🐢",
    params: {
      grdpGrowthRate: 1.5,
      taxGrowthRate: 1.0,
      fundBurnRate: 65,
      participationRate: 70,
      track1Rate: 10,
      track2Rate: 0.1,
      track3Rate: 1.0,
      paymentGrowthRate: 4.0,
      bizGrowthRate: 2.0,
    },
  },
  {
    id: "crisis",
    name: "위기 시나리오",
    description: "경기 침체 + 재원 소진 위험",
    color: "#E55A5A",
    icon: "⚠️",
    params: {
      grdpGrowthRate: -1.0,
      taxGrowthRate: -3.0,
      fundBurnRate: 85,
      participationRate: 55,
      track1Rate: 7,
      track2Rate: 0.05,
      track3Rate: 0.5,
      paymentGrowthRate: 1.0,
      bizGrowthRate: 0.5,
    },
  },
];

interface ScenarioPresetsProps {
  onApply: (params: SimulationParams) => void;
  currentParams: SimulationParams;
}

export default function ScenarioPresets({ onApply, currentParams }: ScenarioPresetsProps) {
  const handleApply = (scenario: Scenario) => {
    const merged = { ...currentParams, ...scenario.params } as SimulationParams;
    onApply(merged);
    toast.success(`"${scenario.name}" 시나리오가 적용되었습니다.`);
  };

  return (
    <div className="p-4 border-b border-white/10">
      <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
        시나리오 프리셋
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {SCENARIOS.map((scenario, i) => (
          <motion.button
            key={scenario.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleApply(scenario)}
            className="text-left p-2.5 rounded-lg border transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              borderColor: `${scenario.color}40`,
              backgroundColor: `${scenario.color}10`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{scenario.icon}</span>
              <span className="text-xs font-semibold text-white/80">{scenario.name}</span>
            </div>
            <p className="text-xs text-white/40 leading-tight">{scenario.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
