type Feature = {
  title: string
  description: string
}

type ScreenExample = {
  title: string
  description: string
  kind: 'home' | 'place' | 'map'
}

const features: Feature[] = [
  {
    title: '여행 맥락 기반 장소 추천',
    description:
      '동행, 이동 수단, 예산, 선호 분위기를 바탕으로 지금 방문하기 좋은 장소를 제안합니다.',
  },
  {
    title: '카카오맵 위치 확인',
    description:
      '추천 장소의 위치, 현재 위치 기준 거리, 주변 이동 흐름을 지도 화면에서 확인합니다.',
  },
  {
    title: '동선 추천과 저장',
    description:
      '선택한 장소들을 여행 흐름에 맞게 묶고, 마음에 드는 장소와 동선을 다시 볼 수 있게 저장합니다.',
  },
]

const screenExamples: ScreenExample[] = [
  {
    title: '여행 조건 입력',
    description: '누구와, 어떤 이동 수단으로, 어떤 예산으로 여행하는지 선택합니다.',
    kind: 'home',
  },
  {
    title: 'AI 장소 추천',
    description: '취향과 맥락에 맞는 장소 카드에서 거리, 태그, 선호도를 확인합니다.',
    kind: 'place',
  },
  {
    title: '카카오맵 WebView',
    description: '앱 안의 지도 탭에서 추천 장소와 이동 경로를 카카오맵 기반 화면으로 표시합니다.',
    kind: 'map',
  },
]

function PhoneScreen({ example }: { example: ScreenExample }) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-slate-950 p-2 shadow-2xl shadow-slate-950/20">
      <div className="min-h-[520px] overflow-hidden rounded-[22px] bg-[#f2f4f6]">
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
              Demo
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
          <span className="font-bold text-[#ff7548]">200m</span>
          <span className="rounded-full bg-[#ff7548] px-2.5 py-1 text-xs font-bold text-white">
            감성
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
            조용한
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          춘천 3층짜리 대형 카페. 조용한 여행을 원하는 사용자에게 추천됩니다.
        </p>
      </div>
    </div>
  )
}

function MapMockup() {
  return (
    <div className="relative h-[380px] overflow-hidden rounded-[22px] border border-slate-200 bg-[#e8f3ef]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px)] bg-[length:40px_40px]" />
      <div className="absolute left-6 top-10 h-20 w-36 rounded-full border-[12px] border-[#70c1b3]/80" />
      <div className="absolute bottom-14 right-6 h-28 w-44 rounded-full border-[14px] border-[#ffd166]/80" />
      <div className="absolute left-10 top-28 h-3 w-44 rotate-12 rounded-full bg-white/80" />
      <div className="absolute left-24 top-44 h-3 w-52 -rotate-12 rounded-full bg-white/80" />
      <div className="absolute left-[42%] top-[38%] grid h-14 w-14 place-items-center rounded-full bg-[#ff7548] text-2xl font-black text-white shadow-xl shadow-[#ff7548]/30">
        T
      </div>
      <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-xl">
        <p className="text-xs font-bold text-[#ff7548]">Kakao Maps WebView</p>
        <p className="mt-1 text-sm font-bold text-slate-950">
          추천 장소 위치와 이동 흐름을 지도에서 확인
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="/example-place.png"
          alt="Tripick 추천 장소 배경"
        />
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="relative mx-auto flex min-h-[92vh] w-full max-w-6xl flex-col justify-center px-6 py-20">
          <p className="mb-4 w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
            Kakao Business App Review
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight text-white md:text-7xl">
            Tripick
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-100">
            즉흥성과 여행 맥락을 바탕으로 장소와 동선을 추천하는 AI 여행
            에이전트입니다. 카카오맵은 추천 장소의 위치 확인, 거리 안내, 지도
            기반 동선 확인에 사용됩니다.
          </p>
          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {['서비스명', '서비스 소개', '주요 기능'].map((label) => (
              <a
                key={label}
                className="rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                href={`#${label}`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="서비스명" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-black uppercase text-[#ff7548]">Service Name</p>
        <h2 className="mt-3 text-4xl font-black">서비스명: Tripick</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
          Tripick은 사용자의 여행 상황과 취향을 빠르게 입력받아 현재 맥락에 맞는
          장소를 추천하고, 선택한 장소를 지도와 동선으로 연결하는 모바일 여행
          추천 서비스입니다.
        </p>
      </section>

      <section id="서비스 소개" className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#0b7285]">
              Service Overview
            </p>
            <h2 className="mt-3 text-4xl font-black">서비스 소개</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              사용자는 여행 동행, 이동 수단, 예산, 선호 분위기를 선택합니다.
              Tripick은 입력된 여행 맥락을 바탕으로 장소 추천과 동선 추천을
              제공하며, 지도 화면에서는 카카오맵 기반 WebView로 추천 장소의
              위치와 이동 흐름을 확인합니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-[#fff1ed] p-6">
              <p className="text-4xl font-black text-[#ff7548]">01</p>
              <p className="mt-4 font-bold">여행 조건 입력</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                동행, 이동 수단, 예산 등 추천에 필요한 맥락을 수집합니다.
              </p>
            </div>
            <div className="rounded-lg bg-[#edf8f7] p-6">
              <p className="text-4xl font-black text-[#0b7285]">02</p>
              <p className="mt-4 font-bold">장소와 동선 추천</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                AI가 사용자 취향과 상황에 맞는 후보를 정리합니다.
              </p>
            </div>
            <div className="rounded-lg bg-[#f6f0ff] p-6 sm:col-span-2">
              <p className="text-4xl font-black text-[#6d28d9]">03</p>
              <p className="mt-4 font-bold">카카오맵 지도 확인</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                추천 장소의 위치, 거리, 이동 경로를 지도 화면에서 확인합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="주요 기능" className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-black uppercase text-[#ff7548]">Features</p>
        <h2 className="mt-3 text-4xl font-black">주요 기능</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-black">{feature.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="앱 화면 예시" className="bg-slate-950">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-black uppercase text-[#ffd166]">
            App Screens
          </p>
          <h2 className="mt-3 text-4xl font-black text-white">앱 화면 예시</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            아래 화면은 카카오 비즈니스 앱 심사에서 서비스 사용 흐름을 설명하기
            위한 예시입니다. 실제 모바일 앱에서는 지도 탭이 WebView로 Tripick의
            카카오맵 화면을 표시합니다.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {screenExamples.map((example) => (
              <PhoneScreen key={example.title} example={example} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
