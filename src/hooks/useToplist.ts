import { fetchToplist,PlaylistApiNames } from "@/api/playlist";

export default function useToplist(){
    console.debug('useToplist')

    return useQuery(
        reactive([PlaylistApiNames.FETCH_TOPLIST]),
        ()=>{
            return fetchToplist()
        }
    )
}
