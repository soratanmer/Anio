<template>
    <svg class="fill-current align-middle" aria-hidden="true">
        <use :href="symbolId" :fill="color"></use>
    </svg>
</template>

<script setup lang="ts">
    import { computed } from 'vue'

    const props = defineProps({
        prefix: {
            type: String,
            default: 'icon',
        },
        name: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: 'currentColor',
        },
    })

    const symbolId = computed(() => {
        return `#${props.prefix}-${props.name}`
    })
</script>
