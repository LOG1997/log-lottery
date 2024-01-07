import { rgba } from '@/utils/color'

export const useElementStyle=(element:any,cardColor:string,cardSize:{width:number,height:number},textSize:number,mod:'default'|'lucky'='default')=>{
    element.style.backgroundColor = rgba(cardColor, Math.random() * 0.5 + 0.25)
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

export const useElementPosition=(element:any,count:number,cardSize:{width:number,height:number},containerSize:{width:number,height:number})=>{
    
}
