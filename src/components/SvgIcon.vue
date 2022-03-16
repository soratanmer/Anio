<template>
    <svg class="fill-current align-middle" aria-hidden="true">
        <use :href="symbolId" :fill="color"></use>
    </svg>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'

    export default defineComponent({
        name: 'SvgIcon',
        props: {
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
        },
        setup(props) {
            const symbolId = computed(() => {
                return `#${props.prefix}-${props.name}`
            })

            return { symbolId }
        },
    })
</script>
