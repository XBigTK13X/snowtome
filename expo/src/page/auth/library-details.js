import C from '../../common'
export default function LibraryDetailsPage() {
    const { navPush, currentRoute } = C.useSnowContext()
    const { routes, bookloreClient } = C.useAppContext()
    const [bookList, setBookList] = C.React.useState(null)

    C.React.useEffect(() => {
        bookloreClient.getBookListByLibrary(currentRoute?.routeParams?.libraryId).then((response) => {
            setBookList(response)
        })
    }, [])

    if (!bookList) {
        return <C.SnowText>Loading books in {currentRoute?.routeParams?.libraryName}...</C.SnowText>
    }

    console.log({ routes })

    return (
        <>
            <C.SnowLabel center>Books [{bookList?.length}]</C.SnowLabel>
            <C.SnowGrid itemsPerRow={4} items={bookList} renderItem={(item) => {
                const thumbnail = bookloreClient.getBookThumbnail(item.id)
                return <C.SnowImageButton
                    title={item?.metadata?.title}
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
            }} />
        </>
    )
}
