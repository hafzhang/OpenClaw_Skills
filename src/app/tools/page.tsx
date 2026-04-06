'use client';

import { GoogleMap, MapLocation, PlaceSearch, Directions } from '@/components/maps/GoogleMap';
import { GoogleSearch, QuickSearch, SearchResult } from '@/components/search/GoogleSearch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

// 示例位置数据
const exampleLocations: MapLocation[] = [
  {
    lat: 39.9042,
    lng: 116.4074,
    title: '北京天安门',
    description: '中国首都的标志性建筑',
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    title: '上海外滩',
    description: '上海著名的历史文化街区',
  },
  {
    lat: 22.5431,
    lng: 114.0579,
    title: '深圳市民中心',
    description: '深圳市政府所在地',
  },
  {
    lat: 30.2741,
    lng: 120.1551,
    title: '杭州西湖',
    description: '中国著名的风景名胜',
  },
];

export default function ToolsPage() {
  const [selectedTab, setSelectedTab] = useState<'map' | 'search' | 'directions'>('map');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [mapLocations, setMapLocations] = useState<MapLocation[]>(exampleLocations);
  const [origin, setOrigin] = useState<MapLocation>(exampleLocations[0]);
  const [destination, setDestination] = useState<MapLocation>(exampleLocations[1]);

  const quickSearchQueries = [
    'OpenClaw 技能',
    'Next.js 教程',
    'React 组件',
    'TypeScript 最佳实践',
    'Tailwind CSS',
  ];

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      const newLocation: MapLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        title: place.name || '未知地点',
        description: place.formatted_address,
      };
      setMapLocations([...mapLocations, newLocation]);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Google 工具集成</h1>
          <p className="text-muted-foreground text-lg">
            集成 Google Maps 和 Google 搜索功能
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 flex gap-2 border-b">
          <Button
            variant={selectedTab === 'map' ? 'default' : 'ghost'}
            onClick={() => setSelectedTab('map')}
          >
            📍 地图
          </Button>
          <Button
            variant={selectedTab === 'search' ? 'default' : 'ghost'}
            onClick={() => setSelectedTab('search')}
          >
            🔍 搜索
          </Button>
          <Button
            variant={selectedTab === 'directions' ? 'default' : 'ghost'}
            onClick={() => setSelectedTab('directions')}
          >
            🧭 路线
          </Button>
        </div>

        {/* API Configuration Notice */}
        <Card className="mb-8 bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">API 配置说明</CardTitle>
            <CardDescription className="text-amber-700">
              要使用这些功能，请在 <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code> 文件中配置以下 API Key：
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-amber-700 space-y-2">
            <div>
              <strong>Google Maps API Key:</strong>{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code>
              <br />
              <a
                href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 hover:underline"
              >
                获取 API Key →
              </a>
            </div>
            <div>
              <strong>Google Search API Key:</strong>{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY</code>
              <br />
              <a
                href="https://developers.google.com/custom-search/v1/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 hover:underline"
              >
                获取 API Key →
              </a>
            </div>
            <div>
              <strong>Search Engine ID:</strong>{' '}
              <code className="bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_SEARCH_CX</code>
              <br />
              <a
                href="https://programmablesearchengine.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 hover:underline"
              >
                创建搜索引擎 →
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Map Tab */}
        {selectedTab === 'map' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>交互式地图</CardTitle>
                <CardDescription>显示多个标记点，支持点击查看详情</CardDescription>
              </CardHeader>
              <CardContent>
                <PlaceSearch
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="搜索地点并添加到地图..."
                  className="mb-4"
                />
                <GoogleMap
                  center={{ lat: 35.0, lng: 110.0, title: '中国中心' }}
                  zoom={5}
                  locations={mapLocations}
                  height="500px"
                  onLocationClick={(location) => console.log('Clicked:', location)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>当前标记点</CardTitle>
                <CardDescription>地图上的所有位置标记</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mapLocations.map((location, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold">{location.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                      {location.description && (
                        <p className="text-sm mt-1">{location.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Tab */}
        {selectedTab === 'search' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Google 搜索</CardTitle>
                <CardDescription>在网页中集成 Google 搜索功能</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickSearch
                  queries={quickSearchQueries}
                  onSelect={(query) => {
                    const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = query;
                      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  }}
                  className="mb-4"
                />
                <GoogleSearch onResults={handleSearchResults} />
              </CardContent>
            </Card>

            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>搜索结果统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Badge variant="outline">总结果: {searchResults.length}</Badge>
                    <Badge variant="outline">有缩略图: {searchResults.filter(r => r.thumbnail).length}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Directions Tab */}
        {selectedTab === 'directions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>路线规划</CardTitle>
                <CardDescription>计算两点之间的路线和距离</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">起点</label>
                    <select
                      className="w-full px-4 py-2 border border-input rounded-md"
                      value={origin.title}
                      onChange={(e) => {
                        const location = exampleLocations.find(l => l.title === e.target.value);
                        if (location) setOrigin(location);
                      }}
                    >
                      {exampleLocations.map((location) => (
                        <option key={location.title} value={location.title}>
                          {location.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">终点</label>
                    <select
                      className="w-full px-4 py-2 border border-input rounded-md"
                      value={destination.title}
                      onChange={(e) => {
                        const location = exampleLocations.find(l => l.title === e.target.value);
                        if (location) setDestination(location);
                      }}
                    >
                      {exampleLocations.map((location) => (
                        <option key={location.title} value={location.title}>
                          {location.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Directions
                  origin={origin}
                  destination={destination}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Usage Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
            <CardDescription>如何在项目中使用这些组件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. 地图组件</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`import { GoogleMap } from '@/components/maps/GoogleMap';

<GoogleMap
  center={{ lat: 39.9042, lng: 116.4074, title: '北京' }}
  zoom={12}
  locations={locations}
  height="400px"
/>`}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. 搜索组件</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`import { GoogleSearch } from '@/components/search/GoogleSearch';

<GoogleSearch onResults={(results) => console.log(results)} />`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
