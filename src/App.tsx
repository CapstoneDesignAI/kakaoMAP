import { type FormEvent, useEffect, useRef, useState } from "react";

type KakaoLatLng = object;
type KakaoMap = {
  getCenter: () => KakaoLatLng;
  relayout: () => void;
  setCenter: (position: KakaoLatLng) => void;
  setLevel: (level: number) => void;
};
type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
};
type KakaoPolyline = {
  setMap: (map: KakaoMap | null) => void;
};
type KakaoPlace = {
  address_name: string;
  category_group_name: string;
  category_name: string;
  id: string;
  phone: string;
  place_name: string;
  road_address_name: string;
  x: string;
  y: string;
};
type KakaoPlacesSearchStatus = "OK" | "ZERO_RESULT" | "ERROR";
type KakaoMaps = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMap;
  Marker: new (options: {
    map: KakaoMap;
    position: KakaoLatLng;
    title: string;
  }) => KakaoMarker;
  InfoWindow: new (options: { content: string }) => {
    open: (map: KakaoMap, marker: KakaoMarker) => void;
  };
  Polyline: new (options: {
    map: KakaoMap;
    path: KakaoLatLng[];
    strokeColor: string;
    strokeOpacity: number;
    strokeStyle: string;
    strokeWeight: number;
  }) => KakaoPolyline;
  services: {
    Places: new () => {
      keywordSearch: (
        keyword: string,
        callback: (data: KakaoPlace[], status: KakaoPlacesSearchStatus) => void,
      ) => void;
    };
    Status: Record<KakaoPlacesSearchStatus, KakaoPlacesSearchStatus>;
  };
};

type SelectedPlacePayload = {
  address: string;
  category: string;
  kakao_place_id: string;
  latitude: number;
  longitude: number;
  name: string;
};

type MapPlacePayload = {
  address?: string | null;
  category?: string | null;
  id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  name: string;
  order?: number | null;
  place_id?: string | null;
  type?: "bookmark" | "route";
};

type TripickMapDataPayload = {
  bookmarks?: MapPlacePayload[];
  route?: {
    places: MapPlacePayload[];
    title?: string | null;
  } | null;
};

type TripickMapMessage = {
  payload?: TripickMapDataPayload;
  type: "TRIPICK_MAP_DATA";
};

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMaps;
    };
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const KAKAO_MAP_JS_KEY = import.meta.env.VITE_KAKAO_MAP_JS_KEY as
  | string
  | undefined;

let kakaoMapSdkPromise: Promise<KakaoMaps> | null = null;

function loadKakaoMapSdk() {
  if (!KAKAO_MAP_JS_KEY) {
    return Promise.reject(new Error("missing-kakao-map-key"));
  }

  if (window.kakao?.maps) {
    return new Promise<KakaoMaps>((resolve) => {
      window.kakao?.maps.load(() => resolve(window.kakao!.maps));
    });
  }

  if (kakaoMapSdkPromise) {
    return kakaoMapSdkPromise;
  }

  kakaoMapSdkPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
      KAKAO_MAP_JS_KEY,
    )}&autoload=false&libraries=services`;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("kakao-map-sdk-not-ready"));
        return;
      }

      window.kakao.maps.load(() => resolve(window.kakao!.maps));
    };
    script.onerror = () => reject(new Error("kakao-map-sdk-load-failed"));
    document.head.appendChild(script);
  });

  return kakaoMapSdkPromise;
}

function toPayload(place: KakaoPlace): SelectedPlacePayload {
  return {
    address: place.road_address_name || place.address_name,
    category: place.category_group_name || place.category_name,
    kakao_place_id: place.id,
    latitude: Number(place.y),
    longitude: Number(place.x),
    name: place.place_name,
  };
}

function postSelectedPlace(place: KakaoPlace, folderId: string | null) {
  window.ReactNativeWebView?.postMessage(
    JSON.stringify({
      payload: {
        place_id: null,
        folder_id: folderId,
        place: toPayload(place),
      },
      type: "KAKAO_PLACE_SELECTED",
    }),
  );
}

function parseTripickMapMessage(data: unknown): TripickMapMessage | null {
  const parsedData = typeof data === "string" ? JSON.parse(data) : data;

  if (!parsedData || typeof parsedData !== "object") {
    return null;
  }

  const message = parsedData as Partial<TripickMapMessage>;
  return message.type === "TRIPICK_MAP_DATA" ? (message as TripickMapMessage) : null;
}

function getCoordinates(place: MapPlacePayload) {
  const latitude = Number(place.latitude);
  const longitude = Number(place.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

function getMarkerTitle(place: MapPlacePayload, index: number) {
  return place.order ? `${place.order}. ${place.name}` : `${index + 1}. ${place.name}`;
}

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const mapsApiRef = useRef<KakaoMaps | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);
  const currentLocationMarkerRef = useRef<KakaoMarker | null>(null);
  const overlayMarkersRef = useRef<KakaoMarker[]>([]);
  const routePolylineRef = useRef<KakaoPolyline | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const pendingMapDataRef = useRef<TripickMapDataPayload | undefined>(undefined);
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "missing" | "error"
  >(KAKAO_MAP_JS_KEY ? "idle" : "missing");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<KakaoPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
  const [searchMessage, setSearchMessage] = useState("장소를 검색해 주세요.");
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  const handleClearKeyword = () => {
    setKeyword("");
    setResults([]);
    setSearchMessage("장소를 검색해 주세요.");
    setSelectedPlace(null);
    markerRef.current?.setMap(null);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (!value.trim()) {
      setResults([]);
      setSearchMessage("장소를 검색해 주세요.");
      setSelectedPlace(null);
      markerRef.current?.setMap(null);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fId = params.get("folder_id");
    if (fId) {
      setFolderId(fId);
    }
  }, []);

  const moveToCurrentLocation = (shouldShowMessage = true) => {
    const maps = mapsApiRef.current;
    const map = mapInstanceRef.current;

    if (!maps || !map) {
      return;
    }

    if (!navigator.geolocation) {
      if (shouldShowMessage) {
        setLocationMessage("현재 위치를 사용할 수 없습니다.");
      }
      return;
    }

    setIsLocating(true);
    if (shouldShowMessage) {
      setLocationMessage(null);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentPosition = new maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );

        currentLocationMarkerRef.current?.setMap(null);
        currentLocationMarkerRef.current = new maps.Marker({
          map,
          position: currentPosition,
          title: "내 위치",
        });
        map.setCenter(currentPosition);
        map.setLevel(4);
        setIsLocating(false);
        setLocationMessage(null);
      },
      () => {
        setIsLocating(false);
        if (shouldShowMessage) {
          setLocationMessage("위치 권한을 허용해 주세요.");
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 8000,
      },
    );
  };

  useEffect(() => {
    if (!mapRef.current || !KAKAO_MAP_JS_KEY) {
      return;
    }

    let cancelled = false;
    setStatus("loading");

    loadKakaoMapSdk()
      .then((maps) => {
        if (cancelled || !mapRef.current) {
          return;
        }

        mapsApiRef.current = maps;
        const map = new maps.Map(mapRef.current, {
          center: new maps.LatLng(36.9905, 128.356),
          level: 7,
        });
        mapInstanceRef.current = map;

        // Handle map layout issues when WebView size changes
        resizeObserverRef.current = new ResizeObserver(() => {
          if (mapInstanceRef.current) {
            const center = mapInstanceRef.current.getCenter();
            mapInstanceRef.current.relayout();
            mapInstanceRef.current.setCenter(center);
          }
        });
        resizeObserverRef.current.observe(mapRef.current);

        setStatus("ready");
        window.requestAnimationFrame(() => moveToCurrentLocation(false));
        if (pendingMapDataRef.current) {
          window.requestAnimationFrame(() => renderMapData(pendingMapDataRef.current));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus(KAKAO_MAP_JS_KEY ? "error" : "missing");
        }
      });

    return () => {
      cancelled = true;
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  const selectPlace = (place: KakaoPlace, autoSwitch = true) => {
    const maps = mapsApiRef.current;
    const map = mapInstanceRef.current;

    if (!maps || !map) {
      return;
    }

    const position = new maps.LatLng(Number(place.y), Number(place.x));
    markerRef.current?.setMap(null);
    markerRef.current = new maps.Marker({
      map,
      position,
      title: place.place_name,
    });
    map.setCenter(position);
    map.setLevel(4);
    setSelectedPlace(place);

    if (autoSwitch) {
      setShowSearch(false);
    }
  };

  const clearMapOverlays = () => {
    overlayMarkersRef.current.forEach((marker) => marker.setMap(null));
    overlayMarkersRef.current = [];
    routePolylineRef.current?.setMap(null);
    routePolylineRef.current = null;
  };

  const addMarker = (place: MapPlacePayload, index: number) => {
    const maps = mapsApiRef.current;
    const map = mapInstanceRef.current;

    const coordinates = getCoordinates(place);

    if (!maps || !map || !coordinates) {
      return null;
    }

    const marker = new maps.Marker({
      map,
      position: new maps.LatLng(coordinates.latitude, coordinates.longitude),
      title: getMarkerTitle(place, index),
    });
    const infoWindow = new maps.InfoWindow({
      content: `<div style="padding:8px 10px;font-size:12px;line-height:1.4;white-space:nowrap"><strong>${getMarkerTitle(
        place,
        index,
      )}</strong><br/>${place.category ?? "장소"}</div>`,
    });
    infoWindow.open(map, marker);
    overlayMarkersRef.current.push(marker);

    return marker;
  };

  const renderMapData = (payload?: TripickMapDataPayload) => {
    const maps = mapsApiRef.current;
    const map = mapInstanceRef.current;

    if (!maps || !map) {
      pendingMapDataRef.current = payload;
      return;
    }

    pendingMapDataRef.current = payload;
    clearMapOverlays();

    const bookmarks = (payload?.bookmarks ?? []).filter((place) =>
      Boolean(getCoordinates(place)),
    );
    const routePlaces = (payload?.route?.places ?? []).filter((place) =>
      Boolean(getCoordinates(place)),
    );

    bookmarks.forEach((place, index) => {
      addMarker({ ...place, type: "bookmark" }, index);
    });

    const routePath = routePlaces
      .map((place) => getCoordinates(place))
      .filter((coordinates): coordinates is NonNullable<typeof coordinates> =>
        Boolean(coordinates),
      )
      .map((coordinates) => new maps.LatLng(coordinates.latitude, coordinates.longitude));
    routePlaces.forEach((place, index) => {
      addMarker({ ...place, order: place.order ?? index + 1, type: "route" }, index);
    });

    if (routePath.length >= 2) {
      routePolylineRef.current = new maps.Polyline({
        map,
        path: routePath,
        strokeColor: "#F08057",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
        strokeWeight: 5,
      });
    }

    const firstRoutePlace = routePlaces[0] ?? bookmarks[0];
    const firstCoordinates = firstRoutePlace ? getCoordinates(firstRoutePlace) : null;
    if (firstCoordinates) {
      map.setCenter(new maps.LatLng(firstCoordinates.latitude, firstCoordinates.longitude));
      map.setLevel(routePlaces.length ? 6 : 5);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = parseTripickMapMessage(event.data);
        if (message) {
          renderMapData(message.payload);
        }
      } catch {
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage as EventListener);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage as EventListener);
    };
  });

  const searchPlaces = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const maps = mapsApiRef.current;
    const trimmedKeyword = keyword.trim();

    if (!maps || !trimmedKeyword) {
      setSearchMessage("검색어를 입력해 주세요.");
      return;
    }

    setIsSearching(true);
    setSearchMessage("검색 중입니다.");

    const places = new maps.services.Places();
    places.keywordSearch(trimmedKeyword, (data, searchStatus) => {
      setIsSearching(false);

      if (searchStatus === maps.services.Status.OK) {
        setResults(data.slice(0, 10));
        setSearchMessage(`${data.length}개의 장소를 찾았습니다.`);
        // 검색 시에는 첫 번째 결과로 이동만 하고 모드를 전환하지 않음
        selectPlace(data[0], false);
        return;
      }

      setResults([]);
      setSelectedPlace(null);
      markerRef.current?.setMap(null);
      setSearchMessage(
        searchStatus === maps.services.Status.ZERO_RESULT
          ? "검색 결과가 없습니다."
          : "장소 검색에 실패했습니다.",
      );
    });
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-[#eef5f0] touch-none">
      <div
        ref={mapRef}
        className="relative z-0 h-full w-full touch-pan-x touch-pan-y"
      />

      {status === "ready" ? (
        <button
          aria-label="내 위치로 이동"
          className="absolute bottom-[118px] right-3 z-[10000] flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#3A3A3A] shadow-lg active:bg-[#F6E6DC] disabled:text-[#A59A93]"
          disabled={isLocating}
          onClick={() => moveToCurrentLocation(true)}
          type="button"
        >
          {isLocating ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#739E6B] border-t-transparent" />
          ) : (
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36-2.12 2.12M7.76 16.24l-2.12 2.12m12.72 0-2.12-2.12M7.76 7.76 5.64 5.64"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
            </svg>
          )}
        </button>
      ) : null}

      {locationMessage ? (
        <p className="absolute bottom-[176px] left-3 right-3 z-[10000] rounded-lg bg-white/95 px-4 py-3 text-center text-sm font-bold text-[#3A3A3A] shadow-lg">
          {locationMessage}
        </p>
      ) : null}

      {status === "ready" && showSearch ? (
        <section className="absolute left-3 right-3 top-3 z-[10000] max-h-[52dvh] overflow-hidden rounded-lg bg-white shadow-lg transition-transform duration-300">
          <form className="flex gap-2 p-3" onSubmit={searchPlaces}>
            <div className="relative flex-1">
              <input
                aria-label="장소 검색어"
                className="w-full rounded-md border border-[#E8DDD5] py-3 pl-3 pr-10 text-base font-medium text-[#3A3A3A] outline-none focus:border-[#739E6B]"
                onChange={(event) => handleKeywordChange(event.target.value)}
                placeholder="장소를 검색하세요"
                type="search"
                value={keyword}
                style={{ fontSize: "16px" }} // Explicitly force 16px to prevent iOS zoom
              />
              {keyword && (
                <button
                  type="button"
                  onClick={handleClearKeyword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A59A93] hover:text-[#6F6762]"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              className="rounded-md bg-[#739E6B] px-4 text-sm font-bold text-white disabled:bg-[#A59A93]"
              disabled={isSearching}
              type="submit"
            >
              검색
            </button>
          </form>

          {keyword.trim() && (
            <div className="border-t border-[#E8DDD5]">
              <p className="px-4 py-2 text-xs font-bold text-[#6F6762]">
                {searchMessage}
              </p>
              <div className="max-h-[34dvh] overflow-y-auto">
                {results.map((place) => (
                  <button
                    className={`block w-full border-t border-[#F2E8E1] px-4 py-3 text-left ${
                      selectedPlace?.id === place.id
                        ? "bg-[#FFF8F3]"
                        : "bg-white"
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
          )}
        </section>
      ) : null}

      {selectedPlace && !showSearch ? (
        <section className="absolute top-3 left-3 right-3 z-[10000] rounded-lg bg-white p-4 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center text-sm font-bold text-[#739E6B]"
            >
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
              검색 결과로 돌아가기
            </button>
          </div>
          <p className="truncate text-lg font-black text-[#3A3A3A]">
            {selectedPlace.place_name}
          </p>
          <p className="mt-1 truncate text-sm text-[#6F6762]">
            {selectedPlace.road_address_name || selectedPlace.address_name}
          </p>
          <p className="mt-1 truncate text-xs font-bold text-[#739E6B]">
            {selectedPlace.category_group_name || selectedPlace.category_name}
          </p>
          <button
            className="mt-4 h-12 w-full rounded-md bg-[#F08057] text-base font-bold text-white shadow-sm active:bg-[#D96D46]"
            onClick={() => selectedPlace && postSelectedPlace(selectedPlace, folderId)}
            type="button"
          >
            이 장소 저장하기
          </button>
        </section>
      ) : null}

      {status !== "ready" ? (
        <div className="absolute inset-0 z-[10001] grid place-items-center bg-[#eef5f0] px-6 text-center">
          <p className="rounded-lg bg-white/95 px-4 py-3 text-sm font-bold text-[#3A3A3A] shadow">
            {status === "missing"
              ? "Kakao Maps JavaScript Key 설정이 필요합니다."
              : status === "loading"
                ? "카카오맵을 불러오는 중입니다."
                : "카카오맵을 불러오지 못했습니다."}
          </p>
        </div>
      ) : null}
    </main>
  );
}

export default App;
