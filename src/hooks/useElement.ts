import { rgba } from '@/utils/color'

export const useElementStyle=(element:any,cardColor:string,cardSize:{width:number,height:number},textSize:number,mod:'default'|'lucky'='default')=>{
    element.style.backgroundColor = rgba(cardColor, mod=='default'?Math.random() * 0.5 + 0.25:0.8)
    element.style.border = `1px solid ${rgba(cardColor, 0.25)}`
    element.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.5)}`
    element.style.width = `${cardSize.width}px`;
    element.style.height = `${cardSize.height}px`;
    // 等比放大

    element.addEventListener('mouseenter', (ev:MouseEvent)=> {
        // 子元素无效
        // ev.stopPropagation()
        // ev.preventDefault()
        const target = ev.target as HTMLElement
        target.style.border = `1px solid ${rgba(cardColor, 0.75)}`
        target.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.75)}`
    })
    element.addEventListener('mouseleave', (ev:MouseEvent)=>{
        // ev.stopPropagation()
        // ev.preventDefault()
        const target=ev.target as HTMLElement
        target.style.border = `1px solid ${rgba(cardColor, 0.25)}`
        target.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.5)}`
    })
    element.children[0].style.fontSize = textSize*0.5+'px'
    
    element.children[1].style.fontSize = textSize+'px'
    element.children[1].style.textShadow = `0 0 12px ${rgba(cardColor, 0.95)}`
    
    element.children[2].style.fontSize = textSize*0.5+'px'

    return element
}

export const useElementPosition=(element:any,count:number,cardSize:{width:number,height:number},windowSize:{width:number,height:number},cardIndex:number)=>{
    const centerPosition={
        x:0,
        y:windowSize.height/2-cardSize.height/2
    }
  const index =cardIndex%5
    if(index==0){
        element.position.x=centerPosition.x
        element.position.y=centerPosition.y-Math.floor(cardIndex/5)*(cardSize.height+60)
    }
    else{
        element.position.x=index%2===0?Math.ceil(index/2)*(cardSize.width+100):-Math.ceil(index/2)*(cardSize.width+100)
        element.position.y=centerPosition.y-Math.floor(cardIndex/5)*(cardSize.height+60)
    }


    return element
}
