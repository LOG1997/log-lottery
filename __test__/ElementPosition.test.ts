import { describe, it, expect } from 'vitest'
import { useElementPosition } from '@/hooks/useElement'

describe('useElementPosition', () => {
  it('works for totalCount = 40 without throwing', () => {
    const element = {} as any
    const count = 10
    const totalCount = 40
    const cardSize = { width: 140, height: 200 }
    const windowSize = { width: 800, height: 600 }
    const cardIndex = 0

    const result = useElementPosition(element, count, totalCount, cardSize, windowSize, cardIndex)
    expect(result).toHaveProperty('xTable')
    expect(result).toHaveProperty('yTable')
    expect(result).toHaveProperty('scale')
    expect(typeof result.scale).toBe('number')
  })
})