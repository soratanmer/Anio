<template>
    <div class="mt-10">
        <!-- Artist info -->
        <div class="relative flex items-center">
            <img class="mr-12 ml-4 h-60 w-60 rounded-lg shadow-lg" :src="cover" alt="cover" />
            <div>
                <!-- Name -->
                <div class="text-6xl font-bold text-black dark:text-white">
                    {{ artist?.name }}
                </div>

                <!-- Artist -->
                <div class="mt-5 text-lg font-medium text-black dark:text-white"> Artist </div>
                <div class="text-sm font-thin text-black dark:text-white">
                    {{ artist?.musicSize }} Tracks · {{ artist?.albumSize }} Albums · {{ artist?.mvSize }} Music Videos
                </div>

                <!-- Description -->
                <div class="line-clamp-2 mt-5 min-h-[2.5rem] max-w-xl text-sm text-black dark:text-white">
                    {{ artist?.briefDesc }}
                </div>

                <!-- Buttons -->
                <div class="mt-5 flex gap-4">
                    <ButtonIcon @click="play">
                        <SvgIcon class="h-5 w-5 text-black dark:text-white" name="play"></SvgIcon>
                    </ButtonIcon>
                    <ButtonIcon>
                        <SvgIcon class="h-5 w-5 text-black dark:text-white" name="heart-outline"></SvgIcon>
                    </ButtonIcon>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="mt-8 mb-4 flex gap-3.5">
            <div
                v-for="tab in tabs"
                class="btn-hover-animation rounded-lg px-3.5 py-1.5 text-lg font-semibold text-black dark:text-white after:bg-green-400"
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
            :tracks="topTracks"
            :col="4"
            :is-loading="isFetching"
            layout="list"
            :id="artistID"
            dbclick-track-func="playArtistByID"
        ></TrackList>

        <!-- Albums -->
        <CoverRow
            v-if="activeTab === 'albums'"
            v-for="page in albums?.pages"
            :albums="page.hotAlbums || []"
            type="album"
            :is-skeleton="isLoadingAlbums"
            subtitle="type+releaseYear"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import usePlayer from '@/hooks/usePlayer'
    import { PlaylistSourceType, PlayerMode } from '@/hooks/usePlayer'
    import useFetchArtistAlbums from '@/hooks/useFetchArtistAlbumsInfinite'
    import { fetchArtist } from '@/api/artist'
    import { resizeImage } from '@/utils/common'

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
    const { data: ArtistRaw, isFetching } = fetchArtist(
        reactive({
            id: artistID.value,
        }),
    )
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
            type: PlaylistSourceType.PLAYLIST,
            id: artistID.value,
        })
    }
</script>
