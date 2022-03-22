<template>
    <div class="flex truncate">
        <span
            v-for="(artist, index) in artists"
            @click="
                router.push({
                    name: 'artist',
                    params: {
                        id: artist.id,
                    },
                })
            "
        >
            <span class="hover:underline">{{ artist.name }}</span>
            {{ index < artists.length - 1 ? ', ' : '' }}
        </span>
    </div>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue'

    const router = useRouter()

    const props = defineProps({
        artists: {
            type: Object as PropType<Artist[]>,
            required: true,
        },
    })
</script>
