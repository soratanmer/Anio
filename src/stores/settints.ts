import { defineStore } from 'pinia'
import { NewAlbumsArea } from '@/api/album'
import { ToplistOfArtists } from '@/api/artist'
import { TopSongsType } from '@/api/track'

export enum AreaType {
    ALL = 'ALL',
    ZH = 'ZH',
    JP = 'JP',
    EA = 'EA',
    KR = 'KR',
}

export const useSettingsStore = defineStore('settings', {
    state: () => {
        return {
            recentSongsLimit: 300,
            area: {
                album: NewAlbumsArea.JP,
                track: TopSongsType.JP,
                artist: ToplistOfArtists.JP as ToplistOfArtists | null,
            },
            areaType: AreaType.ALL,
        }
    },
    actions: {
        updateRecentSongsLimit(limit: 100 | 200 | 300) {
            this.recentSongsLimit = limit
        },
        updateArea(areaType: AreaType) {
            this.areaType = areaType
            if (areaType === AreaType.ALL) {
                this.area = {
                    album: NewAlbumsArea.ALL,
                    track: TopSongsType.ALL,
                    artist: null,
                }
            } else if (areaType === AreaType.ZH) {
                this.area = {
                    album: NewAlbumsArea.ZH,
                    track: TopSongsType.ZH,
                    artist: ToplistOfArtists.ZH,
                }
            } else if (areaType === AreaType.JP) {
                this.area = {
                    album: NewAlbumsArea.JP,
                    track: TopSongsType.JP,
                    artist: ToplistOfArtists.JP,
                }
            } else if (areaType === AreaType.EA) {
                this.area = {
                    album: NewAlbumsArea.EA,
                    track: TopSongsType.EA,
                    artist: ToplistOfArtists.EA,
                }
            } else if (areaType === AreaType.KR) {
                this.area = {
                    album: NewAlbumsArea.KR,
                    track: TopSongsType.KR,
                    artist: ToplistOfArtists.KR,
                }
            }
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'settings',
                storage: localStorage,
            },
        ],
    },
})
