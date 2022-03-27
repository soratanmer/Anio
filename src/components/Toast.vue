<template>
    <transition name="fade">
        <div
            v-show="toast.show"
            class="fixed bottom-16 left-1/2 text-sm text-gray-500 bg-green-200 border rounded-lg backdrop-blur-md py-1.5 px-3 z-100"
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
