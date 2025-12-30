import { describe, expect, it } from 'vitest'
import { getRandomElements } from '@/views/Home/utils/random'

describe('getRandomElements', () => {
    // 测试基本功能：从数组中获取指定数量的元素
    it('should return specified number of elements', () => {
        const sourceArray = [1, 2, 3, 4, 5]
        const result = getRandomElements(sourceArray, 3)

        expect(result).toHaveLength(3)
        result.forEach((element: any) => {
            expect(sourceArray).toContain(element)
        })
    })

    // 测试边界情况：count为0
    it('should return empty array when count is 0', () => {
        const sourceArray = [1, 2, 3]
        const result = getRandomElements(sourceArray, 0)

        expect(result).toEqual([])
    })

    // 测试边界情况：count为负数
    it('should return empty array when count is negative', () => {
        const sourceArray = [1, 2, 3]
        const result = getRandomElements(sourceArray, -1)

        expect(result).toEqual([])
    })

    // 测试边界情况：count大于等于数组长度
    it('should return shuffled array when count equals or exceeds array length', () => {
        const sourceArray = [1, 2, 3]
        const result1 = getRandomElements(sourceArray, 3)
        const result2 = getRandomElements(sourceArray, 5)

        expect(result1).toHaveLength(3)
        expect(result2).toHaveLength(3)

        // 验证返回的元素与原数组相同
        expect(result1.sort()).toEqual(sourceArray.sort())
        expect(result2.sort()).toEqual(sourceArray.sort())
    })

    // 测试空数组情况
    it('should return empty array when source array is empty', () => {
        const sourceArray: number[] = []
        const result = getRandomElements(sourceArray, 3)

        expect(result).toEqual([])
    })

    // 测试单元素数组
    it('should handle single element array', () => {
        const sourceArray = [42]
        const result = getRandomElements(sourceArray, 1)

        expect(result).toEqual([42])
    })

    // 测试字符串数组
    it('should work with string arrays', () => {
        const sourceArray = ['a', 'b', 'c', 'd', 'e']
        const result = getRandomElements(sourceArray, 2)

        expect(result).toHaveLength(2)
        result.forEach((element: any) => {
            expect(sourceArray).toContain(element)
        })
    })

    // 测试对象数组
    it('should work with object arrays', () => {
        const sourceArray = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
        ]
        const result = getRandomElements(sourceArray, 2)

        expect(result).toHaveLength(2)
        result.forEach((element: any) => {
            expect(sourceArray).toContain(element)
        })
    })

    // 测试多次调用应产生不同结果（概率性测试）
    it('should produce different results on multiple calls', () => {
        const sourceArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        const results = new Set()

        // 多次调用并收集结果
        for (let i = 0; i < 10; i++) {
            const result = getRandomElements(sourceArray, 5).sort().join(',')
            results.add(result)
        }

        // 虽然有极小概率会相同，但大多数情况下应该有不同的结果
        expect(results.size).toBeGreaterThan(1)
    })
    // 多次调用，每个元素抽中的概率基本上相等
    it('should have approximately equal probabilities for each element', () => {
        const sourceArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        const times = 200000 // 次数
        const count = 5 // 抽奖个数
        const expectedProbability = count / sourceArray.length
        const elementCounts = new Map()

        // 多次调用并统计元素出现的次数
        for (let i = 0; i < times; i++) {
            const result = getRandomElements(sourceArray, count)
            result.forEach((element: any) => {
                const count = elementCounts.get(element) || 0
                elementCounts.set(element, count + 1)
            })
        }
        elementCounts.forEach((value) => {
            // 验证每个元素出现的概率接近相等
            const probability = value / times
            expect(probability).toBeCloseTo(expectedProbability, 2)
        })
    })
})
