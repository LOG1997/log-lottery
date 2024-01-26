import dayjs from 'dayjs';
// 筛选人员数据
export const filterData = (tableData: any[], localRowCount: number, startIndex = 0) => {
    const dataLength = tableData.length
    let j = 0;
    for (let i = 0; i < dataLength; i++) {
        if (i % localRowCount === 0) {
            j++;
        }
        tableData[i].x = i % localRowCount + 1;
        tableData[i].y = j;
        tableData[i].id = i;
        // 是否中奖
    }

    return tableData
}

export const addOtherInfo = (personList: any[]) => {
    const len = personList.length;
    for (let i = 0; i < len; i++) {
        personList[i].id = i
        personList[i].createTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
        personList[i].updateTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
        personList[i].prizeName = [] as string[];
        personList[i].prizeTime = [] as string[];
        personList[i].prizeId = [];
        personList[i].isWin = false
    }

    return personList
}

export const selectCard = (cardIndexArr: number[], tableLength: number, personId: number): number => {
    const cardIndex = Math.round(Math.random() * (tableLength - 1));
    if (cardIndexArr.includes(cardIndex)) {
        return selectCard(cardIndexArr, tableLength, personId)
    }

    return cardIndex
}
