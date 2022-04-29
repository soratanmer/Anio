<template>
    <button
        class="relative transform cursor-default rounded-lg p-2 transition duration-200"
        :class="{
            'btn-pressed-animation btn-hover-animation after:bg-green-400': !disabled,
        }"
        :disabled="disabled"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
    defineProps({
        disabled: {
            type: Boolean,
            default: false,
        },
    })
</script>
