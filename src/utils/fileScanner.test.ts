import { describe, it, expect, vi, beforeEach } from 'vitest'
import { scanMemeFolder } from './fileScanner'
import type { Meme } from '../types'
import fs from 'fs/promises'

// Mock fs/promises
vi.mock('fs/promises', () => ({
  default: {
    access: vi.fn(),
    readdir: vi.fn(),
  },
}))

const mockFs = vi.mocked(fs)

describe('scanMemeFolder', () => {
  const testFolderPath = '/test/memes'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should scan directory with valid image files', async () => {
    // Arrange
    const mockEntries = [
      { name: 'meme1.png', isFile: () => true },
      { name: 'meme2.jpg', isFile: () => true },
      { name: 'meme3.gif', isFile: () => true },
    ]

    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue(mockEntries as any)

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(mockFs.access).toHaveBeenCalledWith(testFolderPath)
    expect(mockFs.readdir).toHaveBeenCalledWith(testFolderPath, { withFileTypes: true })
    expect(result).toHaveLength(3)
    
    expect(result[0]).toEqual({
      name: 'meme1.png',
      path: '/test/memes/meme1.png',
      url: 'file:///test/memes/meme1.png',
      extension: '.png',
    } as Meme)
  })

  it('should filter out non-image files', async () => {
    // Arrange
    const mockEntries = [
      { name: 'meme1.png', isFile: () => true },
      { name: 'document.txt', isFile: () => true },
      { name: 'video.mp4', isFile: () => true },
      { name: 'meme2.jpg', isFile: () => true },
    ]

    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue(mockEntries as any)

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(result).toHaveLength(2)
    expect(result.map(m => m.name)).toEqual(['meme1.png', 'meme2.jpg'])
  })

  it('should handle uppercase file extensions', async () => {
    // Arrange
    const mockEntries = [
      { name: 'meme1.PNG', isFile: () => true },
      { name: 'meme2.JPG', isFile: () => true },
      { name: 'meme3.GIF', isFile: () => true },
    ]

    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue(mockEntries as any)

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(result).toHaveLength(3)
    expect(result.map(m => m.extension)).toEqual(['.PNG', '.JPG', '.GIF'])
  })

  it('should filter out directories', async () => {
    // Arrange
    const mockEntries = [
      { name: 'meme1.png', isFile: () => true },
      { name: 'subfolder', isFile: () => false },
      { name: 'meme2.jpg', isFile: () => true },
    ]

    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue(mockEntries as any)

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(result).toHaveLength(2)
    expect(result.map(m => m.name)).toEqual(['meme1.png', 'meme2.jpg'])
  })

  it('should return empty array for directory with no image files', async () => {
    // Arrange
    const mockEntries = [
      { name: 'document.txt', isFile: () => true },
      { name: 'video.mp4', isFile: () => true },
    ]

    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue(mockEntries as any)

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(result).toHaveLength(0)
  })

  it('should return empty array for empty directory', async () => {
    // Arrange
    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue([])

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(result).toHaveLength(0)
  })

  it('should handle all supported image formats', async () => {
    // Arrange
    const mockEntries = [
      { name: 'image.png', isFile: () => true },
      { name: 'image.jpg', isFile: () => true },
      { name: 'image.jpeg', isFile: () => true },
      { name: 'image.gif', isFile: () => true },
      { name: 'image.webp', isFile: () => true },
    ]

    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue(mockEntries as any)

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(result).toHaveLength(5)
    expect(result.map(m => m.extension)).toEqual(['.png', '.jpg', '.jpeg', '.gif', '.webp'])
  })

  it('should encode URLs properly', async () => {
    // Arrange
    const mockEntries = [
      { name: 'meme with spaces.png', isFile: () => true },
      { name: 'meme-with-special%chars.jpg', isFile: () => true },
    ]

    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue(mockEntries as any)

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(result[0].url).toBe('file:///test/memes/meme%20with%20spaces.png')
    expect(result[1].url).toBe('file:///test/memes/meme-with-special%25chars.jpg')
  })

  it('should throw error when folder does not exist', async () => {
    // Arrange
    mockFs.access.mockRejectedValue(new Error('ENOENT: no such file or directory'))

    // Act & Assert
    await expect(scanMemeFolder(testFolderPath)).rejects.toThrow(
      'Could not read the meme folder. Please check your permissions.'
    )
  })

  it('should throw error when folder cannot be accessed', async () => {
    // Arrange
    mockFs.access.mockRejectedValue(new Error('EACCES: permission denied'))

    // Act & Assert
    await expect(scanMemeFolder(testFolderPath)).rejects.toThrow(
      'Could not read the meme folder. Please check your permissions.'
    )
  })

  it('should throw error when readdir fails', async () => {
    // Arrange
    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockRejectedValue(new Error('Permission denied'))

    // Act & Assert
    await expect(scanMemeFolder(testFolderPath)).rejects.toThrow(
      'Could not read the meme folder. Please check your permissions.'
    )
  })

  it('should preserve original file order', async () => {
    // Arrange
    const mockEntries = [
      { name: 'zebra.png', isFile: () => true },
      { name: 'alpha.jpg', isFile: () => true },
      { name: 'beta.gif', isFile: () => true },
    ]

    mockFs.access.mockResolvedValue(undefined)
    mockFs.readdir.mockResolvedValue(mockEntries as any)

    // Act
    const result = await scanMemeFolder(testFolderPath)

    // Assert
    expect(result.map(m => m.name)).toEqual(['zebra.png', 'alpha.jpg', 'beta.gif'])
  })
})
