import request from '@/utils/request'

export enum FMApiNames {
    FETCH_PERSONAL_FM = 'fetchPersonalFM',
    FM_TRASH = 'FMTrash',
}

interface FetchPersonalFMResponse {
    popAdjust: boolean
    data: Track[]
    code: number
}

export function fetchPersonalFM(): Promise<FetchPersonalFMResponse> {
    return request({
        url: '/personal_fm',
        method: 'get',
        params: {
            timestamp: new Date().getTime(),
        },
    })
}

export interface FMTrashParams {
    id: number
}

interface FMTrashResponse {
    songs: Track[]
    count: number
    code: number
}

export function FMTrash(params: FMTrashParams): Promise<FMTrashResponse> {
    return request({
        url: '/fm_trash',
        method: 'post',
        params: {
            ...params,
            timestamp: new Date().getTime(),
        },
    })
}
