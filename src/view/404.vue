<template>
    404
    <button @click="toggleReFetch()">refetch</button>
    <div class="bg-green-500 p-2 text-white" @click="openModal"> modal </div>
</template>

<script setup lang="ts">
    const refetch = ref(false)

    const toggleReFetch = useToggle(refetch)

    const { data } = useFetch('/api/user/account', { refetch }).get()

    const modal = ref()

    const openModal = () => {
        modal.value.handleModal()
    }
</script>
