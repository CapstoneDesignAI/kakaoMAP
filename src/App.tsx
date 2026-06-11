import { FormEvent, useEffect, useRef, useState } from 'react'

type KakaoLatLng = object
type KakaoMap = {
  setCenter: (position: KakaoLatLng) => void
  setLevel: (level: number) => void
}
type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void
}
type KakaoPlace = {
  address_name: string
  category_group_name: string
  category_name: string
  id: string
  phone: string
  place_name: string
  road_address_name: string
  x: string
  y: string
}
type KakaoPlacesSearchStatus = 'OK' | 'ZERO_RESULT' | 'ERROR'
type KakaoMaps = {
  load: (callback: () => void) => void
  LatLng: new (lat: number, lng: number) => KakaoLatLng
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
  services: {
    Places: new () => {
      keywordSearch: (
        keyword: string,
        callback: (
          data: KakaoPlace[],
          status: KakaoPlacesSearchStatus,
        ) => void,
      ) => void
    }
    Status: Record<KakaoPlacesSearchStatus, KakaoPlacesSearchStatus>
  }
}

type SelectedPlacePayload = {
  address: string
  category: string
  kakao_place_id: string
  latitude: number
  longitude: number
  name: string
}

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMaps
    }
    ReactNativeWebView?: {
      postMessage: (message: string) => void
    }
  }
}

const KAKAO_MAP_JS_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY as
  | string
  | undefined

let kakaoMapSdkPromise: Promise<KakaoMaps> | null = null

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

function toPayload(place: KakaoPlace): SelectedPlacePayload {
  return {
    address: place.road_address_name || place.address_name,
    category: place.category_group_name || place.category_name,
    kakao_place_id: place.id,
    latitude: Number(place.y),
    longitude: Number(place.x),
    name: place.place_name,
  }
}

function postSelectedPlace(place: KakaoPlace) {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({
      payload: toPayload(place),
      type: 'KAKAO_PLACE_SELECTED',
    }),
  )
}

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<KakaoMap | null>(null)
  const mapsApiRef = useRef<KakaoMaps | null>(null)
  const markerRef = useRef<KakaoMarker | null>(null)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'ready' | 'missing' | 'error'
  >(KAKAO_MAP_JS_KEY ? 'idle' : 'missing')
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<KakaoPlace[]>([])
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null)
  const [searchMessage, setSearchMessage] = useState('장소를 검색해 주세요.')
  const [isSearching, setIsSearching] = useState(false)

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

        mapsApiRef.current = maps
        mapInstanceRef.current = new maps.Map(mapRef.current, {
          center: new maps.LatLng(36.9905, 128.356),
          level: 7,
        })
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

  const selectPlace = (place: KakaoPlace) => {
    const maps = mapsApiRef.current
    const map = mapInstanceRef.current

    if (!maps || !map) {
      return
    }

    const position = new maps.LatLng(Number(place.y), Number(place.x))
    markerRef.current?.setMap(null)
    markerRef.current = new maps.Marker({
      map,
      position,
      title: place.place_name,
    })
    map.setCenter(position)
    map.setLevel(4)
    setSelectedPlace(place)
  }

  const searchPlaces = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const maps = mapsApiRef.current
    const trimmedKeyword = keyword.trim()

    if (!maps || !trimmedKeyword) {
      setSearchMessage('검색어를 입력해 주세요.')
      return
    }

    setIsSearching(true)
    setSearchMessage('검색 중입니다.')

    const places = new maps.services.Places()
    places.keywordSearch(trimmedKeyword, (data, searchStatus) => {
      setIsSearching(false)

      if (searchStatus === maps.services.Status.OK) {
        setResults(data.slice(0, 10))
        setSearchMessage(`${data.length}개의 장소를 찾았습니다.`)
        selectPlace(data[0])
        return
      }

      setResults([])
      setSelectedPlace(null)
      markerRef.current?.setMap(null)
      setSearchMessage(
        searchStatus === maps.services.Status.ZERO_RESULT
          ? '검색 결과가 없습니다.'
          : '장소 검색에 실패했습니다.',
      )
    })
  }

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#eef5f0]">
      <div ref={mapRef} className="relative z-0 h-full w-full" />

      {status === 'ready' ? (
        <section className="absolute left-3 right-3 top-3 z-[10000] max-h-[52dvh] overflow-hidden rounded-lg bg-white shadow-lg">
          <form className="flex gap-2 p-3" onSubmit={searchPlaces}>
            <input
              aria-label="장소 검색어"
              className="min-w-0 flex-1 rounded-md border border-[#E8DDD5] px-3 py-3 text-sm font-medium text-[#3A3A3A] outline-none focus:border-[#739E6B]"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="장소를 검색하세요"
              type="search"
              value={keyword}
            />
            <button
              className="rounded-md bg-[#739E6B] px-4 text-sm font-bold text-white disabled:bg-[#A59A93]"
              disabled={isSearching}
              type="submit"
            >
              검색
            </button>
          </form>

          <div className="border-t border-[#E8DDD5]">
            <p className="px-4 py-2 text-xs font-bold text-[#6F6762]">
              {searchMessage}
            </p>
            <div className="max-h-[34dvh] overflow-y-auto">
              {results.map((place) => (
                <button
                  className={`block w-full border-t border-[#F2E8E1] px-4 py-3 text-left ${
                    selectedPlace?.id === place.id ? 'bg-[#FFF8F3]' : 'bg-white'
                  }`}
                  key={place.id}
                  onClick={() => selectPlace(place)}
                  type="button"
                >
                  <span className="block truncate text-sm font-bold text-[#3A3A3A]">
                    {place.place_name}
                  </span>
                  <span className="mt-1 block truncate text-xs text-[#6F6762]">
                    {place.road_address_name || place.address_name}
                  </span>
                  <span className="mt-1 block truncate text-xs font-bold text-[#739E6B]">
                    {place.category_group_name || place.category_name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {selectedPlace ? (
        <section className="absolute bottom-3 left-3 right-3 z-[10000] rounded-lg bg-white p-4 shadow-lg">
          <p className="truncate text-base font-black text-[#3A3A3A]">
            {selectedPlace.place_name}
          </p>
          <p className="mt-1 truncate text-xs text-[#6F6762]">
            {selectedPlace.road_address_name || selectedPlace.address_name}
          </p>
          <button
            className="mt-3 h-11 w-full rounded-md bg-[#F08057] text-sm font-bold text-white"
            onClick={() => postSelectedPlace(selectedPlace)}
            type="button"
          >
            이 장소 저장하기
          </button>
        </section>
      ) : null}

      {status !== 'ready' ? (
        <div className="absolute inset-0 z-[10001] grid place-items-center bg-[#eef5f0] px-6 text-center">
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
