<template>
    <div
        v-if="showMenu"
        id="menu"
        ref="menu"
        tabindex="-1"
        class="min-w-32 max-w-60 no-drag fixed list-none rounded-lg bg-gray-900 p-1.5 text-sm text-white"
        :style="{ top, left }"
        @blur="closeMenu()"
        @click="closeMenu()"
    >
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    const showMenu = ref<boolean>(false)
    const top = ref<string>('0')
    const left = ref<string>('0')

    const menu = ref<HTMLElement | null>(document.getElementById('menu'))

    const setMenu = (t: number, l: number) => {
        let largestHeight: number = window.innerHeight - Number(menu.value?.offsetHeight) - 25
        let largestWidth: number = window.innerWidth - Number(menu.value?.offsetWidth) - 25

        if (t > largestHeight) {
            t = largestHeight
        }
        if (l > largestWidth) {
            l = largestWidth
        }
        top.value = `${t}px`
        left.value = `${l}px`
    }

    const closeMenu = () => {
        showMenu.value = false
    }

    const openMenu = (e: MouseEvent) => {
        showMenu.value = true

        nextTick(() => {
            menu.value?.focus()
            setMenu(e.y, e.x)
        })
        e.preventDefault()
    }

    defineExpose({
        openMenu,
    })
</script>
