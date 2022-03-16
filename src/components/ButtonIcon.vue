<template>
    <button class="button-icon"><slot></slot></button>
</template>

<style scoped>
    .button-icon {
        @apply flex content-center items-center p-2 bg-transparent m-1 rounded-sm duration-200
    }
</style>
