import type { IPersonConfig } from '@/types/storeType'
import { rgba } from '@/utils/color'

interface IUseElementStyle {
    element: any
    person: IPersonConfig
    index: number
    patternList: number[]
    patternColor: string
    cardColor: string
    cardSize: { width: number, height: number }
    scale: number
    textSize: number
    mod: 'default' | 'lucky' | 'sphere'
    type?: 'add' | 'change'

}
export function useElementStyle(props: IUseElementStyle) {
    const { element, person, index, patternList, patternColor, cardColor, cardSize, scale, textSize, mod, type } = props
    if (patternList.includes(index + 1) && mod === 'default') {
        element.style.backgroundColor = rgba(patternColor, Math.random() * 0.2 + 0.8)
    }
    else if (mod === 'sphere' || mod === 'default') {
        element.style.backgroundColor = rgba(cardColor, Math.random() * 0.5 + 0.25)
    }
    else if (mod === 'lucky') {
        element.style.backgroundColor = rgba(cardColor, 0.8)
    }
    element.style.border = `1px solid ${rgba(cardColor, 0.25)}`
    element.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.5)}`
    element.style.width = `${cardSize.width * scale}px`
    element.style.height = `${cardSize.height * scale}px`
    if (mod === 'lucky') {
        element.className = 'lucky-element-card'
    }
    else {
        element.className = 'element-card'
    }
    if (type === 'add') {
        element.addEventListener('mouseenter', (ev: MouseEvent) => {
            const target = ev.target as HTMLElement
            target.style.border = `1px solid ${rgba(cardColor, 0.75)}`
            target.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.75)}`
        })
        element.addEventListener('mouseleave', (ev: MouseEvent) => {
            const target = ev.target as HTMLElement
            target.style.border = `1px solid ${rgba(cardColor, 0.25)}`
            target.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.5)}`
        })
    }
    element.children[0].style.fontSize = `${textSize * scale * 0.5}px`
    if (person.uid) {
        element.children[0].textContent = person.uid
    }

    element.children[1].style.fontSize = `${textSize * scale}px`
    element.children[1].style.lineHeight = `${textSize * scale * 3}px`
    element.children[1].style.textShadow = `0 0 12px ${rgba(cardColor, 0.95)}`
    if (person.name) {
        element.children[1].textContent = person.name
    }

    element.children[2].style.fontSize = `${textSize * scale * 0.5}px`
    // 设置部门和身份的默认值
    element.children[2].innerHTML = ''
    if (person.department || person.identity) {
        element.children[2].innerHTML = `${person.department ? person.department : ''}<br/>${person.identity ? person.identity : ''}`
    }
    element.children[3].src = person.avatarUrl || person.avatar
    return element
}
interface CardRule {
    [key: number]: {
        maxLine: number
        scale: number
        rule: number[]
        length: number
    }
}
const cardRule: CardRule = {
    1: {
        maxLine: 5,
        scale: 2,
        rule: [1],
        length: 1,
    },
    2: {
        maxLine: 5,
        scale: 2,
        rule: [2],
        length: 1,
    },
    3: {
        maxLine: 5,
        scale: 2,
        rule: [3],
        length: 1,
    },
    4: {
        maxLine: 5,
        scale: 2,
        rule: [4],
        length: 1,
    },
    5: {
        maxLine: 5,
        scale: 2,
        rule: [5],
        length: 1,
    },
    6: {
        maxLine: 3,
        scale: 2,
        rule: [3, 3],
        length: 2,
    },
    7: {
        maxLine: 4,
        scale: 2,
        rule: [3, 4],
        length: 2,
    },
    8: {
        maxLine: 5,
        scale: 2,
        rule: [3, 5],
        length: 2,
    },
    9: {
        maxLine: 5,
        scale: 2,
        rule: [4, 5],
        length: 2,
    },
    10: {
        maxLine: 5,
        scale: 2,
        rule: [5, 5],
        length: 2,
    },
    11: {
        maxLine: 6,
        scale: 1.8,
        rule: [5, 6],
        length: 2,
    },
    12: {
        maxLine: 6,
        scale: 1.8,
        rule: [6, 6],
        length: 2,
    },
    13: {
        maxLine: 7,
        scale: 1.6,
        rule: [6, 7],
        length: 2,
    },
    14: {
        maxLine: 7,
        scale: 1.6,
        rule: [7, 7],
        length: 2,
    },
    15: {
        maxLine: 8,
        scale: 1.5,
        rule: [7, 8],
        length: 2,
    },
    16: {
        maxLine: 8,
        scale: 1.5,
        rule: [8, 8],
        length: 2,
    },
    17: {
        maxLine: 6,
        scale: 1.8,
        rule: [5, 6, 6],
        length: 3,
    },
    18: {
        maxLine: 6,
        scale: 1.8,
        rule: [6, 6, 6],
        length: 3,
    },
    19: {
        maxLine: 7,
        scale: 1.6,
        rule: [6, 6, 7],
        length: 3,
    },
    20: {
        maxLine: 5,
        scale: 1.6,
        rule: [6, 7, 7],
        length: 3,
    },
    21: {
        maxLine: 7,
        scale: 1.6,
        rule: [7, 7, 7],
        length: 3,
    },
    22: {
        maxLine: 8,
        scale: 1.5,
        rule: [7, 7, 8],
        length: 3,
    },
    23: {
        maxLine: 8,
        scale: 1.5,
        rule: [7, 8, 8],
        length: 3,
    },
    24: {
        maxLine: 8,
        scale: 1.5,
        rule: [8, 8, 8],
        length: 3,
    },
    25: {
        maxLine: 9,
        scale: 1.3,
        rule: [8, 8, 9],
        length: 3,
    },
    26: {
        maxLine: 9,
        scale: 1.3,
        rule: [8, 9, 9],
        length: 3,
    },
    27: {
        maxLine: 9,
        scale: 1.3,
        rule: [9, 9, 9],
        length: 3,
    },
    28: {
        maxLine: 10,
        scale: 1.2,
        rule: [9, 9, 10],
        length: 3,
    },
    29: {
        maxLine: 10,
        scale: 1.2,
        rule: [9, 10, 10],
        length: 3,
    },
    30: {
        maxLine: 10,
        scale: 1.2,
        rule: [10, 10, 10],
        length: 3,
    },
}
/**
 * @description 设置抽中卡片的位置
 */
export function useElementPosition(
    element: any,
    count: number,
    totalCount: number,
    cardSize: { width: number, height: number },
    windowSize: { width: number, height: number },
    cardIndex: number,
): {
    xTable: number
    yTable: number
    scale: number
} {
    let xTable = 0
    let yTable = 0
    const centerPosition = {
        x: 0,
        y: windowSize.height / 2,
    }
    const { scale, rule, length } = cardRule[totalCount]
    // 计算缩放后的卡片尺寸
    const scaledCardWidth = cardSize.width * scale
    const scaledCardHeight = cardSize.height * scale
    // 计算当前卡片在第几行（从0开始）
    let currentRow = 0
    let cardIndexInRow = cardIndex // 当前卡片在其所在行中的索引

    // 根据规则确定卡片在哪一行及行内索引
    let cumulativeCount = 0
    for (let i = 0; i < rule.length; i++) {
        if (cardIndex < cumulativeCount + rule[i]) {
            currentRow = i
            cardIndexInRow = cardIndex - cumulativeCount
            break
        }
        cumulativeCount += rule[i]
    }

    // 计算当前行的卡片数量
    const cardsInCurrentRow = rule[currentRow]

    // 计算每行的垂直中心位置
    const verticalSpacing = scaledCardHeight * 1.1 // 垂直间距基于缩放后的高度
    // 计算整体高度并调整居中
    const totalHeight = (length - 1) * verticalSpacing + scaledCardHeight // 包含卡片本身的高度
    const centerYOffset = -totalHeight / 2

    // 修改此处逻辑，确保当length=2时，两行围绕中心点对称分布
    centerPosition.y = windowSize.height / 2 - totalHeight / 2

    yTable = centerPosition.y + currentRow * verticalSpacing + centerYOffset + scaledCardHeight / 2 // 添加卡片高度的一半作为修正
    // 计算当前行的水平居中偏移
    const horizontalSpacing = scaledCardWidth * 1.2 // 水平间距基于缩放后的宽度
    const rowWidth = (cardsInCurrentRow - 1) * horizontalSpacing
    const offsetX = -rowWidth / 2 // 行内水平居中

    xTable = centerPosition.x + offsetX + cardIndexInRow * horizontalSpacing

    return { xTable, yTable, scale }
}
