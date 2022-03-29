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
                    <Button :is-skeleton="isLoading">
                        <SvgIcon class="mr-2 h-4 w-4" name="play"></SvgIcon>
                    </Button>
                    <Button :is-skeleton="isLoading" color="gray" iconColor="gray">Follow</Button>
                </div>
            </div>
        </div>

        <!-- Top tracks -->
        <div class="mt-10 mb-4 text-xl font-semibold text-black dark:text-white">Top Tracks</div>
        <TrackList :tracks="topTracks.slice(0, 12)" :col="4" :is-loading="isLoading"></TrackList>

        <!-- Albums -->
        <div class="mt-10 mb-4 text-xl font-semibold text-black dark:text-white">Albums</div>
        <CoverRow
            :albums="albums?.hotAlbums || []"
            :is-skeleton="isLoadingAlbums"
            subtitle="type+releaseYear"
        ></CoverRow>
    </div>
</template>

<script setup lang="ts">
    import useArtist from '@/hooks/useArtist'
    import useArtistAlbums from '@/hooks/useArtistAlbums'
    import { resizeImage } from '@/utils/common'

    const route = useRoute()
    const router = useRouter()

    // Validate artist id
    const artistID = computed(() => {
        return route.params.id as string
    })
    if (!artistID.value || isNaN(Number(artistID.value))) {
        router.replace('/404')
    }

    // Fetch artist data
    const { data: ArtistRaw, isLoading } = useArtist(
        reactive({
            id: artistID,
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

    // Fetch artist's albums
    const { data: albums, isLoading: isLoadingAlbums } = useArtistAlbums(
        reactive({
            id: artistID,
        }),
    )

    const artistMenu = ref()

    const openMenu = (e) => {
        artistMenu.value.openMenu(e)
    }

    const dropdown1 = ref()
    const handleVisible2 = (visible) => {
        if (visible) {
            dropdown1.value.handlwClose()
        } else {
            dropdown1.value.handlwOpen()
        }
    }

    const showClick = () => {
        dropdown1.value.handleOpen()
    }
</script>
