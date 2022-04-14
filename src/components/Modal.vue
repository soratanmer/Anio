<template>
    <div
        v-if="showModal"
        id="modal"
        ref="modal"
        class="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center z-[1000]"
        @click="handleModal(clickOutSideHide)"
    >
        <!-- modal -->
        <div class="bg-gray-900 rounded-lg text-sm flex flex-col max-h-[90vh]" :style="modalStyles">
            <!-- header -->
            <div v-if="!clickOutSideHide" class="flex justify-between items-center p-6">
                <!-- title -->
                <div class="font-semibold text-xl">{{ title }}</div>
                <ButtonIcon @click="handleModal()">
                    <SvgIcon class="h-4 w-4" name="x"></SvgIcon>
                </ButtonIcon>
            </div>
            <!-- content -->
            <div class="overflow-y-auto overflow-x-hidden px-6 pb-6">
                <slot name="content"></slot>
            </div>
            <!-- footer -->
            <div v-if="showFooter" class="p-4 flex justify-end">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        title: {
            type: String,
            default: 'Title',
        },
        clickOutSideHide: {
            type: Boolean,
            default: false,
        },
        showFooter: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: '50vw',
        },
    })

    const modalStyles = computed(() => {
        return {
            width: props.width,
        }
    })

    const showModal = ref(false)

    const handleModal = (hide: boolean = true) => {
        if (hide) {
            showModal.value = !showModal.value
        }
    }

    defineExpose({
        handleModal,
    })
</script>

<style lang="scss">
    ::-webkit-scrollbar {
        display: none;
    }
</style>
