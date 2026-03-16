import { useAppContext } from '../app-context'
import Snow from 'expo-snowui'

export default function BookList(props) {
    const { navPush, currentRoute } = Snow.useSnowContext()
    const { bookloreClient, routes } = useAppContext()
    return (
        <>
            <Snow.Label center>{props?.getHeader?.(currentRoute?.routeParams) ?? 'Books'} [{props.bookList?.length}]</Snow.Label>
            <Snow.Grid itemsPerRow={4} items={props.bookList} renderItem={(item) => {
                const thumbnail = bookloreClient.getBookThumbnail(item.id)
                let title = item?.metadata?.title
                if (item?.metadata?.seriesNumber) {
                    title = `#${item.metadata.seriesNumber} - ${title}`
                }
                return <Snow.ImageButton
                    title={title}
                    imageUrl={thumbnail}
                    onPress={navPush({
                        path: routes.bookDetails,
                        params: {
                            libraryId: item.libraryId,
                            libraryName: item.libraryName,
                            bookId: item.id,
                            bookName: item.metadata?.title,
                            bookKind: item.bookType
                        }
                    })} />
            }} /></>
    )
}