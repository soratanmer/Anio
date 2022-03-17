/**
 * @description 调整网易云封面图片大小
 * @param  {string} url 封面图片URL
 * @param  {'xs'|'sm'|'md'|'lg'} size - 大小，值对应为 128px | 256px | 512px | 1024px
 */

export function resizeImage(url: string, size: 'xs' | 'sm' | 'md' | 'lg'): string {
    const sizeMap = {
        xs: '128',
        sm: '256',
        md: '512',
        lg: '1024',
    }
    if (!Object.keys(sizeMap).includes(size)) {
        console.error(`Invalid cover size: ${size}`)
    }
    return `${url}?param=${sizeMap[size]}y${sizeMap[size]}`
}
