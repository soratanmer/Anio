import { fetchPlaylistCategory, PlaylistApiNames } from '@/api/playlist'

export default function useFetchPlaylistCategory() {
    console.debug('usePlaylistCategory')

    return useQuery(
        reactive([PlaylistApiNames.FETCH_PLAYLIST_CATEGORY]),
        () => {
            return fetchPlaylistCategory()
        },
        reactive({
            refetchOnWindowFocus: false,
        }),
    )
}
