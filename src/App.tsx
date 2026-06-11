import { useEffect, useRef, useState } from 'react'

type KakaoLatLng = object
type KakaoLatLngBounds = {
  extend: (position: KakaoLatLng) => void
}
type KakaoMap = {
  setBounds: (bounds: KakaoLatLngBounds) => void
}
type KakaoMarker = object
type KakaoMaps = {
  load: (callback: () => void) => void
  LatLng: new (lat: number, lng: number) => KakaoLatLng
  LatLngBounds: new () => KakaoLatLngBounds
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMap
  Marker: new (options: {
    map: KakaoMap
    position: KakaoLatLng
    title: string
  }) => KakaoMarker
  InfoWindow: new (options: { content: string }) => {
    open: (map: KakaoMap, marker: KakaoMarker) => void
  }
  Polyline: new (options: {
    map: KakaoMap
    path: KakaoLatLng[]
    strokeColor: string
    strokeOpacity: number
    strokeStyle: string
    strokeWeight: number
  }) => object
}

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMaps
    }
  }
}

const KAKAO_MAP_JS_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY as
  | string
  | undefined

let kakaoMapSdkPromise: Promise<KakaoMaps> | null = null

const mapPlaces = [
  {
    category: '추천 여행지',
    lat: 36.9847,
    lng: 128.3655,
    name: '단양 구경시장',
  },
  {
    category: '추천 여행지',
    lat: 36.9961,
    lng: 128.3427,
    name: '도담삼봉',
  },
  {
    category: '지역 미션',
    lat: 36.9839,
    lng: 128.365,
    name: '로컬 시장 간식 미션',
  },
]

function loadKakaoMapSdk() {
  if (!KAKAO_MAP_JS_KEY) {
    return Promise.reject(new Error('missing-kakao-map-key'))
  }

  if (window.kakao?.maps) {
    return new Promise<KakaoMaps>((resolve) => {
      window.kakao?.maps.load(() => resolve(window.kakao!.maps))
    })
  }

  if (kakaoMapSdkPromise) {
    return kakaoMapSdkPromise
  }

  kakaoMapSdkPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
      KAKAO_MAP_JS_KEY,
    )}&autoload=false&libraries=services`
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error('kakao-map-sdk-not-ready'))
        return
      }

      window.kakao.maps.load(() => resolve(window.kakao!.maps))
    }
    script.onerror = () => reject(new Error('kakao-map-sdk-load-failed'))
    document.head.appendChild(script)
  })

  return kakaoMapSdkPromise
}

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'ready' | 'missing' | 'error'
  >(KAKAO_MAP_JS_KEY ? 'idle' : 'missing')

  useEffect(() => {
    if (!mapRef.current || !KAKAO_MAP_JS_KEY) {
      return
    }

    let cancelled = false
    setStatus('loading')

    loadKakaoMapSdk()
      .then((maps) => {
        if (cancelled || !mapRef.current) {
          return
        }

        mapRef.current.innerHTML = ''

        const map = new maps.Map(mapRef.current, {
          center: new maps.LatLng(36.9905, 128.356),
          level: 6,
        })
        const bounds = new maps.LatLngBounds()
        const path: KakaoLatLng[] = []

        mapPlaces.forEach((place) => {
          const position = new maps.LatLng(place.lat, place.lng)
          path.push(position)
          bounds.extend(position)

          const marker = new maps.Marker({
            map,
            position,
            title: place.name,
          })
          const infoWindow = new maps.InfoWindow({
            content: `<div style="padding:8px 10px;font-size:12px;line-height:1.4;white-space:nowrap"><strong>${place.name}</strong><br/>${place.category}</div>`,
          })
          infoWindow.open(map, marker)
        })

        new maps.Polyline({
          map,
          path,
          strokeColor: '#F08057',
          strokeOpacity: 0.85,
          strokeStyle: 'solid',
          strokeWeight: 4,
        })

        map.setBounds(bounds)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) {
          setStatus(KAKAO_MAP_JS_KEY ? 'error' : 'missing')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#eef5f0]">
      <div ref={mapRef} className="h-full w-full" />
      {status !== 'ready' ? (
        <div className="absolute inset-0 grid place-items-center bg-[#eef5f0] px-6 text-center">
          <p className="rounded-lg bg-white/95 px-4 py-3 text-sm font-bold text-[#3A3A3A] shadow">
            {status === 'missing'
              ? 'Kakao Maps JavaScript Key 설정이 필요합니다.'
              : status === 'loading'
                ? '카카오맵을 불러오는 중입니다.'
                : '카카오맵을 불러오지 못했습니다.'}
          </p>
        </div>
      ) : null}
    </main>
  )
}

export default App
