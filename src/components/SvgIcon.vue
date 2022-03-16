<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :href="symbolId"></use>
    </svg>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'

    export default defineComponent({
        props: {
            prefix: {
                type: String,
                default: 'icon',
            },
            name: {
                type: String,
                required: true,
            },
            className: {
                type: String,
                default: '',
            },
        },
        setup(props) {
            const symbolId = computed(() => {
                return `#${props.prefix}-${props.name}`
            })

            const svgClass = computed(() => {
                if (props.className) {
                    return `svg-icon ${props.className}`
                } else {
                    return 'svg-icon'
                }
            })

            return { symbolId, svgClass }
        },
    })
</script>

<style>
    .svg-icon {
        @apply fill-current w-4 h-4;
    }
</style>
