export interface IPersonConfig {
    id: number;
    uid: string;
    name: string;
    department:string;
    isWin:boolean;
    x:number;
    y:number
    createTime: string;
    updateTime: string;
    prizeName: string;
    prizeTime: string;
}
export interface IPrizeConfig {
    id: number|string;
    name:string;
    sort:number;
    isAll:boolean;
    count:number;
    isUsedCount:number,
    picture:{
        id:string|number,
        name:string,
        url:string
    };
    desc:string;
    isShow:boolean;
    isUsed:boolean,
    frequency:number;
}
export interface IMusic{
    id:string,
    name:string,
    url:string,
}

export interface IImage{
    id:string,
    name:string,
    url:string,
}
