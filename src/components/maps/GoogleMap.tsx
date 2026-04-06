'use client';

import * as React from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export interface MapLocation {
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

interface GoogleMapProps {
  center?: MapLocation;
  zoom?: number;
  locations?: MapLocation[];
  height?: string;
  onLocationClick?: (location: MapLocation) => void;
  className?: string;
}

export function GoogleMap({
  center = { lat: 39.9042, lng: 116.4074, title: '北京' }, // 默认北京
  zoom = 12,
  locations = [],
  height = '400px',
  onLocationClick,
  className = '',
}: GoogleMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = React.useState<google.maps.Marker[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  // 初始化 Google Maps API
  React.useEffect(() => {
    if (!apiKey || isLoaded) return;

    const initMap = async () => {
      try {
        setOptions({
          key: apiKey,
          libraries: ['places', 'geometry'],
        });

        // Load the core library
        await importLibrary('maps');
        await importLibrary('places');
        setIsLoaded(true);
      } catch (error) {
        console.error('Google Maps 加载失败:', error);
      }
    };

    initMap();
  }, [apiKey, isLoaded]);

  // 创建地图实例
  React.useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: center.lat, lng: center.lng },
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    });

    setMap(mapInstance);
  }, [isLoaded, map]);

  // 添加标记点
  React.useEffect(() => {
    if (!map || locations.length === 0) return;

    // 清除旧标记
    markers.forEach((marker) => marker.setMap(null));

    // 创建信息窗口
    const infoWindow = new google.maps.InfoWindow();

    // 添加新标记
    const newMarkers = locations.map((location) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map,
        title: location.title,
        animation: google.maps.Animation.DROP,
      });

      // 点击标记显示信息
      marker.addListener('click', () => {
        const content = `
          <div class="p-2">
            <h3 class="font-semibold text-lg">${location.title}</h3>
            ${location.description ? `<p class="text-sm text-gray-600 mt-1">${location.description}</p>` : ''}
          </div>
        `;
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
        onLocationClick?.(location);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // 调整视图以包含所有标记
    if (locations.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      map.fitBounds(bounds);
    }

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, locations]);

  // 更新中心点
  React.useEffect(() => {
    if (!map) return;
    map.panTo({ lat: center.lat, lng: center.lng });
  }, [map, center]);

  // 显示 API Key 缺失提示
  if (!apiKey) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <h3 className="text-lg font-semibold mb-2">Google Maps API Key 未配置</h3>
          <p className="text-sm text-muted-foreground">
            请在 .env.local 中配置 NEXT_PUBLIC_GOOGLE_MAPS_KEY
          </p>
          <a
            href="https://developers.google.com/maps/documentation/javascript/get-api-key"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm text-primary hover:underline"
          >
            获取 API Key →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className={`rounded-lg overflow-hidden shadow-sm ${className}`}
      style={{ height }}
    />
  );
}

// 地点搜索组件
interface PlaceSearchProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export function PlaceSearch({ onPlaceSelect, placeholder = '搜索地点...', className = '' }: PlaceSearchProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  React.useEffect(() => {
    if (!apiKey || isLoaded || !inputRef.current) return;

    const initAutocomplete = async () => {
      try {
        setOptions({
          key: apiKey,
          libraries: ['places'],
        });

        await importLibrary('places');

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current!, {
          types: ['geocode', 'establishment'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            onPlaceSelect(place);
          }
        });

        setIsLoaded(true);
      } catch (error) {
        console.error('Places API 加载失败:', error);
      }
    };

    initAutocomplete();
  }, [apiKey, isLoaded, onPlaceSelect]);

  if (!apiKey) {
    return (
      <input
        type="text"
        disabled
        placeholder="需要配置 Google Maps API Key"
        className={`w-full px-4 py-2 border border-input bg-muted rounded-md text-muted-foreground cursor-not-allowed ${className}`}
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
    />
  );
}

// 路线规划组件
interface DirectionsProps {
  origin: MapLocation;
  destination: MapLocation;
  travelMode?: google.maps.TravelMode;
  className?: string;
}

export function Directions({
  origin,
  destination,
  travelMode = google.maps.TravelMode.DRIVING,
  className = '',
}: DirectionsProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = React.useState<google.maps.DirectionsRenderer | null>(null);
  const [distance, setDistance] = React.useState<string>('');
  const [duration, setDuration] = React.useState<string>('');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  React.useEffect(() => {
    if (!apiKey || isLoaded || !mapRef.current) return;

    const initMap = async () => {
      try {
        setOptions({
          key: apiKey,
          libraries: ['places'],
        });

        await importLibrary('maps');
        await importLibrary('places');
        setIsLoaded(true);
      } catch (error) {
        console.error('Google Maps 加载失败:', error);
      }
    };

    initMap();
  }, [apiKey, isLoaded]);

  React.useEffect(() => {
    if (!isLoaded || map) return;

    const mapInstance = new google.maps.Map(mapRef.current!, {
      center: { lat: origin.lat, lng: origin.lng },
      zoom: 12,
    });

    const renderer = new google.maps.DirectionsRenderer({
      map: mapInstance,
      panel: null,
    });

    setMap(mapInstance);
    setDirectionsRenderer(renderer);
  }, [isLoaded, map, origin]);

  React.useEffect(() => {
    if (!map || !directionsRenderer) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
          const route = result.routes[0];
          const leg = route.legs[0];
          setDistance(leg.distance?.text || '');
          setDuration(leg.duration?.text || '');
        }
      }
    );
  }, [map, directionsRenderer, origin, destination, travelMode]);

  if (!apiKey) {
    return (
      <div className="text-center p-6 bg-muted rounded-lg">
        <p className="text-muted-foreground">需要配置 Google Maps API Key</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {(distance || duration) && (
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              距离: {distance}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              时间: {duration}
            </span>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="rounded-lg overflow-hidden shadow-sm"
        style={{ height: '400px' }}
      />
    </div>
  );
}
