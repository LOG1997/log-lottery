import { rgba } from '@/utils/color'
import { IPersonConfig } from '@/types/storeType'

export const useElementStyle = (element: any, person: IPersonConfig, index: number, patternList: number[], patternColor: string, cardColor: string, cardSize: { width: number, height: number }, textSize: number, mod: 'default' | 'lucky'|'sphere' = 'default') => {
    if (patternList.includes(index+1)&&mod=='default') {
        element.style.backgroundColor = rgba(patternColor, Math.random() * 0.2 + 0.8)
    }
    else if(mod=='sphere'||mod=='default') {
        element.style.backgroundColor = rgba(cardColor, Math.random() * 0.5 + 0.25)
    }
    else if(mod=='lucky'){
        element.style.backgroundColor = rgba(cardColor, 0.8)
    }
    element.style.border = `1px solid ${rgba(cardColor, 0.25)}`
    element.style.boxShadow = `0 0 12px ${rgba(cardColor, 0.5)}`
    element.style.width = `${cardSize.width}px`;
    element.style.height = `${cardSize.height}px`;
    if (mod == 'lucky') {
        element.className = 'lucky-element-card'
    }
    else {
        element.className = 'element-card'
    }
    // 等比放大
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
    element.children[0].style.fontSize = textSize * 0.5 + 'px';
    if (person.uid) {
        element.children[0].textContent = person.uid;
    }

    element.children[1].style.fontSize = textSize + 'px'
    element.children[1].style.lineHeight = textSize * 3 + 'px'
    element.children[1].style.textShadow = `0 0 12px ${rgba(cardColor, 0.95)}`
    if (person.name) {
        element.children[1].textContent = person.name
    }

    element.children[2].style.fontSize = textSize * 0.5 + 'px'
    if (person.department || person.identity) {
        element.children[2].innerHTML = `${person.department ? person.department : ''}<br/>${person.identity ? person.identity : ''}`
    }

    return element
}

// export const useElementPosition=(element:any,count:number,cardSize:{width:number,height:number},windowSize:{width:number,height:number},cardIndex:number)=>{
//     const centerPosition={
//         x:0,
//         y:windowSize.height/2-cardSize.height/2
//     }
//   const index =cardIndex%5
//     if(index==0){
//         element.position.x=centerPosition.x
//         element.position.y=centerPosition.y-Math.floor(cardIndex/5)*(cardSize.height+60)
//     }
//     else{
//         element.position.x=index%2===0?Math.ceil(index/2)*(cardSize.width+100):-Math.ceil(index/2)*(cardSize.width+100)
//         element.position.y=centerPosition.y-Math.floor(cardIndex/5)*(cardSize.height+60)
//     }

//     return element
// }

export const useElementPosition = (element: any, count: number, cardSize: { width: number, height: number }, windowSize: { width: number, height: number }, cardIndex: number) => {
    let xTable = 0
    let yTable = 0
    const centerPosition = {
        x: 0,
        y: windowSize.height / 2 - cardSize.height / 2
    }
    const index = cardIndex % 5
    if (index == 0) {
        xTable = centerPosition.x
        yTable = centerPosition.y - Math.floor(cardIndex / 5) * (cardSize.height + 60)
    }
    else {
        xTable = index % 2 === 0 ? Math.ceil(index / 2) * (cardSize.width + 100) : -Math.ceil(index / 2) * (cardSize.width + 100)
        yTable = centerPosition.y - Math.floor(cardIndex / 5) * (cardSize.height + 60)
    }

    return { xTable, yTable }
}
