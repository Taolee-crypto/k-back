# 인천형 순환경제 자립구조 시뮬레이터 디자인 아이디어

<response>
<idea>
**Design Movement**: 데이터 저널리즘 + 한국 공공 인포그래픽 미학
**Core Principles**:
1. 데이터가 주인공 — 차트와 수치가 레이아웃의 중심을 차지하며, 장식은 최소화
2. 신뢰와 공공성 — 인천시 공식 색조(청색 계열)를 기반으로 신뢰감 있는 톤
3. 순환의 시각화 — 흐름(flow)과 연결(connection)을 강조하는 선형 모티프
4. 조작 가능한 현실 — 슬라이더와 인풋이 즉각적으로 차트에 반영되는 반응형 설계

**Color Philosophy**:
- Primary: 인천 청색 (#0B4F9E) — 공공 신뢰, 바다, 인천항
- Accent: 순환 녹색 (#1A9E5C) — 성장, 자립, 지속가능성
- Warning: 경고 주황 (#E07B2A) — 재원 소진 위험 알림
- Background: 연한 회청색 (#F0F4FA) — 데이터 패널 배경
- Surface: 흰색 카드 + 미세 그림자

**Layout Paradigm**:
- 좌측: 파라미터 조작 패널 (슬라이더, 입력값)
- 우측: 실시간 시각화 대시보드 (차트, 지표 카드)
- 상단: 연도 타임라인 네비게이터 (2026~2029)
- 하단: 알고리즘 수식 설명 패널

**Signature Elements**:
1. 순환 화살표 애니메이션 — 3트랙 재원 흐름을 나타내는 SVG 애니메이션
2. 자립도 게이지 — 반원형 프로그레스 바로 정부 의존도 vs 자립 비율 표시
3. 동적 캡 계수 배지 — α, β, γ 계수가 실시간으로 색상 변화

**Interaction Philosophy**:
- 슬라이더를 움직이면 모든 차트가 즉시 재계산
- 연도 탭 전환 시 부드러운 숫자 카운트업 애니메이션
- 위험 임계값 초과 시 경고 색상으로 자동 전환

**Animation**:
- 페이지 로드: 카드들이 아래에서 순차적으로 올라오는 stagger 애니메이션
- 차트 업데이트: 300ms ease-out 트랜지션
- 수치 변경: framer-motion의 useSpring으로 숫자 카운트업
- 재원 흐름: SVG path stroke-dashoffset 애니메이션

**Typography System**:
- Display: Noto Sans KR 700 — 헤더, 큰 수치
- Body: Noto Sans KR 400/500 — 설명, 레이블
- Mono: JetBrains Mono — 수식, 계수값
- Scale: 12/14/16/20/24/32/48px
</idea>
<probability>0.08</probability>
</response>

<response>
<idea>
**Design Movement**: 네오브루탈리즘 + 정책 대시보드
**Core Principles**:
1. 굵은 경계선과 강한 대비 — 2px+ 검정 테두리, 강한 그림자
2. 격자 기반 레이아웃 — 엄격한 그리드로 데이터 정렬
3. 원색 강조 — 노랑/검정 조합으로 경고와 강조
4. 기능 우선 — 모든 요소가 데이터 전달에 기여

**Color Philosophy**:
- Background: 크림 화이트 (#FAFAF5)
- Primary: 딥 네이비 (#1A1A2E)
- Accent: 형광 노랑 (#FFE600)
- Success: 브라이트 그린 (#00C851)
- Border: 검정 (#000000)

**Layout Paradigm**:
- 전체 화면 그리드 레이아웃
- 각 섹션이 명확한 박스로 구분
- 타이포그래피가 레이아웃 구조 역할

**Signature Elements**:
1. 두꺼운 검정 테두리 카드
2. 오프셋 그림자 (4px 4px 0 black)
3. 굵은 숫자 타이포그래피

**Interaction Philosophy**:
- 클릭 시 버튼이 눌리는 느낌 (translateY 효과)
- 호버 시 그림자 확대

**Animation**:
- 최소한의 애니메이션, 즉각적 반응
- 수치 변경 시 플래시 효과

**Typography System**:
- Display: Black Han Sans 900
- Body: Noto Sans KR 400
- Mono: Source Code Pro
</idea>
<probability>0.05</probability>
</response>

<response>
<idea>
**Design Movement**: 미니멀 스칸디나비안 + 데이터 시각화
**Core Principles**:
1. 여백이 디자인 — 충분한 패딩과 마진으로 데이터에 집중
2. 단색 팔레트 — 한 가지 색상의 다양한 명도로 위계 표현
3. 선형 그래픽 — 아이콘과 차트 모두 얇은 선으로 통일
4. 타이포그래피 중심 — 폰트 크기와 굵기만으로 위계 구성

**Color Philosophy**:
- 거의 흑백에 가까운 팔레트
- 단 하나의 강조색 (인천 청색)
- 배경: 순수 흰색

**Layout Paradigm**:
- 중앙 정렬 단일 컬럼
- 섹션 간 충분한 여백

**Signature Elements**:
1. 얇은 선 차트
2. 미니멀 아이콘
3. 큰 타이포그래피 수치

**Interaction Philosophy**:
- 부드럽고 느린 트랜지션
- 호버 시 미세한 색상 변화

**Animation**:
- 페이드인 위주
- 차트 라인 드로잉 애니메이션

**Typography System**:
- Display: Noto Serif KR
- Body: Noto Sans KR
</idea>
<probability>0.04</probability>
</response>

## 선택된 디자인

**데이터 저널리즘 + 한국 공공 인포그래픽 미학** 접근법을 선택합니다.

인천시 공공 정책 시뮬레이터라는 특성상 신뢰성과 데이터 가독성이 최우선입니다.
청색(공공 신뢰) + 녹색(순환/자립) + 주황(경고) 3색 체계로 직관적인 상태 표시를 구현하고,
좌측 파라미터 패널 + 우측 시각화 대시보드의 비대칭 레이아웃으로 조작과 결과를 동시에 확인할 수 있는 구조를 만듭니다.
