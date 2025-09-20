import dayjs from 'dayjs'
// 筛选人员数据
export function filterData(tableData: any[], localRowCount: number) {
  const dataLength = tableData.length
  let j = 0
  for (let i = 0; i < dataLength; i++) {
    if (i % localRowCount === 0) {
      j++
    }
    tableData[i].x = i % localRowCount + 1
    tableData[i].y = j
    tableData[i].id = i
    // 是否中奖
  }

  return tableData
}

export function addOtherInfo(personList: any[]) {
  const len = personList.length
  for (let i = 0; i < len; i++) {
    personList[i].id = i
    personList[i].createTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    personList[i].updateTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    personList[i].prizeName = [] as string[]
    personList[i].prizeTime = [] as string[]
    personList[i].prizeId = []
    personList[i].isWin = false
  }

  return personList
}

export function selectCard(cardIndexArr: number[], tableLength: number, personId: number): number {
  const cardIndex = Math.floor(Math.random() * (tableLength - 1))
  if (cardIndexArr.includes(cardIndex)) {
    return selectCard(cardIndexArr, tableLength, personId)
  }

  return cardIndex
}

export function themeChange(theme: string) {
  // 获取根html
  const html = document.querySelectorAll('html')
  if (html) {
    html[0].setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }
}
