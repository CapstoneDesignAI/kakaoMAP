import { useState } from 'react'

type Feature = {
  title: string
  description: string
}

type ReviewPoint = {
  label: string
  value: string
}

type ScreenExample = {
  title: string
  description: string
  kind: 'home' | 'place' | 'map'
}

const reviewSummary: ReviewPoint[] = [
  {
    label: '서비스명',
    value: 'Tripick',
  },
  {
    label: '운영 주체',
    value: 'CapstoneDesignAI 팀',
  },
  {
    label: '서비스 유형',
    value: 'AI 기반 여행 장소 및 동선 추천 모바일 서비스',
  },
  {
    label: '카카오맵 사용 목적',
    value: '추천 장소 위치 확인, 현재 위치 기준 거리 안내, 지도 기반 동선 확인',
  },
]

const features: Feature[] = [
  {
    title: '여행 맥락 기반 장소 추천',
    description:
      '사용자가 입력한 동행, 이동 수단, 예산, 선호 분위기를 바탕으로 방문 후보 장소를 추천합니다.',
  },
  {
    title: '현위치 기준 거리 확인',
    description:
      '추천 장소 카드와 지도 화면에서 사용자 현재 위치 기준 거리와 주변 위치 관계를 확인합니다.',
  },
  {
    title: '지도 기반 동선 확인',
    description:
      '선택한 장소를 카카오맵 화면에서 확인하고, 여행 흐름에 맞는 이동 순서를 검토합니다.',
  },
  {
    title: '내 장소와 내 동선 저장',
    description:
      '마음에 드는 장소와 추천 동선을 저장해 여행 중 다시 확인할 수 있도록 제공합니다.',
  },
]

const kakaoMapUses: Feature[] = [
  {
    title: '지도 표시',
    description:
      '모바일 앱의 Maps 탭 WebView 안에서 추천 장소의 좌표와 주변 지도를 표시합니다.',
  },
  {
    title: '장소 검색 및 좌표 확인',
    description:
      '추천 장소의 주소 또는 장소명을 기반으로 지도에 표시할 위치 정보를 확인합니다.',
  },
  {
    title: '거리와 이동 흐름 안내',
    description:
      '사용자 위치와 추천 장소 간 거리를 보여주고, 여러 장소를 방문할 때 이동 흐름을 이해할 수 있게 돕습니다.',
  },
]

const dataPolicy: Feature[] = [
  {
    title: '위치 정보 사용 범위',
    description:
      '사용자 위치는 근처 추천 장소 표시와 거리 계산에만 사용하며, 불필요한 위치 추적에는 사용하지 않습니다.',
  },
  {
    title: '장소 데이터 사용 범위',
    description:
      '장소명, 주소, 좌표 정보는 지도 표시와 동선 추천 화면 구성을 위해서만 사용합니다.',
  },
  {
    title: '외부 제공 여부',
    description:
      '사용자 입력 조건과 위치 기반 추천 결과는 광고 목적의 제3자 제공 없이 서비스 기능 제공에 한정합니다.',
  },
]

const screenExamples: ScreenExample[] = [
  {
    title: '1. 여행 조건 입력',
    description:
      '사용자가 동행, 이동 수단, 예산 등 추천에 필요한 여행 맥락을 선택합니다.',
    kind: 'home',
  },
  {
    title: '2. AI 장소 추천',
    description:
      '추천 장소 카드에서 장소명, 거리, 분위기 태그, 간단한 설명을 확인합니다.',
    kind: 'place',
  },
  {
    title: '3. 카카오맵 WebView',
    description:
      '지도 탭에서 카카오맵 기반 화면으로 추천 장소의 위치와 이동 흐름을 확인합니다.',
    kind: 'map',
  },
]

const reviewChecklist = [
  '카카오맵 API는 Tripick 서비스의 핵심 기능인 장소 위치 확인과 동선 확인에 사용됩니다.',
  '지도 화면은 모바일 앱의 Maps 탭에 WebView로 노출되며, 사용자가 직접 확인할 수 있는 서비스 화면입니다.',
  '위치 정보와 장소 정보는 추천 및 지도 표시 목적에 한정해 사용합니다.',
  '서비스 소개, 주요 기능, 카카오맵 사용 화면, 데이터 처리 방침을 본 페이지에 명시했습니다.',
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-sm font-black uppercase tracking-wide text-[#ff7548]">
      {children}
    </p>
  )
}

function InfoCard({ item }: { item: Feature }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
      <p className="mt-4 leading-7 text-slate-600">{item.description}</p>
    </article>
  )
}

function PhoneScreen({ example }: { example: ScreenExample }) {
  return (
    <article className="rounded-[28px] border border-slate-800 bg-slate-950 p-2 shadow-2xl shadow-slate-950/20">
      <div className="min-h-[540px] overflow-hidden rounded-[22px] bg-[#f2f4f6]">
        <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-slate-700" />
        <div className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#ff7548]">{example.title}</p>
              <h3 className="mt-1 text-xl font-extrabold text-slate-950">
                Tripick
              </h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
              Review
            </span>
          </div>
          {example.kind === 'home' && <TripContextMockup />}
          {example.kind === 'place' && <PlaceCardMockup />}
          {example.kind === 'map' && <MapMockup />}
        </div>
      </div>
      <div className="px-2 pb-2 pt-4">
        <h3 className="text-lg font-bold text-white">{example.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          {example.description}
        </p>
      </div>
    </article>
  )
}

function TripContextMockup() {
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">이번 여행은 어떤가요?</p>
      {[
        ['누구와', '혼자', '친구', '연인', '가족'],
        ['이동 수단', '도보', '대중교통', '자가용'],
        ['예산', '가성비', '적당히', '상관 없음'],
      ].map(([label, ...items]) => (
        <div key={label} className="mt-5">
          <p className="mb-2 text-sm font-bold text-slate-700">{label}</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span
                key={item}
                className={`rounded-full px-3 py-2 text-xs font-bold ${
                  index === 0
                    ? 'bg-[#ff7548] text-white'
                    : 'bg-[#fff1ed] text-[#ff7548]'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-6 rounded-2xl bg-[#fff1ed] p-4">
        <p className="text-sm font-bold text-[#ff7548]">추천 기준</p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          사용자가 입력한 여행 맥락을 기반으로 장소 후보를 정렬합니다.
        </p>
      </div>
    </div>
  )
}

function PlaceCardMockup() {
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-sm">
      <img
        className="h-40 w-full rounded-xl object-cover"
        src="/example-place.png"
        alt="추천 장소 예시"
      />
      <div className="mt-4">
        <h3 className="text-2xl font-extrabold text-slate-950">
          모토모토 MotoMoto
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-bold text-[#ff7548]">현재 위치에서 200m</span>
          <span className="rounded-full bg-[#ff7548] px-2.5 py-1 text-xs font-bold text-white">
            감성
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
            조용한
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          장소명, 거리, 분위기 태그를 확인한 뒤 지도에서 위치를 열람할 수
          있습니다.
        </p>
        <button className="mt-4 w-full rounded-lg bg-slate-950 py-3 text-sm font-bold text-white">
          지도에서 위치 보기
        </button>
      </div>
    </div>
  )
}

function MapMockup() {
  return (
    <div className="relative h-[400px] overflow-hidden rounded-[22px] border border-slate-200 bg-[#e8f3ef]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[length:40px_40px]" />
      <div className="absolute left-6 top-10 h-20 w-36 rounded-full border-[12px] border-[#70c1b3]/80" />
      <div className="absolute bottom-14 right-6 h-28 w-44 rounded-full border-[14px] border-[#ffd166]/80" />
      <div className="absolute left-10 top-28 h-3 w-44 rotate-12 rounded-full bg-white/80" />
      <div className="absolute left-24 top-44 h-3 w-52 -rotate-12 rounded-full bg-white/80" />
      <div className="absolute left-[42%] top-[38%] grid h-14 w-14 place-items-center rounded-full bg-[#ff7548] text-2xl font-black text-white shadow-xl shadow-[#ff7548]/30">
        T
      </div>
      <div className="absolute right-5 top-5 rounded-full bg-white px-3 py-2 text-xs font-black text-slate-700 shadow">
        Kakao Map 영역
      </div>
      <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-xl">
        <p className="text-xs font-bold text-[#ff7548]">Kakao Maps WebView</p>
        <p className="mt-1 text-sm font-bold text-slate-950">
          추천 장소 위치, 주변 지리 정보, 이동 흐름 확인
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          모바일 앱의 Maps 탭에서 WebView로 표시되는 지도 화면입니다.
        </p>
      </div>
    </div>
  )
}

function AppButton({
  children,
  variant,
  onClick,
}: {
  children: string
  variant: 'gradient' | 'green' | 'light' | 'gray'
  onClick?: () => void
}) {
  const styles = {
    gradient:
      'bg-[linear-gradient(90deg,#F29B7F,#A8B89A,#7D9AAE)] text-white',
    green: 'bg-[#739E6B] text-white',
    light: 'bg-[#F6E6DC] text-[#6F6762]',
    gray: 'bg-[#E8DDD5] text-[#6F6762]',
  }[variant]

  return (
    <button
      className={`h-[52px] w-full rounded-[10px] text-[17px] font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function ServiceExperience({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'home' | 'maps' | 'history' | 'my'>(
    'home',
  )

  return (
    <main className="min-h-screen bg-[#FFF8F3] text-[#3A3A3A]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6">
        <header className="mb-5 flex items-center justify-between rounded-[22px] border border-[#E8DDD5] bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs font-black uppercase text-[#F08057]">
              Tripick Service Preview
            </p>
            <h1 className="text-2xl font-black">서비스 화면</h1>
          </div>
          <button
            className="rounded-[10px] bg-[#3A3A3A] px-4 py-3 text-sm font-bold text-white"
            onClick={onBack}
            type="button"
          >
            랜딩으로 돌아가기
          </button>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[420px_1fr]">
          <div className="mx-auto w-full max-w-[420px] rounded-[34px] bg-[#262626] p-3 shadow-2xl shadow-slate-950/20">
            <div className="flex h-[760px] flex-col overflow-hidden rounded-[28px] bg-[#FFF8F3]">
              <div className="flex items-center justify-between border-b border-[#E8DDD5] bg-[#FFF8F3] px-5 py-4">
                <div>
                  <p className="text-xs font-bold text-[#A59A93]">Tripick</p>
                  <p className="text-lg font-black">오늘 어디로 떠날까요?</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F6E6DC] text-sm font-black text-[#F08057]">
                  T
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {activeTab === 'home' && <ServiceHomeScreen />}
                {activeTab === 'maps' && <ServiceMapScreen />}
                {activeTab === 'history' && <ServiceHistoryScreen />}
                {activeTab === 'my' && <ServiceMyScreen />}
              </div>

              <nav className="grid h-20 grid-cols-4 border-t border-[#E8DDD5] bg-[#FFF1ED]">
                {[
                  ['home', '홈'],
                  ['maps', '지도'],
                  ['history', '나의 여행'],
                  ['my', '마이'],
                ].map(([tab, label]) => (
                  <button
                    key={tab}
                    className={`text-xs font-black ${
                      activeTab === tab ? 'text-[#739E6B]' : 'text-[#A59A93]'
                    }`}
                    onClick={() =>
                      setActiveTab(tab as 'home' | 'maps' | 'history' | 'my')
                    }
                    type="button"
                  >
                    <span className="mx-auto mb-1 grid h-7 w-7 place-items-center rounded-full bg-white">
                      {label.slice(0, 1)}
                    </span>
                    {label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <SectionLabel>Implemented Web Preview</SectionLabel>
            <h2 className="mt-3 max-w-xl text-4xl font-black leading-tight">
              front 앱의 핵심 UI/UX를 React 웹 화면으로 재현했습니다.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6F6762]">
              하단 탭, 홈 추천 카드, 카카오 로그인 영역, 지도 WebView와
              BottomSheet 흐름을 웹에서 바로 확인할 수 있습니다. 카카오맵 심사자는
              랜딩 설명을 읽은 뒤 이 버튼으로 실제 서비스 화면 구조를 확인할 수
              있습니다.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                className="rounded-[10px] bg-[#739E6B] px-5 py-4 font-bold text-white"
                onClick={() => setActiveTab('home')}
                type="button"
              >
                홈 화면 보기
              </button>
              <button
                className="rounded-[10px] bg-[#F08057] px-5 py-4 font-bold text-white"
                onClick={() => setActiveTab('maps')}
                type="button"
              >
                지도 화면 보기
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function ServiceHomeScreen() {
  return (
    <section className="relative min-h-full overflow-hidden">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/example-place.png"
        alt="Tripick 홈 배경"
      />
      <div className="absolute inset-0 bg-[#3A3A3A]/20" />
      <div className="absolute inset-0 bg-[#F6E6DC]/20" />
      <div className="relative flex min-h-full flex-col justify-end gap-5 px-6 pb-10 pt-8">
        <div className="rounded-[28px] border border-white/45 bg-[#FFF8F3]/70 p-5 shadow-lg backdrop-blur">
          <div className="mb-5">
            <h2 className="text-[26px] font-black text-[#3A3A3A]">
              오늘 어디로 떠날까요?
            </h2>
            <p className="mt-1 text-[14px] font-medium leading-5 text-[#6F6762]">
              현재 위치와 취향에 맞춰 감성 여행지를 추천해드릴게요.
            </p>
          </div>
          <div className="grid gap-3">
            <AppButton variant="gradient">오늘의 추천</AppButton>
            <AppButton variant="green">커스텀 여행지 추천</AppButton>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/35 bg-[#FFF8F3]/70 p-5 shadow-sm backdrop-blur">
          <p className="font-bold text-[#7094AD]">로그아웃 상태입니다.</p>
          <button
            className="mt-6 h-[52px] w-full rounded-[10px] bg-[#FFE812] text-[15px] font-bold text-[#381F1F]"
            type="button"
          >
            카카오톡으로 로그인
          </button>
        </div>

        <ServiceRecommendCard />
      </div>
    </section>
  )
}

function ServiceRecommendCard() {
  const places = [
    {
      order: 1,
      name: '강릉 안목해변 카페거리',
      address: '강원 강릉시 창해로 14',
      description:
        '바다 풍경을 바라보며 시원한 커피 한 잔으로 여행을 잔잔하게 시작합니다.',
    },
    {
      order: 2,
      name: '초당순두부마을',
      address: '강원 강릉시 초당동',
      description: '점심식사로 자극적이지 않고 고소한 짬뽕순두부를 즐깁니다.',
    },
  ]

  return (
    <article className="rounded-[24px] border border-[#E8DDD5] bg-[#FFF8F3] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-bold leading-tight text-[#3A3A3A]">
            강릉 초당 감성 힐링 데이트 코스
          </h2>
          <p className="mt-2 text-[18px] font-medium text-[#3A3A3A]">
            약 6시간
          </p>
        </div>
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F6E6DC] text-lg font-black text-[#7D9AAE]">
          R
        </div>
      </div>
      <p className="mt-2 text-[12px] text-[#6F6762]">
        AI가 선택한 {places.length}개 장소를 순서대로 방문하는 추천 동선
      </p>

      <div className="mt-4 rounded-[16px] bg-[#F6E6DC] p-[14px]">
        {places.map((place, index) => (
          <div key={place.name} className="flex gap-[10px]">
            <div className="flex flex-col items-center">
              <div className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#739E6B] text-[12px] font-bold text-white">
                {place.order}
              </div>
              {index < places.length - 1 ? (
                <div className="min-h-[42px] w-[2px] flex-1 bg-[#739E6B]" />
              ) : null}
            </div>
            <div className="flex-1 pb-[10px]">
              <p className="truncate text-[15px] font-bold text-[#3A3A3A]">
                {place.name}
              </p>
              <p className="mt-[3px] text-[12px] text-[#6F6762]">
                {place.address}
              </p>
              <p className="mt-[4px] text-[12px] leading-4 text-[#6F6762]">
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <AppButton variant="gradient">맘에 들어요</AppButton>
        <AppButton variant="gray">별로예요</AppButton>
      </div>
    </article>
  )
}

function ServiceMapScreen() {
  return (
    <section className="relative min-h-full overflow-hidden bg-[#eef5f0]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(58,58,58,0.08)_1px,transparent_1px),linear-gradient(rgba(58,58,58,0.08)_1px,transparent_1px)] bg-[length:44px_44px]" />
      <div className="absolute left-8 top-12 h-28 w-48 rounded-full border-[16px] border-[#A8B89A]/80" />
      <div className="absolute right-6 top-56 h-32 w-52 rounded-full border-[16px] border-[#F29B7F]/75" />
      <div className="absolute left-14 top-36 h-3 w-64 rotate-12 rounded-full bg-white/80" />
      <div className="absolute left-28 top-60 h-3 w-52 -rotate-12 rounded-full bg-white/80" />
      <div className="absolute left-[44%] top-[32%] grid h-16 w-16 place-items-center rounded-full bg-[#F08057] text-2xl font-black text-white shadow-xl shadow-[#F08057]/30">
        T
      </div>
      <div className="absolute right-5 top-5 rounded-full bg-white px-3 py-2 text-xs font-black text-[#6F6762] shadow">
        Kakao Map WebView
      </div>
      <div className="absolute bottom-0 left-0 right-0 rounded-t-[24px] border border-[#E8DDD5] bg-[#FFF8F3] pb-[18px] shadow-xl">
        <div className="flex justify-center pb-2 pt-[10px]">
          <div className="h-1 w-[42px] rounded-full bg-[#739E6B]" />
        </div>
        <div className="px-5 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#F08057]">저장한 장소</p>
              <h2 className="text-xl font-black text-[#3A3A3A]">
                강릉 힐링 코스
              </h2>
            </div>
            <button
              className="rounded-full bg-[#F6E6DC] px-3 py-2 text-xs font-bold text-[#6F6762]"
              type="button"
            >
              폴더
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {['안목해변 카페거리', '초당순두부마을'].map((place, index) => (
              <div
                key={place}
                className="flex items-center justify-between rounded-[14px] bg-white px-4 py-3"
              >
                <span className="font-bold text-[#3A3A3A]">{place}</span>
                <span className="text-xs font-black text-[#739E6B]">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceHistoryScreen() {
  return (
    <section className="min-h-full bg-[#FFF8F3] px-6 py-8">
      <h2 className="text-[26px] font-black">나의 여행</h2>
      <p className="mt-2 text-sm leading-6 text-[#6F6762]">
        저장한 장소와 추천 동선을 다시 확인합니다.
      </p>
      <div className="mt-6 grid gap-3">
        {['내 장소', '내 동선'].map((item, index) => (
          <div
            key={item}
            className="rounded-[22px] border border-[#E8DDD5] bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-bold text-[#F08057]">{item}</p>
            <h3 className="mt-2 text-xl font-black">
              {index === 0 ? '감성 카페 모음' : '강릉 초당 힐링 코스'}
            </h3>
            <p className="mt-2 text-sm text-[#6F6762]">
              최근 추천 결과를 저장한 항목입니다.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ServiceMyScreen() {
  return (
    <section className="min-h-full bg-[#FFF8F3] px-6 py-8">
      <h2 className="text-[26px] font-black">마이</h2>
      <div className="mt-6 rounded-[24px] border border-[#E8DDD5] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F6E6DC] text-2xl font-black text-[#F08057]">
            T
          </div>
          <div>
            <p className="text-sm font-bold text-[#A59A93]">카카오 로그인 연동</p>
            <h3 className="text-xl font-black">Tripick 사용자</h3>
          </div>
        </div>
        <p className="mt-5 text-sm leading-6 text-[#6F6762]">
          프로필, 즐겨찾기, 여행 기록을 관리하는 화면입니다.
        </p>
      </div>
    </section>
  )
}

function App() {
  const [view, setView] = useState<'landing' | 'service'>('landing')

  if (view === 'service') {
    return (
      <ServiceExperience
        onBack={() => {
          setView('landing')
          window.requestAnimationFrame(() => window.scrollTo(0, 0))
        }}
      />
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <section className="relative min-h-screen overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/example-place.png"
          alt="Tripick 추천 장소 배경"
        />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-20">
          <p className="mb-4 w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
            Kakao Map Permission Review Page
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight text-white md:text-7xl">
            Tripick
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-100">
            Tripick은 즉흥성과 여행 맥락을 바탕으로 장소와 동선을 추천하는 AI
            여행 에이전트입니다. 카카오맵 권한은 추천 장소의 위치 확인, 현재
            위치 기준 거리 안내, 지도 기반 동선 확인을 위해 필요합니다.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-[10px] bg-[#ff7548] px-6 py-4 text-base font-black text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#f06436]"
              onClick={() => {
                setView('service')
                window.requestAnimationFrame(() => window.scrollTo(0, 0))
              }}
              type="button"
            >
              서비스 보러가기
            </button>
            <a
              className="rounded-[10px] border border-white/25 bg-white/10 px-6 py-4 text-center text-base font-black text-white backdrop-blur transition hover:bg-white/20"
              href="#kakao-map-use"
            >
              카카오맵 사용 목적 보기
            </a>
          </div>
          <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reviewSummary.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-xs font-black uppercase text-[#ffd166]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-bold leading-6 text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="service" className="mx-auto max-w-6xl px-6 py-20">
        <SectionLabel>Service Overview</SectionLabel>
        <div className="mt-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <h2 className="text-4xl font-black">서비스명: Tripick</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Tripick은 사용자의 여행 상황과 취향을 빠르게 입력받아 현재 맥락에
              맞는 장소를 추천하고, 선택한 장소를 지도와 동선으로 연결하는
              모바일 여행 추천 서비스입니다.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black">심사용 핵심 설명</h3>
            <ul className="mt-5 space-y-3">
              {reviewChecklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#ff7548] text-xs font-black text-white">
                    ✓
                  </span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="kakao-map-use" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionLabel>Kakao Map API Use</SectionLabel>
          <h2 className="mt-3 text-4xl font-black">카카오맵 권한 신청 목적</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            카카오맵은 Tripick의 추천 결과를 사용자가 실제 위치 맥락에서
            확인하기 위한 핵심 화면입니다. 단순 홍보 목적이 아니라, 서비스의
            장소 추천 및 동선 추천 기능을 완성하기 위해 지도 표시와 장소 위치
            확인이 필요합니다.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {kakaoMapUses.map((item) => (
              <InfoCard key={item.title} item={item} />
            ))}
          </div>
          <div className="mt-8 rounded-lg border border-[#ff7548]/30 bg-[#fff1ed] p-6">
            <h3 className="text-xl font-black text-[#b94726]">
              사용 예정 API 범위
            </h3>
            <p className="mt-3 leading-7 text-slate-700">
              WebView 기반 지도 화면에서 Kakao Maps JavaScript API를 사용해 지도와
              마커를 표시하고, 장소명 또는 주소 기반 위치 확인에는 로컬 API 활용을
              검토합니다. 권한은 Tripick 서비스 내부 지도 기능에 한정해 사용합니다.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <SectionLabel>Features</SectionLabel>
        <h2 className="mt-3 text-4xl font-black">주요 기능</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <InfoCard key={feature.title} item={feature} />
          ))}
        </div>
      </section>

      <section id="screens" className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-black uppercase tracking-wide text-[#ffd166]">
            App Screens
          </p>
          <h2 className="mt-3 text-4xl font-black text-white">앱 화면 예시</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            아래 화면은 카카오맵 권한 심사에서 서비스 사용 흐름을 설명하기 위한
            예시입니다. 실제 모바일 앱에서는 Maps 탭에 WebView를 두고, 이 웹
            프로젝트의 지도 화면을 표시합니다.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {screenExamples.map((example) => (
              <PhoneScreen key={example.title} example={example} />
            ))}
          </div>
        </div>
      </section>

      <section id="data" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <SectionLabel>Data Handling</SectionLabel>
          <h2 className="mt-3 text-4xl font-black">
            위치 및 장소 데이터 처리 방침
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Tripick은 카카오맵 권한을 서비스 기능 제공 범위 안에서만 사용합니다.
            심사자가 사용 범위를 명확히 확인할 수 있도록 데이터 처리 목적을 아래와
            같이 제한합니다.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {dataPolicy.map((item) => (
              <InfoCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="operation" className="mx-auto max-w-6xl px-6 py-20">
        <SectionLabel>Operation</SectionLabel>
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-4xl font-black">운영 및 검수 정보</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              본 페이지는 카카오맵 권한 신청 심사를 위해 Tripick의 서비스 목적,
              카카오맵 사용 화면, 위치 정보 사용 범위를 설명하는 공식 안내
              페이지입니다.
            </p>
            <button
              className="mt-8 rounded-[10px] bg-[#739E6B] px-6 py-4 font-black text-white"
              onClick={() => {
                setView('service')
                window.requestAnimationFrame(() => window.scrollTo(0, 0))
              }}
              type="button"
            >
              서비스 화면 바로 열기
            </button>
          </div>
          <div className="rounded-lg bg-slate-950 p-6 text-white">
            <dl className="grid gap-5">
              <div>
                <dt className="text-sm font-black text-[#ffd166]">앱 화면 위치</dt>
                <dd className="mt-1 leading-7">
                  모바일 앱 하단 탭의 Maps 화면에서 WebView로 카카오맵 화면 표시
                </dd>
              </div>
              <div>
                <dt className="text-sm font-black text-[#ffd166]">서비스 상태</dt>
                <dd className="mt-1 leading-7">
                  캡스톤 프로젝트 개발 및 심사용 데모 단계
                </dd>
              </div>
              <div>
                <dt className="text-sm font-black text-[#ffd166]">권한 사용 원칙</dt>
                <dd className="mt-1 leading-7">
                  Tripick 내부 지도 기능에 한정하여 카카오맵 API 사용
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
