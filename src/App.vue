<template>
    <button class="relative transform cursor-default p-2 transition duration-200">
        <slot></slot>
    </button>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'ButtonIcon',
        props: {
            disabled: {
                type: Boolean,
                default: false,
            },
        },
    })
</script>
