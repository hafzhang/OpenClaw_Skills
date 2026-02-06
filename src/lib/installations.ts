/**
 * Skill Installation Tracking
 * Phase 4: US-082 - Skill Installation Tracking
 */

import { InstalledSkill, InstallationExport } from '@/types';
import { storage } from './storage';
import { getAllSkills, getSkillBySlug } from './skills';

const INSTALLATIONS_KEY = 'installations';

// Get all installed skills
export function getInstalledSkills(): InstalledSkill[] {
  return storage.installations.get() || [];
}

// Check if a skill is installed
export function isInstalled(slug: string): boolean {
  const installed = getInstalledSkills();
  return installed.some(s => s.slug === slug);
}

// Mark a skill as installed
export function installSkill(slug: string, notes?: string): boolean {
  const skill = getSkillBySlug(slug);
  if (!skill) return false;

  const installed = getInstalledSkills();

  if (isInstalled(slug)) {
    // Update existing
    const index = installed.findIndex(s => s.slug === slug);
    if (index >= 0) {
      installed[index] = {
        ...installed[index],
        notes: notes || installed[index].notes,
      };
    }
  } else {
    // Add new
    installed.push({
      id: skill.id,
      slug: skill.slug,
      name: skill.name,
      command: skill.command,
      installedAt: new Date().toISOString(),
      notes,
    });
  }

  return storage.installations.set(installed);
}

// Remove a skill from installed list
export function uninstallSkill(slug: string): boolean {
  const installed = getInstalledSkills().filter(s => s.slug !== slug);
  return storage.installations.set(installed);
}

// Toggle installation status
export function toggleInstallation(slug: string, notes?: string): boolean {
  if (isInstalled(slug)) {
    return uninstallSkill(slug);
  }
  return installSkill(slug, notes);
}

// Get installation notes
export function getInstallationNotes(slug: string): string | undefined {
  const installed = getInstalledSkills();
  return installed.find(s => s.slug === slug)?.notes;
}

// Update installation notes
export function updateInstallationNotes(slug: string, notes: string): boolean {
  const installed = getInstalledSkills();
  const index = installed.findIndex(s => s.slug === slug);

  if (index >= 0) {
    installed[index].notes = notes;
    return storage.installations.set(installed);
  }

  return false;
}

// Export installed skills as shell script
export function exportAsShellScript(): string {
  const installed = getInstalledSkills();

  const commands = installed.map(s => {
    const note = s.notes ? ` # ${s.notes}` : '';
    return `${s.command}${note}`;
  });

  return `#!/bin/bash
# OpenClaw Skills Installation Script
# Generated: ${new Date().toISOString()}
# Total Skills: ${installed.length}

set -e

echo "Installing ${installed.length} OpenClaw skills..."

${commands.join('\n')}

echo "All skills installed successfully!"
`;
}

// Export installed skills as JSON
export function exportAsJSON(): string {
  const installed = getInstalledSkills();

  const exportData: InstallationExport = {
    skills: installed,
    exportDate: new Date().toISOString(),
    format: 'json',
  };

  return JSON.stringify(exportData, null, 2);
}

// Import installed skills from JSON
export function importFromJSON(jsonString: string): boolean {
  try {
    const data: InstallationExport = JSON.parse(jsonString);

    if (!data.skills || !Array.isArray(data.skills)) {
      return false;
    }

    storage.installations.set(data.skills);
    return true;
  } catch (error) {
    console.error('Error importing installations:', error);
    return false;
  }
}

// Get installation statistics
export function getInstallationStats() {
  const installed = getInstalledSkills();
  const allSkills = getAllSkills();

  return {
    totalInstalled: installed.length,
    totalAvailable: allSkills.length,
    percentComplete: Math.round((installed.length / allSkills.length) * 100),
    lastInstalled: installed.length > 0
      ? installed.sort((a, b) => new Date(b.installedAt).getTime() - new Date(a.installedAt).getTime())[0]?.installedAt
      : null,
  };
}

// Get recently installed skills
export function getRecentlyInstalled(limit = 5): InstalledSkill[] {
  const installed = getInstalledSkills();
  return installed
    .sort((a, b) => new Date(b.installedAt).getTime() - new Date(a.installedAt).getTime())
    .slice(0, limit);
}

// Clear all installations
export function clearAllInstallations(): boolean {
  return storage.installations.remove();
}
