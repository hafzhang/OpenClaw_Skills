'use client';

import * as React from 'react';
import { Bookmark, BookmarkFolder } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  getAllBookmarks,
  getAllFolders,
  createFolder,
  deleteFolder,
  exportBookmarks,
  importBookmarks,
  clearAllBookmarks,
  searchBookmarks,
} from '@/lib/bookmarks';
import { cn } from '@/lib/utils';

interface BookmarkManagerProps {
  className?: string;
}

const TYPE_LABELS: Record<Bookmark['type'], string> = {
  tutorial: '教程',
  skill: '技能',
  config: '配置',
};

export function BookmarkManager({ className }: BookmarkManagerProps) {
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([]);
  const [folders, setFolders] = React.useState<BookmarkFolder[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<Bookmark['type'] | 'all'>('all');
  const [newFolderName, setNewFolderName] = React.useState('');
  const [showImportExport, setShowImportExport] = React.useState(false);
  const [exportData, setExportData] = React.useState('');
  const [importData, setImportData] = React.useState('');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    refreshData();
  }, []);

  const refreshData = () => {
    setBookmarks(getAllBookmarks());
    setFolders(getAllFolders());
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      refreshData();
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (confirm('确定要删除这个文件夹吗？其中的收藏不会被删除。')) {
      deleteFolder(folderId);
      refreshData();
    }
  };

  const handleExport = () => {
    const data = exportBookmarks();
    setExportData(data);
    setShowImportExport(true);
  };

  const handleImport = () => {
    if (importData.trim()) {
      if (importBookmarks(importData.trim())) {
        alert('导入成功！');
        setImportData('');
        refreshData();
      } else {
        alert('导入失败，请检查数据格式。');
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('确定要清除所有收藏吗？此操作无法撤销。')) {
      clearAllBookmarks();
      refreshData();
    }
  };

  const handleDownloadExport = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openclaw-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredBookmarks = React.useMemo(() => {
    let filtered = bookmarks;

    if (searchQuery) {
      filtered = searchBookmarks(searchQuery);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(b => b.type === selectedType);
    }

    return filtered;
  }, [bookmarks, searchQuery, selectedType]);

  if (!mounted) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{bookmarks.length}</p>
          <p className="text-sm text-muted-foreground">总收藏</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{folders.length}</p>
          <p className="text-sm text-muted-foreground">文件夹</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">
            {new Set(bookmarks.map(b => b.category).filter(Boolean)).size}
          </p>
          <p className="text-sm text-muted-foreground">分类</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="搜索收藏..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {(['all', 'tutorial', 'skill', 'config'] as const).map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? '全部' : TYPE_LABELS[type]}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleExport}>
          📤 导出
        </Button>
        <Button variant="outline" onClick={() => setShowImportExport(!showImportExport)}>
          📥 导入
        </Button>
        <Button variant="destructive" onClick={handleClearAll}>
          🗑️ 清除全部
        </Button>
      </div>

      {/* Import/Export Panel */}
      {showImportExport && (
        <Card className="p-4 space-y-4">
          {exportData && (
            <div>
              <label className="text-sm font-medium mb-2 block">导出数据</label>
              <textarea
                value={exportData}
                readOnly
                className="w-full h-32 p-2 text-sm font-mono border rounded bg-muted"
              />
              <Button onClick={handleDownloadExport} className="mt-2">
                下载 JSON 文件
              </Button>
            </div>
          )}
          <div>
            <label className="text-sm font-medium mb-2 block">导入数据</label>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="粘贴之前导出的 JSON 数据..."
              className="w-full h-32 p-2 text-sm font-mono border rounded"
            />
            <Button onClick={handleImport} disabled={!importData.trim()} className="mt-2">
              导入
            </Button>
          </div>
        </Card>
      )}

      {/* Folders */}
      <div>
        <h3 className="font-medium mb-3">文件夹</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {folders.map((folder) => (
            <Badge key={folder.id} variant="secondary" className="gap-2">
              📁 {folder.name}
              <button
                onClick={() => handleDeleteFolder(folder.id)}
                className="hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
          {folders.length === 0 && (
            <p className="text-sm text-muted-foreground">暂无文件夹</p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="新建文件夹名称"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
          />
          <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
            创建
          </Button>
        </div>
      </div>

      {/* Bookmarks List */}
      <div>
        <h3 className="font-medium mb-3">
          收藏列表 ({filteredBookmarks.length})
        </h3>
        {filteredBookmarks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            没有找到匹配的收藏
          </p>
        ) : (
          <div className="space-y-2">
            {filteredBookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{bookmark.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {TYPE_LABELS[bookmark.type]}
                      </Badge>
                      {bookmark.category && (
                        <Badge variant="secondary" className="text-xs">
                          {bookmark.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
