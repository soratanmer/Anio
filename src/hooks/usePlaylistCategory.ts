import { fetchPlaylistCategory, PlaylistApiNames } from '@/api/playlist'

export default function usePlaylistCategory() {
    console.debug('usePlaylistCategory')

    return useQuery(reactive([PlaylistApiNames.FETCH_PLAYLIST_CATEGORY]), () => {
        return fetchPlaylistCategory()
    })
}
