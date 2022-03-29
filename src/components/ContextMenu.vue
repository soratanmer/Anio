<template>
    <div id="contextMenu" ref="contextMenu" class="w-full h-full select-none">
        <div
            v-if="showMenu"
            ref="menu"
            id="menu"
            class="fixed min-w-32 max-w-60 list-none bg-gray-100 backdrop-blur-12 rounded-lg p-1.5 z-1000 no-drag"
            tabindex="-1"
            @blur="closeMenu()"
            @click="closeMenu()"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    const showMenu = ref<boolean>(false)
    const top = ref<string>('0')
    const left = ref<string>('0')

    const menuRef = ref<HTMLElement | null>(document.getElementById('menu'))

    const setMenu = (t, l) => {
        let largestHeight: number = window.innerHeight - menuRef.value?.offsetHeight - 25
        let largestWidth: number = window.innerWidth - menuRef.value?.offsetWidth - 25

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

    const openMenu = (e) => {
        showMenu.value = true

        nextTick(() => {

            menuRef.value?.focus()
            setMenu(e.y, e.x)
        })
        e.preventDefault()
    }

    defineExpose({
        openMenu,
    })
</script>
