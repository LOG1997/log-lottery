import { IPrizeConfig } from '@/types/prizeConfig';
export const defaultMusicList=[
    {
        id:'Geoff Knorr - China (The Industrial Era).ogg'+new Date().getTime().toString(),
        name:'Geoff Knorr - China (The Industrial Era).ogg',
        url:'https://24years.top/resource/audio/Geoff Knorr - China (The Industrial Era).ogg'
    },
    {
        id:'Geoff Knorr&Phill Boucher - China (The Atomic Era).ogg'+new Date().getTime().toString(),
        name:'Geoff Knorr&Phill Boucher - China (The Atomic Era).ogg',
        url:'https://24years.top/resource/audio/Geoff Knorr&Phill Boucher - China (The Atomic Era).ogg'
    },
    {
        id:'Radetzky March.mp3'+new Date().getTime().toString(),
        name:'Radetzky March.mp3',
        url:'https://24years.top/resource/audio/Radetzky March.mp3'
    },
    {
        id:'Shanghai.mp3'+new Date().getTime().toString(),
        name:'Shanghai.mp3',
        url:'https://24years.top/resource/audio/Shanghai.mp3'
    },
    {
        id:'Waltz No.2.mp3'+new Date().getTime().toString(),
        name:'Waltz No.2.mp3',
        url:'https://24years.top/resource/audio/Waltz No.2.mp3'
    },
    {
        id:'WildChinaTheme.mp3'+new Date().getTime().toString(),
        name:'WildChinaTheme.mp3',
        url:'https://24years.top/resource/audio/WildChinaTheme.mp3'
    },
    {
        id:'边程&房东的猫 - 美好事物-再遇少年.ogg'+new Date().getTime().toString(),
        name:'边程&房东的猫 - 美好事物-再遇少年.ogg',
        url:'https://24years.top/resource/audio/边程&房东的猫 - 美好事物-再遇少年.ogg'
    },
    {
        id:'大乔小乔 - 相见难别亦难.ogg'+new Date().getTime().toString(),
        name:'大乔小乔 - 相见难别亦难.ogg',
        url:'https://24years.top/resource/audio/大乔小乔 - 相见难别亦难.ogg'
    },
    {
        id:'你要跳舞吗-新裤子.mp3'+new Date().getTime().toString(),
        name:'你要跳舞吗-新裤子.mp3',
        url:'https://24years.top/resource/audio/你要跳舞吗-新裤子.mp3'
    },
    {
        id:'生命-声音玩具.mp3'+new Date().getTime().toString(),
        name:'生命-声音玩具.mp3',
        url:'https://24years.top/resource/audio/生命-声音玩具.mp3'
    },
    {
        id:'与非门 - Happy New Year.ogg'+new Date().getTime().toString(),
        name:'与非门 - Happy New Year.ogg',
        url:'https://24years.top/resource/audio/与非门 - Happy New Year.ogg'
    },

]

export const defaultPrizeList=<IPrizeConfig[]>[
    {
        id:'001',
        name:'一等奖',
        sort:1,
        isAll:true,
        count:1,
        picture:{
            id:'0',
            name:'一等奖',
            url:'https://24years.top/resource/image/image1.png'
        },
        desc:'一等奖',
        isShow:true,
        isUsed:false,
        frequency:1,
    },
    {
        id:'002',
        name:'二等奖',
        sort:2,
        isAll:true,
        count:1,
        picture: {
            id:'1',
            name:'二等奖',
            url:'https://24years.top/resource/image/image2.png'
        },
        desc:'二等奖',
        isShow:true,
        isUsed:false,
        frequency:1,
    },
    {
        id:'003',
        name:'三等奖',
        sort:3,
        isAll:true,
        count:1,
        picture: {
            id:'2',
            name:'三等奖',
            url:'https://24years.top/resource/image/image3.png'
        },
        desc:'三等奖',
        isShow:true,
        isUsed:false,
        frequency:1,
    },
    {
        id:'004',
        name:'超级大奖',
        sort:4,
        isAll:true,
        count:1,
        picture: {
            id:'3',
            name:'超级奖',
            url:'https://24years.top/resource/image/image4.png'
        },
        desc:'超级大奖',
        isShow:true,
        isUsed:false,
        frequency:1,
    },
    {
        id:'005',
        name:'特别奖',
        sort:5,
        isAll:true,
        count:1,
        picture:{
            id:'4',
            name:'特别奖',
            url:'https://24years.top/resource/image/image5.png'
        },
        desc:'特别奖',
        isShow:true,
        isUsed:false,
        frequency:1,
    }
]

export const defaultImageList=[
    {
        id:'0',
        name:'一等奖',
        url:'https://24years.top/resource/image/image1.png'
    },
    {
        id:'1',
        name:'二等奖',
        url:'https://24years.top/resource/image/image2.png'
    },
    {
        id:'2',
        name:'三等奖',
        url:'https://24years.top/resource/image/image3.png'
    },
    {
        id:'3',
        name:'超级奖',
        url:'https://24years.top/resource/image/image4.png'
    },
    {
        id:'4',
        name:'特别奖',
        url:'https://24years.top/resource/image/image5.png'
    }
]
