import fs from 'fs/promises';
import path from 'path';
import { Meme } from '../types';

// TODO: 1.Recursive Scan
// TODO: 3.Performance Pitfalls: The Cost ofMetadata 
export async function scanMemeFolder(folderPath: string) {
  try {
    // 1. Check whether the path exists and is readable
    await fs.access(folderPath);

    // 2. Read all entries in the directory
    // TODO: Async Iterables, for better performance, learning how to use **Async Iterables**
    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    // 3. Filter out image files (simplified version without recursively scanning subdirectoriess)
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

    const memes = entries
      .filter(entry => entry.isFile())
      .filter(entry => imageExtensions.includes(path.extname(entry.name).toLowerCase()))
      .map(entry => ({
        name: entry.name,
        fullPath: path.join(folderPath, entry.name),
        url: `file://${path.join(folderPath, entry.name)}`,
        extension: path.extname(entry.name),
      }) as Meme);

    return memes;
  } catch (error) {
    console.error('Failed to scan folder:', error);
    throw new Error("Could not read the meme folder. Please check your permissions.");
  }

}