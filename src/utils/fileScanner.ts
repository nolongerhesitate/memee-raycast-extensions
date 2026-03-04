import fs from 'fs/promises';
import path from 'path';

export async function scanMemeFolder(folderPath: string) {
  try {
    // 1. Check whether the path exists and is readable
    await fs.access(folderPath);

    // 2. Read all entries in the directory
    const entries = await fs.readdir(folderPath);
    console.log(entries);

    // 3. Filter out image files (simplified version without recursively scanning subdirectoriess)
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

    const memes = entries
      .filter(entry => imageExtensions.includes(path.extname(entry)));

    return memes;

  } catch (error) {
    console.error('Failed to scan folder:', error);
    throw new Error("Could not read the meme folder. Please check your permissions.");
  }

}