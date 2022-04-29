<template>
    <transition name="fade">
        <div
            v-show="toast.show"
            class="z-100 fixed bottom-16 left-1/2 rounded-lg border bg-green-200 py-1.5 px-3 text-sm text-gray-500 backdrop-blur-md"
            >{{ toast.text }}</div
        >
    </transition>
</template>

<script setup lang="ts">
    import { useUiStore } from '@/stores/ui'

    const { toast } = useUiStore()
</script>

<style lang="scss">
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
</style>
