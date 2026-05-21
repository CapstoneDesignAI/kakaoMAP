function App() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-8 text-slate-800">
      <section className="grid min-h-[520px] w-full max-w-5xl place-items-center border border-slate-300 bg-[linear-gradient(90deg,rgba(31,41,51,0.08)_1px,transparent_1px),linear-gradient(rgba(31,41,51,0.08)_1px,transparent_1px)] bg-[length:48px_48px] bg-slate-200">
        <div className="w-[min(420px,90%)] rounded-lg border border-slate-300 bg-white/90 p-7 shadow-xl shadow-slate-900/10">
          <p className="mb-2.5 text-[13px] font-bold uppercase text-cyan-700">
            Kakao Map Project
          </p>
          <h1 className="text-[32px] leading-tight font-bold">
            카카오맵 연동 준비 완료
          </h1>
          <p className="mt-4 leading-7">
            React와 Vite 기본 세팅이 끝났습니다. 이제 Kakao Maps SDK 키와
            지도 컴포넌트를 붙이면 됩니다.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
