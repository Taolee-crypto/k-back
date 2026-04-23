/**
 * ChartPanel - 우측 시각화 차트 패널
 * Design: recharts 기반 데이터 시각화
 */
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell, PieChart, Pie
} from "recharts";
import { YearResult, formatBillion } from "@/lib/simulation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChartPanelProps {
  results: YearResult[];
  selectedYear: number;
}

const COLORS = {
  gov: "oklch(0.38 0.15 255)",
  track1: "#4A9EE0",
  track2: "#1A9E5C",
  track3: "#9E5CC8",
  self: "#1A9E5C",
  payment: "#E07B2A",
  grdp: "#0B4F9E",
  benefit: "#E07B2A",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-sm">
      <div className="font-bold text-foreground mb-2">{label}년</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-medium">{formatBillion(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const RateTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-sm">
      <div className="font-bold text-foreground mb-2">{label}년</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-medium">{p.value}%</span>
        </div>
      ))}
    </div>
  );
};

export default function ChartPanel({ results, selectedYear }: ChartPanelProps) {
  const chartData = results.map((r) => ({
    year: r.year,
    정부예산: r.govBudget,
    트랙1: r.track1Fund,
    트랙2: r.track2Fund,
    트랙3: r.track3Fund,
    자립재원: r.selfFund,
    총재원: r.totalFund,
    자립도: r.selfRatio,
    정부의존도: r.govRatio,
    결제액: r.paymentVol,
    GRDP: r.grdp * 10000,
    포인트발행: r.pointIssued,
    시민혜택: r.benefitPerPerson,
    기본적립률: r.rAdjStandard,
    전략적립률: r.rAdjStrategic,
    특별적립률: r.rAdjSpecial,
  }));

  const selected = results.find((r) => r.year === selectedYear) || results[0];

  // 파이 차트 데이터
  const pieData = [
    { name: "정부 예산", value: selected.govBudget, color: COLORS.gov },
    { name: "트랙1 플랫폼", value: selected.track1Fund, color: COLORS.track1 },
    { name: "트랙2 기업", value: selected.track2Fund, color: COLORS.track2 },
    { name: "트랙3 금융", value: selected.track3Fund, color: COLORS.track3 },
  ].filter((d) => d.value > 0);

  return (
    <div className="h-full overflow-y-auto bg-background">
      <Tabs defaultValue="overview" className="h-full flex flex-col">
        <div className="px-4 pt-4 border-b border-border">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="overview">재원 구조</TabsTrigger>
            <TabsTrigger value="independence">자립 추이</TabsTrigger>
            <TabsTrigger value="rates">적립률</TabsTrigger>
            <TabsTrigger value="economy">경제 효과</TabsTrigger>
          </TabsList>
        </div>

        {/* ─── 탭 1: 재원 구조 ─── */}
        <TabsContent value="overview" className="flex-1 p-4 space-y-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              4개년 재원 구성 추이 (억 원)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => formatBillion(v)} tick={{ fontSize: 11 }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="정부예산" stackId="a" fill={COLORS.gov} radius={[0, 0, 0, 0]} />
                <Bar dataKey="트랙1" stackId="a" fill={COLORS.track1} />
                <Bar dataKey="트랙2" stackId="a" fill={COLORS.track2} />
                <Bar dataKey="트랙3" stackId="a" fill={COLORS.track3} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 선택 연도 파이 차트 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {selectedYear}년 재원 구성 비율
            </h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatBillion(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-muted-foreground flex-1">{d.name}</span>
                    <span className="text-xs font-mono font-bold">{formatBillion(d.value)}</span>
                    <span className="text-xs text-muted-foreground">
                      ({selected.totalFund > 0 ? ((d.value / selected.totalFund) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 포인트 발행 vs 재원 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              포인트 발행액 vs 총 재원 (억 원)
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => formatBillion(v)} tick={{ fontSize: 11 }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="포인트발행" stroke="#E07B2A" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="총재원" stroke={COLORS.self} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* ─── 탭 2: 자립 추이 ─── */}
        <TabsContent value="independence" className="flex-1 p-4 space-y-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              자립도 vs 정부 의존도 추이 (%)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="selfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A9E5C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1A9E5C" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="govGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.gov} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.gov} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip content={<RateTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine y={50} stroke="#E07B2A" strokeDasharray="4 2" label={{ value: "50%", fontSize: 11, fill: "#E07B2A" }} />
                <Area type="monotone" dataKey="자립도" stroke="#1A9E5C" strokeWidth={2.5} fill="url(#selfGrad)" />
                <Area type="monotone" dataKey="정부의존도" stroke={COLORS.gov} strokeWidth={2} fill="url(#govGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 자립 달성 요약 카드 */}
          <div className="grid grid-cols-2 gap-3">
            {results.map((r, i) => (
              <div
                key={r.year}
                className="rounded-lg border p-3"
                style={{
                  borderColor: r.selfRatio >= 50 ? "#1A9E5C40" : "oklch(0.88 0.01 240)",
                  backgroundColor: r.selfRatio >= 50 ? "#1A9E5C08" : "white",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-muted-foreground">{r.year}년</span>
                  {r.selfRatio >= 50 && (
                    <span className="text-xs text-[#1A9E5C] font-medium">✓ 자립 과반</span>
                  )}
                </div>
                <div className="text-xl font-black font-mono" style={{ color: r.selfRatio >= 50 ? "#1A9E5C" : "oklch(0.38 0.15 255)" }}>
                  {r.selfRatio.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  자립재원 {formatBillion(r.selfFund)}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ─── 탭 3: 적립률 ─── */}
        <TabsContent value="rates" className="flex-1 p-4 space-y-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              동적 적립률 캡 알고리즘 적용 결과 (%)
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              R_adj = R_base × α(G) × β(T) × γ(P)
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 20]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip content={<RateTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <ReferenceLine y={5} stroke="#0B4F9E" strokeDasharray="3 2" label={{ value: "기본 5%", fontSize: 10, fill: "#0B4F9E" }} />
                <ReferenceLine y={10} stroke="#1A9E5C" strokeDasharray="3 2" label={{ value: "전략 10%", fontSize: 10, fill: "#1A9E5C" }} />
                <ReferenceLine y={15} stroke="#E07B2A" strokeDasharray="3 2" label={{ value: "특별 15%", fontSize: 10, fill: "#E07B2A" }} />
                <Line type="monotone" dataKey="기본적립률" stroke="#0B4F9E" strokeWidth={2.5} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="전략적립률" stroke="#1A9E5C" strokeWidth={2.5} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="특별적립률" stroke="#E07B2A" strokeWidth={2.5} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 계수 테이블 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">연도별 동적 계수</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">연도</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">α(G)</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">β(T)</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">γ(P)</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">기본</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">전략</th>
                    <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">특별</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.year} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                      <td className="py-2 px-3 font-mono font-bold">{r.year}</td>
                      <td className="py-2 px-3 text-center font-mono"
                        style={{ color: r.alpha >= 1 ? "#1A9E5C" : r.alpha >= 0.85 ? "#E07B2A" : "#E55A5A" }}>
                        {r.alpha.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-center font-mono"
                        style={{ color: r.beta >= 1 ? "#1A9E5C" : r.beta >= 0.9 ? "#E07B2A" : "#E55A5A" }}>
                        {r.beta.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-center font-mono"
                        style={{ color: r.gamma >= 1 ? "#1A9E5C" : r.gamma >= 0.85 ? "#E07B2A" : "#E55A5A" }}>
                        {r.gamma.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-xs">{r.rAdjStandard}%</td>
                      <td className="py-2 px-3 text-center font-mono text-xs">{r.rAdjStrategic}%</td>
                      <td className="py-2 px-3 text-center font-mono text-xs">{r.rAdjSpecial}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* ─── 탭 4: 경제 효과 ─── */}
        <TabsContent value="economy" className="flex-1 p-4 space-y-4 overflow-y-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              이음카드 결제액 성장 추이 (억 원)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E07B2A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E07B2A" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => formatBillion(v)} tick={{ fontSize: 11 }} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="결제액" stroke="#E07B2A" strokeWidth={2.5} fill="url(#payGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 시민 1인당 혜택 */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              시민 1인당 연간 혜택 (만 원)
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v}만원`} />
                <Bar dataKey="시민혜택" name="1인당 혜택" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={["#0B4F9E", "#1A6EAA", "#1A9E5C", "#0E7A46"][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 경제 승수 효과 */}
          <div className="grid grid-cols-2 gap-3">
            {results.map((r) => (
              <div key={r.year} className="bg-card border border-border rounded-lg p-3">
                <div className="text-xs text-muted-foreground">{r.year}년 경제 승수</div>
                <div className="text-2xl font-black font-mono text-[oklch(0.38_0.15_255)]">
                  ×{r.multiplierEffect}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  GRDP {r.grdp}조 원
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
