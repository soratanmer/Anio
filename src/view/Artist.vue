<template>
    <!-- Artist info -->
    <div class="grid-layout-col my-10">
        <!-- Cover -->
        <div class="relative col-span-1 aspect-square self-start">
            <img v-if="!isFetching" class="rounded-lg" :src="cover" alt="cover" />
            <Skeleton v-else class="h-full w-full rounded-lg"></Skeleton>
        </div>

        <div class="cols-span flex flex-col justify-around">
            <!-- Name -->
            <div v-if="!isFetching" class="text-3xl font-bold text-black dark:text-white">
                {{ artist?.name }}
            </div>
            <Skeleton v-else class="w-3/4 text-3xl">PLACEHOLDER</Skeleton>

            <!-- Artist -->
            <div class="text-lg font-medium text-black dark:text-white"> Artist </div>
            <div v-if="!isFetching" class="text-sm font-thin text-black dark:text-white">
                {{ artist?.musicSize }} Tracks · {{ artist?.albumSize }} Albums · {{ artist?.mvSize }} Music Videos
            </div>
            <Skeleton v-else class="w-3/4 text-sm">PLACEHOLDER</Skeleton>

            <!-- Description -->
            <div v-if="!isFetching" class="line-clamp-1 break-all text-sm text-black dark:text-white">
                {{ artist?.briefDesc }}
            </div>
            <Skeleton v-else class="">PLACEHOLDER1234567890</Skeleton>

            <!-- Buttons -->
            <div class="flex gap-4">
                <ButtonIcon @click="play">
                    <SvgIcon class="h-5 w-5 text-black dark:text-white" name="play"></SvgIcon>
                </ButtonIcon>
                <ButtonIcon @click="subscribe">
                    <SvgIcon
                        class="h-5 w-5 text-black dark:text-white"
                        :name="isSub ? 'heart' : 'heart-outline'"
                    ></SvgIcon>
                </ButtonIcon>
            </div>
        </div>
    </div>

    <!-- Tabs -->
    <div class="mb-5 flex gap-3.5">
        <div
            v-for="tab in tabs"
            class="btn-hover-animation rounded-lg px-3.5 py-1.5 text-lg font-semibold text-black after:bg-green-400 dark:text-white"
            :class="{
                'bg-green-500': tab.id === activeTab,
            }"
            @click="updateTabs(tab)"
        >
            {{ tab.name }}
        </div>
    </div>

    <!-- Top tracks -->
    <TrackList
        v-if="activeTab === 'tracks'"
        :id="artistID"
        :tracks="topTracks"
        :is-loading="isFetching"
        layout="list"
        dbclick-track-func="playArtistByID"
    ></TrackList>

    <!-- Albums -->
    <CoverRow
        v-for="page in albums?.pages"
        v-if="activeTab === 'albums'"
        :albums="page.hotAlbums || []"
        type="album"
        :is-skeleton="isLoadingAlbums"
        subtitle="type+releaseYear"
    ></CoverRow>
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import useFetchArtistAlbums from '@/hooks/useFetchArtistAlbumsInfinite'
    import { fetchArtist, subScribeArtist, SubArtist } from '@/api/artist'
    import { resizeImage } from '@/utils/common'
    import { isLoggedIn } from '@/utils/user'

    const route = useRoute()
    const router = useRouter()
    const player = usePlayer()

    interface Tab {
        name: string
        id: string
    }

    const activeTab = ref<string>('tracks')

    const tabs: Tab[] = [
        {
            name: 'Top Tracks',
            id: 'tracks',
        },
        {
            name: 'Albums',
            id: 'albums',
        },
    ]

    const updateTabs = (tab: Tab) => {
        activeTab.value = tab.id
    }

    // Validate artist id
    const artistID = computed(() => {
        return Number(route.params.id)
    })
    if (!artistID.value || isNaN(Number(artistID.value))) {
        router.replace('/404')
    }

    // Fetch artist data
    const { data: ArtistRaw, isFetching } = fetchArtist({
        id: artistID.value,
    })

    const artist = computed(() => {
        return ArtistRaw?.value?.artist
    })

    const cover = computed(() => {
        if (!artist.value) {
            return ''
        }
        return resizeImage(artist.value.img1v1Url, 'sm')
    })

    const topTracks = computed(() => {
        return ArtistRaw.value?.hotSongs || []
    })

    const trackIDs = computed(() => {
        return ArtistRaw.value?.hotSongs.map((item) => item.id) || []
    })

    // Fetch artist's albums
    const {
        data: albums,
        isLoading: isLoadingAlbums,
        isFetching: isFetchingAlbums,
        hasNextPage: AlbumsHasNextPage,
        fetchNextPage: fetchAlbumsNextPage,
    } = useFetchArtistAlbums(
        reactive({
            id: artistID.value,
            limit: 60,
        }),
    )

    const mainContainerRef = ref<HTMLElement | null>(document.getElementById('mainContainer'))

    const mainContainerScroll = useScroll(mainContainerRef)

    watch(
        () => mainContainerScroll.arrivedState.bottom,
        (isScrolledToBottom) => {
            if (!isScrolledToBottom && isFetchingAlbums.value && !AlbumsHasNextPage?.value) {
                return
            }
            console.debug('scrolled to bottom, load more tracks!')
            fetchAlbumsNextPage.value()
        },
    )

    const play = () => {
        player!.mode = PlayerMode.PLAYLIST
        player?.replacePlaylist(trackIDs.value, {
            type: PlaylistSourceType.ARTIST,
            id: artistID.value,
        })
    }

    // Subscribe Artist

    const isSub = ref<boolean>(false)

    watch(isFetching, () => {
        isSub.value = Boolean(artist.value?.followed)
    })

    const subscribe = async () => {
        if (!isLoggedIn()) {
            return
        }

        await subScribeArtist({
            id: artistID.value,
            t: isSub.value ? SubArtist.DISLIKE : SubArtist.LIKE,
        })

        isSub.value = !isSub.value
    }
</script>
