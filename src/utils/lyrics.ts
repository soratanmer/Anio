import { FetchLyricResponse } from '@/api/track'

export function parseLyric(lrc: string) {
    const lyrics: string[] = lrc.split('\n')
    const lrcObj: {
        time: number
        rawTime: string
        content: string
    }[] = []
    for (let i = 0; i < lyrics.length; i++) {
        const lyric = lyrics[i]
        const timeReg = /\[\d*:\d*((\.|:)\d*)*\]/g
        const timeRegExpArr = lyric.match(timeReg)
        if (!timeRegExpArr) {
            continue
        }
        const content = lyric.replace(timeReg, '')
        for (let k = 0, h = timeRegExpArr.length; k < h; k++) {
            const t = timeRegExpArr[k]
            const min = Number(String(t.match(/\[\d*/i)).slice(1))
            const sec = Number(String(t.match(/:\d*/i)).slice(1))
            const ms = Number(String(t.match(/\d*\]/i))[0].slice(0, 2)) / 100
            const time = min * 60 + sec + ms
            if (content !== '') {
                lrcObj.push({ time: time, rawTime: timeRegExpArr[0], content })
            }
        }
    }
    return lrcObj
}

export function lyricParse(lrc: FetchLyricResponse) {
    return {
        lyric: parseLyric(lrc.lrc.lyric || ''),
        tlyric: parseLyric(lrc.tlyric.lyric || ''),
        lyricUser: lrc.lyricUser,
        transUser: lrc.transUser,
    }
}
