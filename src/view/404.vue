<template>
    404
    <button @click="toggleReFetch()">refetch</button>
    <div class="bg-green-500 p-2 text-white" @click="openModal">
        modal
    </div>
    <Modal ref="modal" :click-out-side-hide="true">
        <template v-slot:content>
            <div>yoooooooo</div>
        </template>
    </Modal>
</template>

<script setup lang="ts">
    const refetch = ref(false)

    const toggleReFetch = useToggle(refetch)

    const { data } = useFetch('/api/user/account', {refetch}).get()

    const modal = ref()

    const openModal = ()=>{
        modal.value.handleModal()
    }
</script>
