// 判断颜色是否rgb或者rgba
export function isRgbOrRgba(color: string) {
  return color.indexOf('rgb') > -1 || color.indexOf('rgba') > -1;
}

// 判断是否hex形式
export function isHex(color: string) {
  return color.indexOf('#') > -1;
}

// 把hex颜色转成rgb数值类型
export function hexToRgba(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
return {r,g,b}
}
// 把rgb数组转化成r g b 数值
export function rgbToRgba(rgb: string) {
    const rgbArr = rgb.split('(')[1].split(')')[0].split(',');
    
return {r:rgbArr[0],g:rgbArr[1],b:rgbArr[2]}
}

// 组成rgb颜色添加透明度
export function rgba(color: string, opacity: number) {
     opacity = opacity || 1;
    let rgbaStr=''
    // 判断是否是hex颜色
    if (isHex(color)) {
       const {r,g,b} = hexToRgba(color);
       rgbaStr = `rgba(${r},${g},${b},${opacity})`
    }
    else{
      const {r,g,b} = rgbToRgba(color)
      rgbaStr = `rgba(${r},${g},${b},${opacity})`
    }
  
return rgbaStr
}
