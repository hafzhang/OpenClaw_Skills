# Google 工具集成指南

本指南说明如何配置和使用项目中的 Google Maps 和 Google 搜索功能。

## 功能概述

- **Google Maps**: 交互式地图、地点标记、地点搜索、路线规划
- **Google Search**: 网络搜索集成、搜索建议、快速搜索

## 配置步骤

### 1. 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件（已包含 `.env.local.example` 作为模板）：

```bash
cp .env.local.example .env.local
```

### 2. 获取 Google Maps API Key

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用以下 API：
   - Maps JavaScript API
   - Places API
   - Directions API
4. 创建 API 凭证 → API 密钥
5. 在 `.env.local` 中设置：

```env
NEXT_PUBLIC_GOOGLE_MAPS_KEY=你的_API_密钥
```

**重要**: 为安全起见，建议对 API Key 设置以下限制：
- 应用限制：HTTP referrer（你的域名）
- API 限制：限制为上述三个 API

### 3. 获取 Google Custom Search API Key

1. 访问 [Google Custom Search API](https://developers.google.com/custom-search/v1/overview)
2. 创建项目或选择现有项目
3. 启用 Custom Search API
4. 创建 API 密钥
5. 在 `.env.local` 中设置：

```env
NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY=你的搜索_API_密钥
```

### 4. 创建自定义搜索引擎 (CSE)

1. 访问 [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. 点击"添加"创建新的搜索引擎
3. 设置要搜索的网站（可以设置为搜索整个网络）
4. 在"设置"中启用"搜索整个网络"
5. 获取搜索引擎 ID (CX)
6. 在 `.env.local` 中设置：

```env
NEXT_PUBLIC_GOOGLE_SEARCH_CX=你的搜索引擎_ID
```

## 使用方法

### Google Maps 组件

#### 基础地图

```tsx
import { GoogleMap } from '@/components/maps/GoogleMap';

function MyMap() {
  const center = {
    lat: 39.9042,
    lng: 116.4074,
    title: '北京'
  };

  const locations = [
    {
      lat: 39.9042,
      lng: 116.4074,
      title: '天安门',
      description: '中国首都的标志性建筑'
    }
  ];

  return (
    <GoogleMap
      center={center}
      zoom={12}
      locations={locations}
      height="400px"
      onLocationClick={(location) => console.log(location)}
    />
  );
}
```

#### 地点搜索

```tsx
import { PlaceSearch } from '@/components/maps/GoogleMap';

function MyPlaceSearch() {
  return (
    <PlaceSearch
      onPlaceSelect={(place) => {
        console.log('Selected place:', place);
      }}
      placeholder="搜索地点..."
    />
  );
}
```

#### 路线规划

```tsx
import { Directions } from '@/components/maps/GoogleMap';

function MyDirections() {
  const origin = { lat: 39.9042, lng: 116.4074, title: '北京' };
  const destination = { lat: 31.2304, lng: 121.4737, title: '上海' };

  return (
    <Directions
      origin={origin}
      destination={destination}
      travelMode={google.maps.TravelMode.DRIVING}
    />
  );
}
```

### Google Search 组件

```tsx
import { GoogleSearch } from '@/components/search/GoogleSearch';

function MySearch() {
  return (
    <GoogleSearch
      onResults={(results) => {
        console.log('Search results:', results);
      }}
    />
  );
}
```

#### 快速搜索

```tsx
import { QuickSearch } from '@/components/search/GoogleSearch';

function MyQuickSearch() {
  const queries = ['React 教程', 'Next.js 指南'];

  return (
    <QuickSearch
      queries={queries}
      onSelect={(query) => {
        console.log('Selected query:', query);
      }}
    />
  );
}
```

## 费用说明

### Google Maps API

| API | 免费额度 | 超出费用 |
|-----|---------|---------|
| Maps JavaScript API | $200 免费额度/月 | 按使用量计费 |
| Places API | $200 免费额度/月 | 按请求次数计费 |
| Directions API | $200 免费额度/月 | 按请求次数计费 |

**建议**:
- 开发环境使用免费额度足够
- 生产环境设置每日配额限制
- 监控使用量避免意外费用

### Google Custom Search API

| API | 免费额度 | 超出费用 |
|-----|---------|---------|
| Custom Search API | 100 次查询/天 | 按查询次数计费 |

**建议**:
- 对于个人项目，免费额度通常足够
- 考虑使用缓存减少 API 调用

## 安全最佳实践

1. **永远不要**将 `.env.local` 提交到 Git 仓库
2. **永远不要**在前端暴露私密的 API Key
3. 为生产环境使用单独的 API Key
4. 在 Google Cloud Console 中设置 API 密钥限制：
   - 应用限制（HTTP referrer）
   - API 限制（仅启用需要的 API）
5. 设置每日配额限制以防止意外费用

## 故障排除

### 地图不显示

1. 检查浏览器控制台是否有错误
2. 验证 API Key 是否正确配置
3. 确认启用了必要的 API
4. 检查 API Key 的引用限制设置

### 搜索无结果

1. 验证 Custom Search API Key 是否正确
2. 检查搜索引擎 ID (CX) 是否正确
3. 确认搜索引擎已启用"搜索整个网络"

### 路线规划失败

1. 确认启用了 Directions API
2. 检查 API 配额是否用完
3. 验证起止点坐标是否有效

## 示例页面

访问 `/tools` 页面查看所有功能的演示和示例代码。

## 相关资源

- [Google Maps JavaScript API 文档](https://developers.google.com/maps/documentation/javascript)
- [Google Places API 文档](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Google Custom Search API 文档](https://developers.google.com/custom-search/v1/overview)
- [Google Cloud Console](https://console.cloud.google.com/)
