// 筛选人员数据
export const filterData = (tableData: any[],localRowCount: number,startIndex=0) => {
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
        tableData[i].isWin = false
    }
    
return tableData
}

export const addOtherInfo=(personList:any[])=>{
    const len=personList.length;
    for(let i=0;i<len;i++){
        personList[i].createTime=new Date().toString();
        personList[i].updateTime=new Date().toString();
        personList[i].prizeName='';
        personList[i].prizeTime='';
    }

    return personList
}
