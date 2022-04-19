import { useGet, usePost } from '@/hooks/useFetchNetEase'
import { UseFetchReturn } from '@vueuse/core'

export enum FMApiNames {
    FETCH_PERSONAL_FM = 'fetchPersonalFM',
    FM_TRASH = 'FMTrash',
}

export interface FetchPersonalFMResponse {
    popAdjust: boolean
    data: Track[]
    code: number
}

export function fetchPersonalFM(): UseFetchReturn<FetchPersonalFMResponse> {
    return useGet('/personal_fm', {
        timestamp: new Date().getTime(),
    })
}

export interface FMTrashParams {
    id: number
}

export interface FMTrashResponse {
    songs: Track[]
    count: number
    code: number
}

export function FMTrash(params: FMTrashParams): UseFetchReturn<FMTrashResponse> {
    return usePost('/fm_trash', {
        ...params,
        timestamp: new Date().getTime(),
    })
}
