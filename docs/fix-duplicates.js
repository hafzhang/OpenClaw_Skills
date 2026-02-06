const fs = require('fs');

const candidates = JSON.parse(fs.readFileSync('docs/skill-candidates-phase3-100.json', 'utf8'));

const duplicates = ['gum', 'lazygit', 'traefik', 'vault', 'consul', 'nomad', 'packer', 'helm', 'prettier'];

// New skills to replace duplicates
const replacements = [
  {
    id: 'skill-218',
    name: 'glab',
    slug: 'glab',
    description: 'GitLab command-line tool for Git repositories and CI/CD',
    category: 'development',
    tags: ['GitLab', 'Git', 'CLI', 'CI/CD'],
    author: 'progl',
    source: 'https://github.com/progl',
    url: 'https://github.com/progl',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  },
  {
    id: 'skill-220',
    name: 'gitui',
    slug: 'gitui',
    description: 'Terminal UI for Git operations',
    category: 'development',
    tags: ['Git', 'TUI', 'Terminal', 'Rust'],
    author: 'extrawurst',
    source: 'https://github.com/extrawurst/gitui',
    url: 'https://github.com/extrawurst/gitui',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  },
  {
    id: 'skill-224',
    name: 'envoy',
    slug: 'envoy',
    description: 'Cloud-native edge and service proxy',
    category: 'devops',
    tags: ['Proxy', 'Service Mesh', 'Cloud', 'Networking'],
    author: 'envoyproxy',
    source: 'https://github.com/envoyproxy/envoy',
    url: 'https://github.com/envoyproxy/envoy',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  },
  {
    id: 'skill-225',
    name: 'cyberark',
    slug: 'cyberark',
    description: 'Enterprise password security and secrets management',
    category: 'devops',
    tags: ['Secrets', 'Security', 'Password', 'Enterprise'],
    author: 'cyberark',
    source: 'https://github.com/cyberark',
    url: 'https://github.com/cyberark',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  },
  {
    id: 'skill-226',
    name: 'etcd',
    slug: 'etcd',
    description: 'Distributed key-value store for configuration management',
    category: 'devops',
    tags: ['Key-Value', 'Distributed', 'Configuration', 'etcd'],
    author: 'etcd-io',
    source: 'https://github.com/etcd-io/etcd',
    url: 'https://github.com/etcd-io/etcd',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  },
  {
    id: 'skill-227',
    name: 'airflow',
    slug: 'airflow',
    description: 'Platform to programmatically author, schedule and monitor workflows',
    category: 'devops',
    tags: ['Workflows', 'Pipeline', 'Scheduler', 'Apache'],
    author: 'apache',
    source: 'https://github.com/apache/airflow',
    url: 'https://github.com/apache/airflow',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  },
  {
    id: 'skill-228',
    name: 'lima',
    slug: 'lima',
    description: 'Linux virtual machines on macOS for running containers',
    category: 'devops',
    tags: ['VM', 'macOS', 'Linux', 'Containers'],
    author: 'lima-vm',
    source: 'https://github.com/lima-vm/lima',
    url: 'https://github.com/lima-vm/lima',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  },
  {
    id: 'skill-249',
    name: 'act',
    slug: 'act',
    description: 'Run GitHub Actions locally using Docker',
    category: 'devops',
    tags: ['GitHub Actions', 'CI/CD', 'Docker', 'Local'],
    author: 'nektos',
    source: 'https://github.com/nektos/act',
    url: 'https://github.com/nektos/act',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  },
  {
    id: 'skill-267',
    name: 'dprint',
    slug: 'dprint',
    description: 'Fast, pluggable code formatter for JavaScript, TypeScript, and more',
    category: 'development',
    tags: ['Formatter', 'JavaScript', 'TypeScript', 'Rust'],
    author: 'dprint',
    source: 'https://github.com/dprint/dprint',
    url: 'https://github.com/dprint/dprint',
    verified: true,
    createdAt: '2026-02-06T00:00:00Z'
  }
];

// Remove duplicates and add replacements
const filtered = candidates.filter(c => !duplicates.includes(c.name.toLowerCase()));
const result = [...filtered, ...replacements].sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync('docs/skill-candidates-phase3-100.json', JSON.stringify(result, null, 2));
console.log('Updated candidates file with', result.length, 'skills');
console.log('Removed duplicates:', duplicates.join(', '));
console.log('Added replacements:', replacements.map(r => r.name).join(', '));
