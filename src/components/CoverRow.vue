<template>
    <!-- Header -->
    <div v-if="title" class="mt-6 flex items-baseline justify-between">
        <div class="text-2xl">
            {{ title }}
        </div>

        <div
            v-if="seeMoreLink"
            class="text-sm hover:underline"
            @click="
                router.push({
                    name: seeMoreLink,
                })
            "
            >查看全部</div
        >
    </div>

    <!-- Items -->
    <div class="grid-layout-col mt-6">
        <div v-for="item in renderItems">
            <!-- Cover -->
            <Cover
                v-if="!isSkeleton"
                :id="item.id"
                :type="type"
                :image-url="getImageUrl(item)"
                @click="goTo(item)"
            ></Cover>
            <Skeleton v-else class="aspect-square w-full rounded-lg"></Skeleton>

            <!-- Info -->
            <div class="mt-2">
                <div
                    class="font-semibold"
                    :class="{
                        'justify-center': !!artists,
                    }"
                    @click="goTo(item)"
                >
                    <!-- Name -->
                    <span
                        v-if="!isSkeleton"
                        class="line-clamp-2 leading-tight text-black hover:underline dark:text-white"
                    >
                        <!-- Playlist private icon -->
                        <SvgIcon
                            v-if="(item as Playlist).privacy"
                            name="lock"
                            class="mr-1 mb-1 inline-block h-3 w-3"
                        ></SvgIcon
                        >{{ item.name }}
                    </span>
                    <div v-else class="flex w-full flex-col">
                        <Skeleton class="w-full leading-tight"></Skeleton>
                        <Skeleton class="w-1/3 translate-y-px leading-tight">PLACEHOLDER</Skeleton>
                    </div>
                </div>

                <!-- Subtitle -->
                <div v-if="!isSkeleton" class="flex text-[12px]">
                    <span>{{ getSubtitleText(item, subtitle) }}</span>
                </div>
                <Skeleton v-else class="w-3/5 translate-y-[2px] text-[12px]">PLACEHOLDER</Skeleton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { formatDate, resizeImage } from '@/utils/common'
    import type { PropType } from 'vue'

    const router = useRouter()

    const props = defineProps({
        playlists: {
            type: Array as PropType<Playlist[]> | undefined,
            default: undefined,
        },
        albums: {
            type: Array as PropType<Album[]> | undefined,
            default: undefined,
        },
        artists: {
            type: Array as PropType<Artist[]> | undefined,
            default: undefined,
        },
        type: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: '',
        },
        subtitle: {
            type: String as PropType<'copyWriter' | 'creator' | 'type+releaseYear' | 'artist'>,
            default: 'copywriter',
        },
        seeMoreLink: {
            type: String,
            default: '',
        },
        isSkeleton: {
            type: Boolean,
            default: false,
        },
    })

    type Item = Playlist | Album | Artist

    const getImageUrl = (item: Item): string => {
        let cover: string | undefined = ''

        if ('coverImgUrl' in item) {
            cover = item.coverImgUrl
        }
        if ('picUrl' in item) {
            cover = item.picUrl
        }
        if ('img1v1Url' in item) {
            cover = item.img1v1Url
        }

        return resizeImage(cover || '', 'md')
    }

    const getSubtitleText = (item: Item, subtitle: string) => {
        const nickname = 'creator' in item && item.creator !== null ? item.creator.nickname : 'someone'
        const releaseYear = 'publishTime' in item ? formatDate(Number(item.publishTime), 'en', 'YYYY') : 'unknown'

        const types = {
            playlist: 'playlist',
            album: 'Album',
            专辑: 'Album',
            Single: 'Single',
            'EP/Single': 'EP',
            EP: 'EP',
            unknown: 'unknown',
        }
        const type = 'type' in item ? item.type || 'unknown' : 'unknown'
        const artist =
            'artists' in item
                ? item.artists
                      ?.map((artist) => artist.name)
                      .join(' / ')
                      .toString()
                : 'unknown'

        const table = {
            creator: `by ${nickname}`,
            'type+releaseYear': `${types[type]} · ${releaseYear}`,
            artist: artist,
        }

        return table[subtitle] ?? item[subtitle]
    }

    const goTo = (item: Item) => {
        const isAlbum = !!props.albums
        const isPlaylist = !!props.playlists

        router.push({
            name: isAlbum ? 'album' : isPlaylist ? 'playlist' : 'artist',
            params: {
                id: item.id,
            },
        })
    }

    const skeletonItems: Array<Item> = new Array(10).fill({})

    const renderItems = computed(() => {
        if (props.isSkeleton) {
            return skeletonItems
        }

        return props.albums ?? props.playlists ?? props.artists ?? []
    })
</script>
