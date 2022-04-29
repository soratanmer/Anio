<template>
    <div
        v-if="show"
        id="modal"
        ref="modal"
        class="absolute top-0 bottom-0 left-0 right-0 z-[1000] flex items-center justify-center"
        @click="clickOutside"
    >
        <!-- modal -->
        <div class="flex max-h-[90vh] flex-col rounded-lg bg-gray-900 text-sm" :style="modalStyles">
            <!-- header -->
            <div class="flex items-center justify-between p-6">
                <!-- title -->
                <div class="text-xl font-semibold">{{ title }}</div>
                <ButtonIcon @click="close()">
                    <SvgIcon class="h-4 w-4" name="x"></SvgIcon>
                </ButtonIcon>
            </div>
            <!-- content -->
            <div class="overflow-y-auto overflow-x-hidden px-6 pb-6">
                <slot name="content"></slot>
            </div>
            <!-- footer -->
            <div v-if="showFooter" class="flex justify-end p-4">
                <slot name="footer"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        show: {
            type: Boolean,
            default: false,
        },
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
        close: {
            type: Function,
            required: true,
        },
    })

    const modalStyles = computed(() => {
        return {
            width: props.width,
        }
    })

    const showModal = ref(false)

    const handleModal = () => {
        showModal.value = !showModal.value
    }

    const clickOutside = () => {
        if (props.clickOutSideHide) {
            props.close()
        }
    }

    defineExpose({
        handleModal,
    })
</script>

<style lang="scss" scoped>
    ::-webkit-scrollbar {
        display: none;
    }
</style>
