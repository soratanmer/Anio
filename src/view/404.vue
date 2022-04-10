<template>
    404
    <button @click="toggleReFetch()">refetch</button>
</template>

<script setup lang="ts">
    const refetch = ref(false)

    const toggleReFetch = useToggle(refetch)

    const { data } = useFetch('/api/user/account', {refetch}).get()
</script>
