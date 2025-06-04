import { ipcMain } from 'electron';
import { execSync } from 'child_process';

function getSystemFonts(): string[] {
  try {
    const output = execSync('fc-list : family style').toString();
    const fonts = new Set<string>();
    
    output.split('\n').forEach((line: string) => {
      const family = line.split(':')[0].trim();
      if (family) {
        fonts.add(family);
      }
    });

    return Array.from(fonts).sort();
  } catch (error) {
    console.error('Error getting system fonts:', error);
    return [];
  }
}

export function setupFontService(): void {
  ipcMain.handle('get-system-fonts', async () => {
    return getSystemFonts();
  });
} 