<template>
    <button
        class="relative transform cursor-default p-2 rounded-lg transition duration-200"
        :class="{
            'btn-pressed-animation btn-hover-animation after:bg-green-400': !disabled,
            'opacity-30': disabled,
        }"
        :disabled="disabled"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
    const props = defineProps({
        disabled: {
            type: Boolean,
            default: false,
        },
    })
</script>
