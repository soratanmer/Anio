import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => {
        return {
            searchKeywords: '',
            toast: {
                show: false,
                text: '',
                timer: 0,
            },
            showLyrics: false,
            addTrackToPlaylistModal: {
                show: false,
                selectedTrackID: 0,
            },
            newPlaylistModal: {
                show: false,
                afterCreateAddTrackID: 0,
            },
        }
    },
    actions: {
        showToast(text: string) {
            if (this.toast.timer !== 0) {
                clearTimeout(this.toast.timer)
                this.toast = {
                    show: false,
                    text: '',
                    timer: 0,
                }
            }
            this.toast = {
                show: true,
                text,
                timer: setTimeout(() => {
                    this.toast = {
                        show: false,
                        text: '',
                        timer: 0,
                    }
                }, 3200),
            }
        },
        updateShowLyrics(showLyrics: boolean) {
            this.showLyrics = showLyrics
        },
        updateAddTrackToPlaylistModal(show = false, id = 0) {
            this.addTrackToPlaylistModal.show = show
            this.addTrackToPlaylistModal.selectedTrackID = id
        },
        updateNewPlaylistModal(show = false, id = 0) {
            this.newPlaylistModal.show = show
            this.newPlaylistModal.afterCreateAddTrackID = id
        },
        updateSearchKeywords(keywords: string) {
            this.searchKeywords = keywords
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'ui',
                storage: localStorage,
            },
        ],
    },
})
