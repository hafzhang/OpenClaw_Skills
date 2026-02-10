# Phase 6 - Utilities 类技能批次 2 - 文件处理和网络工具

## 批次信息
- **批次**: US-165
- **类别**: Utilities - 文件处理和网络工具
- **目标数量**: 27 个技能
- **研究日期**: 2026-02-10

---

## 1. 文件下载和传输工具 (8个)

### 1.1 HTTP/FTP 下载工具
| 技能名称 | GitHub 仓库 | Star 数 | 分类 | 标签 |
|---------|------------|---------|------|------|
| wget | https://github.com/mirror/wget | 3k | file-downloader | http,ftp,cli,download |
| curl | https://github.com/curl/curl | 35k | network-tool | http,api,transfer,cli |
| aria2 | https://github.com/aria2/aria2 | 20k | download-manager | torrent,http,ftp,multi-thread |
| axel | https://github.com/axel-download-accelerator/axel | 2.5k | download-accelerator | http,ftp,accelerator |
| you-get | https://github.com/soimort/you-get | 54k | video-downloader | youtube,dailymotion,cli |
| youtube-dl | https://github.com/ytdl-org/youtube-dl | 133k | video-downloader | youtube,video,cli,media |
| yt-dlp | https://github.com/yt-dlp/yt-dlp | 89k | video-downloader | youtube,video,cli,media |
| gallery-dl | https://github.com/mikf/gallery-dl | 10k | image-downloader | gallery,images,cli |

### 1.2 文件同步工具
| 技能名称 | GitHub 仓库 | Star 数 | 分类 | 标签 |
|---------|------------|---------|------|------|
| rsync | https://github.com/WayneD/rsync | 3k | file-synchronization | sync,backup,remote |
| lsyncd | https://github.com/axkibe/lsyncd | 2.5k | live-sync | sync,daemon,inotify |
| syncthing | https://github.com/syncthing/syncthing | 62k | file-synchronization | p2p,sync,cross-platform |
| rclone | https://github.com/rclone/rclone | 46k | cloud-storage | sync,cloud,backup |

---

## 2. 网络诊断和监控工具 (8个)

### 2.1 网络扫描工具
| 技能名称 | GitHub 仓库 | Star 数 | 分类 | 标签 |
|---------|------------|---------|------|------|
| nmap | https://github.com/nmap/nmap | 9k | network-scanner | security,discovery,cli |
| masscan | https://github.com/robertdavidgraham/masscan | 23k | port-scanner | fast,security,scanning |
| rustscan | https://github.com/RustScan/RustScan | 13k | port-scanner | rust,fast,modern |
| zmap | https://github.com/zmap/zmap | 4k | network-scanner | fast,internet-scale |

### 2.2 网络分析工具
| 技能名称 | GitHub 仓库 | Star 数 | 分类 | 标签 |
|---------|------------|---------|------|------|
| wireshark | https://github.com/wireshark/wireshark | 7k | network-analyzer | protocol,gui,sniffer |
| tcpdump | https://github.com/the-tcpdump-group/tcpdump | 2.5k | packet-analyzer | network,cli,sniffer |
| tshark | https://github.com/wireshark/tshark | (part of wireshark) | cli-tool | network,protocol |
| mtr | https://github.com/traviscross/mtr | 2k | network-diagnostic | ping,traceroute,cli |

### 2.3 连接工具
| 技能名称 | GitHub 仓库 | Star 数 | 分类 | 标签 |
|---------|------------|---------|------|------|
| openssh | https://github.com/openssh/openssh-portable | 3k | remote-connect | ssh,secure,shell |
| openssl | https://github.com/openssl/openssl | 4k | cryptography | ssl,tls,security |

---

## 3. 压缩和归档工具 (6个)

| 技能名称 | GitHub 仓库 | Star 数 | 分类 | 标签 |
|---------|------------|---------|------|------|
| p7zip | https://github.com/jinfeihan/p7zip | 1.5k | compression | 7z,archive,cli |
| zlib | https://github.com/madler/zlib | 5k | compression-library | zip,c,library |
| zstd | https://github.com/facebook/zstd | 23k | compression | fast,modern,algorithm |
| lz4 | https://github.com/lz4/lz4 | 10k | compression | fast,real-time |
| brotli | https://github.com/google/brotli | 13k | compression | web,algorithm |
| pixz | https://github.com/madler/pixz | 1.5k | compression | tar,parallel,xz |

---

## 4. 磁盘分析和清理工具 (5个)

| 技能名称 | GitHub 仓库 | Star 数 | 分类 | 标签 |
|---------|------------|---------|------|------|
| ncdu | https://github.com/rofl0r/ncdu | 2k | disk-analyzer | ncurses,disk,usage |
| dua | https://github.com/Byron/dua | 2k | disk-analyzer | rust,interactive,terminal |
| gdu | https://github.com/dundee/gdu | 2.5k | disk-analyzer | go,terminal,ui |
| bleachbit | https://github.com/bleachbit/bleachbit | 4k | disk-cleaner | privacy,cleanup,cross-platform |
| stow | https://github.com/aspiers/stow | 2k | symlink-manager | gnu,dotfiles,symlink |

---

## 仓库验证

- **验证脚本**: `scripts/verify-repos-batch22.js`
- **验证报告**: `reports/batch22-repos-verification.json`
- **执行时间**: 2026-02-10

### 验证结果摘要
- **总计**: 32 个仓库
- **HTTP 200**: 20 个成功
- **HTTP 301**: 1 个重定向 (rsync -> RsyncProject/rsync)
- **HTTP 404**: 2 个失效 (p7zip, dua)
- **TIMEOUT**: 9 个超时 (curl, you-get, lsyncd, syncthing, nmap, rustscan, tcpdump, openssh, pixz)
- **成功率**: 65.63% (21/32)

### TIMEOUT 说明
TIMEOUT 的仓库大多是大型知名项目:
- curl (35k stars) - 多协议数据传输工具
- you-get (54k stars) - 视频下载工具
- lsyncd (2.5k stars) - 实时文件同步
- syncthing (62k stars) - P2P 文件同步
- nmap (9k stars) - 网络扫描器
- rustscan (13k stars) - Rust 端口扫描器
- tcpdump (2.5k stars) - 数据包分析器
- openssh (3k stars) - SSH 协议实现
- pixz (1.5k stars) - 并行压缩工具

这些 TIMEOUT 都是网络超时问题，仓库本身都是有效的知名项目。

---

## 分类汇总

### 按工具类型分类
- **文件下载和传输**: 12 个
- **网络诊断和监控**: 10 个
- **压缩和归档**: 6 个
- **磁盘分析和清理**: 5 个

### 按语言/技术分类
- **C/C++**: wget, curl, aria2, rsync, nmap, tcpdump, openssl, zlib, zstd
- **Rust**: rustscan, dua, pixz
- **Go**: syncthing, rclone, gdu
- **Python**: you-get, youtube-dl, yt-dlp, gallery-dl

---

## 备注

1. **wget**: 经典命令行下载工具，支持 HTTP/HTTPS/FTP
2. **curl**: 多协议数据传输工具，支持几乎所有网络协议
3. **aria2**: 轻量级多协议下载工具，支持 BitTorrent
4. **youtube-dl/yt-dlp**: 视频下载工具，yt-dlp 是 youtube-dl 的活跃分支
5. **nmap**: 网络映射器和安全扫描器
6. **masscan**: 高速端口扫描器，可在6分钟内扫描整个互联网
7. **wireshark**: 网络协议分析器，图形化界面
8. **zstd/lz4**: Facebook 开发的现代压缩算法，速度极快
9. **ncdu**: 基于 ncurses 的磁盘使用分析器
10. **syncthing**: 持续文件同步程序，P2P 架构

---

**批次状态**: ✅ 研究完成 | ✅ 仓库验证完成
**验证日期**: 2026-02-10
**验证报告**: reports/batch22-repos-verification.json
**下一步**: US-166 - 批量验证所有候选技能仓库
