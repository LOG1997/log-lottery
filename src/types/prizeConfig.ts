export interface IPrizeConfig {
    id: number|string;
    name:string;
    sort:number;
    isAll:boolean;
    count:number;
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
