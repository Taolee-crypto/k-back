/**
 * 인천형 순환경제 자립구조 시뮬레이션 엔진
 * 특허명세서 v2.0 기반 - 동적 적립률 캡 알고리즘 + 재원 자립 3트랙
 * Design: 데이터 저널리즘 + 한국 공공 인포그래픽 미학
 */

// ─────────────────────────────────────────────
// 기초 상수 (2026년 실제 데이터 기반)
// ─────────────────────────────────────────────
export const BASE_CONSTANTS = {
  /** 2026년 이음카드 총 예산 (억 원) = 본예산 1,351 + 추경 1,145 */
  INITIAL_GOV_BUDGET: 2496,
  /** 2025년 연간 이음카드 결제액 (억 원) */
  INITIAL_PAYMENT_VOL: 25976,
  /** 2024년 인천 GRDP (조 원) */
  INITIAL_GRDP: 126,
  /** 인천 인구 (만 명) */
  POPULATION: 300,
  /** 이음카드 가입자 (만 명) */
  MEMBERS: 260,
  /** 기준 적립률 */
  R_BASE_STANDARD: 0.05,
  R_BASE_STRATEGIC: 0.10,
  R_BASE_SPECIAL: 0.15,
  /** 재원 트랙 기준 수치 (억 원) */
  TRACK1_BASE: 3000,   // 인천 내 플랫폼 수수료 수입 추정
  TRACK2_BASE: 50000,  // 인천 소재 대기업·중견기업 지역 사업 이익 추정
  TRACK3_BASE: 20000,  // 인천 내 금융기관 지역 운용 수익 추정
};

// ─────────────────────────────────────────────
// 파라미터 타입 (사용자 조작 가능)
// ─────────────────────────────────────────────
export interface SimulationParams {
  /** GRDP 성장률 (%) */
  grdpGrowthRate: number;
  /** 지방세 증감율 (%) */
  taxGrowthRate: number;
  /** 재원 소진 속도 (%) */
  fundBurnRate: number;
  /** 시민 참여율 (%) */
  participationRate: number;
  /** 트랙1 환원율 (%) */
  track1Rate: number;
  /** 트랙2 출연율 (%) */
  track2Rate: number;
  /** 트랙3 분담율 (%) */
  track3Rate: number;
  /** 결제액 연간 성장률 (%) */
  paymentGrowthRate: number;
  /** 기업 이익 연간 성장률 (%) */
  bizGrowthRate: number;
}

export const DEFAULT_PARAMS: SimulationParams = {
  grdpGrowthRate: 3.1,
  taxGrowthRate: 2.5,
  fundBurnRate: 45,
  participationRate: 86.7,
  track1Rate: 15,
  track2Rate: 0.3,
  track3Rate: 2.0,
  paymentGrowthRate: 8.0,
  bizGrowthRate: 5.0,
};

// ─────────────────────────────────────────────
// 동적 캡 알고리즘 계수 산출
// ─────────────────────────────────────────────
export function calcAlpha(G: number): number {
  if (G >= 3) return 1.0;
  if (G >= 1) return 0.9;
  if (G >= 0) return 0.8;
  return 0.7;
}

export function calcBeta(T: number): number {
  if (T >= 5) return 1.1;
  if (T >= 0) return 1.0;
  return 0.85;
}

export function calcGamma(P: number): number {
  if (P <= 50) return 1.0;
  if (P <= 80) return 0.9;
  return 0.75;
}

export function calcRAdj(
  rBase: number,
  alpha: number,
  beta: number,
  gamma: number
): number {
  const raw = rBase * alpha * beta * gamma;
  const min = rBase * 0.5;
  const max = rBase * 1.2;
  return Math.min(Math.max(raw, min), max);
}

// ─────────────────────────────────────────────
// 연도별 시뮬레이션 결과 타입
// ─────────────────────────────────────────────
export interface YearResult {
  year: number;
  /** 정부 보조 예산 (억 원) */
  govBudget: number;
  /** 트랙1 재원 (억 원) */
  track1Fund: number;
  /** 트랙2 재원 (억 원) */
  track2Fund: number;
  /** 트랙3 재원 (억 원) */
  track3Fund: number;
  /** 자립 재원 합계 (억 원) */
  selfFund: number;
  /** 총 재원 (억 원) */
  totalFund: number;
  /** 자립도 (%) */
  selfRatio: number;
  /** 정부 의존도 (%) */
  govRatio: number;
  /** 연간 결제액 (억 원) */
  paymentVol: number;
  /** GRDP (조 원) */
  grdp: number;
  /** 조정 적립률 - 기본 (%) */
  rAdjStandard: number;
  /** 조정 적립률 - 전략 (%) */
  rAdjStrategic: number;
  /** 조정 적립률 - 특별 (%) */
  rAdjSpecial: number;
  /** α 계수 */
  alpha: number;
  /** β 계수 */
  beta: number;
  /** γ 계수 */
  gamma: number;
  /** 포인트 발행 총액 (억 원) */
  pointIssued: number;
  /** 시민 1인당 연간 혜택 (만 원) */
  benefitPerPerson: number;
  /** 재원 상태: safe / warning / danger */
  fundStatus: 'safe' | 'warning' | 'danger';
  /** 긴급 조정 여부 */
  emergencyAdjust: boolean;
  /** 지역 경제 승수 효과 (배) */
  multiplierEffect: number;
  /** 트랙 성숙도 (%) */
  trackMaturity: number;
}

// ─────────────────────────────────────────────
// 4개년 시뮬레이션 실행
// ─────────────────────────────────────────────
export function runSimulation(params: SimulationParams): YearResult[] {
  const results: YearResult[] = [];

  const YEARS = [2026, 2027, 2028, 2029];

  // 트랙 성숙도 (시스템 구축 진행률)
  // 2026: 20%, 2027: 60%, 2028: 85%, 2029: 100%
  const TRACK_MATURITY = [0.2, 0.6, 0.85, 1.0];

  let currentPaymentVol = BASE_CONSTANTS.INITIAL_PAYMENT_VOL;
  let currentGRDP = BASE_CONSTANTS.INITIAL_GRDP;
  let currentTrack1Base = BASE_CONSTANTS.TRACK1_BASE;
  let currentTrack2Base = BASE_CONSTANTS.TRACK2_BASE;
  let currentTrack3Base = BASE_CONSTANTS.TRACK3_BASE;

  for (let i = 0; i < 4; i++) {
    const year = YEARS[i];
    const maturity = TRACK_MATURITY[i];

    // 성장 반영 (2026 이후 연도부터 성장률 적용)
    if (i > 0) {
      currentPaymentVol *= (1 + params.paymentGrowthRate / 100);
      currentGRDP *= (1 + params.grdpGrowthRate / 100);
      currentTrack1Base *= (1 + params.paymentGrowthRate / 100);
      currentTrack2Base *= (1 + params.bizGrowthRate / 100);
      currentTrack3Base *= (1 + params.bizGrowthRate / 100);
    }

    // 동적 캡 계수 산출
    const alpha = calcAlpha(params.grdpGrowthRate);
    const beta = calcBeta(params.taxGrowthRate);
    const gamma = calcGamma(params.fundBurnRate);

    // 조정 적립률
    const rAdjStandard = calcRAdj(BASE_CONSTANTS.R_BASE_STANDARD, alpha, beta, gamma);
    const rAdjStrategic = calcRAdj(BASE_CONSTANTS.R_BASE_STRATEGIC, alpha, beta, gamma);
    const rAdjSpecial = calcRAdj(BASE_CONSTANTS.R_BASE_SPECIAL, alpha, beta, gamma);

    // 포인트 발행 총액 (결제액 × 가중 평균 적립률)
    // 가정: 기본 70%, 전략 20%, 특별 10%
    const weightedRate = rAdjStandard * 0.7 + rAdjStrategic * 0.2 + rAdjSpecial * 0.1;
    const pointIssued = currentPaymentVol * weightedRate;

    // 3트랙 자립 재원 (성숙도 반영)
    const track1Fund = currentTrack1Base * (params.track1Rate / 100) * maturity;
    const track2Fund = currentTrack2Base * (params.track2Rate / 100) * maturity;
    const track3Fund = currentTrack3Base * (params.track3Rate / 100) * maturity;
    const selfFund = track1Fund + track2Fund + track3Fund;

    // 정부 예산 계산:
    // 포인트 발행에 필요한 총 재원에서 자립 재원을 뺀 나머지를 정부가 보조
    // 단, 정부 예산은 초기 예산(2,496억) 대비 연도별 감소 계획 적용
    // 2026: 100%, 2027: 70%, 2028: 40%, 2029: 10%
    const GOV_RATIO_PLAN = [1.0, 0.7, 0.4, 0.1];
    const maxGovBudget = BASE_CONSTANTS.INITIAL_GOV_BUDGET * GOV_RATIO_PLAN[i];
    // 실제 필요 정부 예산 = 포인트 발행액 - 자립재원 (단, 0 이상)
    const requiredGovBudget = Math.max(0, pointIssued - selfFund);
    // 정부 예산은 계획 상한과 실제 필요액 중 작은 값
    const govBudget = Math.min(maxGovBudget, requiredGovBudget);
    const totalFund = govBudget + selfFund;

    // 자립도 계산
    const selfRatio = totalFund > 0 ? Math.min(100, (selfFund / Math.max(totalFund, pointIssued)) * 100) : 0;
    const govRatio = 100 - selfRatio;

    // 시민 혜택 (포인트 발행액 / 가입자 수)
    // pointIssued는 억 원 단위 → 만 원 단위로 변환: × 10000 / (260만 명)
    const benefitPerPerson = (pointIssued * 10000) / (BASE_CONSTANTS.MEMBERS * 10000);

    // 재원 상태 판정
    let fundStatus: 'safe' | 'warning' | 'danger' = 'safe';
    if (params.fundBurnRate >= 80) fundStatus = 'danger';
    else if (params.fundBurnRate >= 50) fundStatus = 'warning';

    const emergencyAdjust = params.fundBurnRate >= 80;

    // 경제 승수 효과 (지역 소비 → GRDP 기여)
    const multiplierEffect = 1 + (params.participationRate / 100) * 0.8;

    results.push({
      year,
      govBudget: Math.round(govBudget),
      track1Fund: Math.round(track1Fund),
      track2Fund: Math.round(track2Fund),
      track3Fund: Math.round(track3Fund),
      selfFund: Math.round(selfFund),
      totalFund: Math.round(totalFund),
      selfRatio: Math.round(selfRatio * 10) / 10,
      govRatio: Math.round(govRatio * 10) / 10,
      paymentVol: Math.round(currentPaymentVol),
      grdp: Math.round(currentGRDP * 10) / 10,
      rAdjStandard: Math.round(rAdjStandard * 1000) / 10,
      rAdjStrategic: Math.round(rAdjStrategic * 1000) / 10,
      rAdjSpecial: Math.round(rAdjSpecial * 1000) / 10,
      alpha,
      beta,
      gamma,
      pointIssued: Math.round(pointIssued),
      benefitPerPerson: Math.round(benefitPerPerson * 10) / 10,
      fundStatus,
      emergencyAdjust,
      multiplierEffect: Math.round(multiplierEffect * 100) / 100,
      trackMaturity: Math.round(maturity * 100),
    });
  }

  return results;
}

// ─────────────────────────────────────────────
// 헬퍼: 억 원 포맷
// ─────────────────────────────────────────────
export function formatBillion(val: number): string {
  if (val >= 10000) {
    return `${(val / 10000).toFixed(1)}조`;
  }
  return `${val.toLocaleString()}억`;
}

export function formatPercent(val: number, digits = 1): string {
  return `${val.toFixed(digits)}%`;
}
