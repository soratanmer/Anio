<template>
    <div
        class="btn-pressed-animation flex cursor-default items-center rounded-lg text-lg font-semibold text-black dark:text-white"
        :class="{
            'px-4 py-1.5': shape === 'default',
            'px-3 py-1.5': shape === 'square',
            'px-3 py-3': shape === 'button',
            'animate-pulse bg-green-400 text-transparent': isSkeleton,
        }"
    >
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue'

    const props = defineProps({
        shape: {
            type: String as PropType<'square' | 'default' | 'button'>,
            required: false,
            default: 'default',
        },
        color: {
            type: String as PropType<'primary' | 'gray'>,
            required: false,
            default: 'primary',
        },
        iconColor: {
            type: String as PropType<'primary' | 'gray'>,
            required: false,
            default: 'primary',
        },
        isSkeleton: {
            type: Boolean,
            required: false,
            default: false,
        },
    })
</script>
