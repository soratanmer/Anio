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
        }
    },
    actions: {
        showToast(text) {
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
    },
})
