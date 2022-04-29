import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

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
    return `${toHttps(url)}?param=${sizeMap[size]}y${sizeMap[size]}`
}

/**
 * @description 格式化日期
 * @param  {number} timestamp - 时间戳
 * @param  {'en'|'zh-TW'|'zh-CN'='en'} locale - 日期语言
 * @param  {string='default'} format - 格式化字符串，参考 dayjs
 */

export function formatDate(timestamp: number, locale: 'en' | 'zh-TW' | 'zh-CN' = 'en', format = 'default'): string {
    if (!timestamp) {
        return ''
    }
    if (format === 'default') {
        format = 'MMM D, YYYY'
        if (['zh-CN', 'zh-TW'].includes(locale)) {
            format = 'YYYY年MM月DD日'
        }
    }
    return dayjs(timestamp).format(format)
}

/**
 * @description 格式化时长
 * @param  {number} milliseconds - 毫秒数
 * @param  {'en'|'zh-TW'|'zh-CN'='en'} locale - 语言
 * @param  {'hh:mm:ss'|'hh[hr]mm[min]'='hh:mm:ss'} format - 格式化字符串
 */

export function formatDuration(
    milliseconds: number,
    locale: 'en' | 'zh-TW' | 'zh-CN' = 'en',
    format: 'hh:mm:ss' | 'hh[hr] mm[min]' = 'hh:mm:ss',
): string {
    if (!milliseconds) {
        return ''
    }

    dayjs.extend(duration)

    const time = dayjs.duration(milliseconds)
    const hours = time.hours().toString()
    const mins = time.minutes().toString()
    const seconds = time.seconds().toString().padStart(2, '0')

    if (format === 'hh:mm:ss') {
        return hours !== '0' ? `${hours}:${mins.padStart(2, '0')}:${seconds}` : `${mins}:${seconds}`
    } else if (format === 'hh[hr] mm[min]') {
        const units = {
            en: {
                hours: 'hr',
                mins: 'min',
            },
            'zh-CN': {
                hours: '小时',
                mins: '分钟',
            },
            'zh-TW': {
                hours: '小時',
                mins: '分鐘',
            },
        }
        return hours !== '0' ? `${hours} ${units[locale].hours} ${mins}` : `${mins} ${units[locale].mins}`
    }

    return String(milliseconds)
}

export function formatTrackTime(value: number) {
    if (!value) {
        return '00:00'
    }
    const min = ~~((value / 60) % 60)
    const sec = (~~(value % 60)).toString().padStart(2, '0')
    return `${min}:${sec}`
}

export function toHttps(url: string) {
    if (!url) {
        return ''
    }
    return url.replace(/^http:/, 'https:')
}
