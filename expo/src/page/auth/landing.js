import Snow from 'expo-snowui'
import C from '../../common'
export default function LibraryListPage(props) {
    const { navPush } = Snow.useSnowContext()
    const { routes } = C.useAppContext()

    let readerDebug = <Snow.TextButton title='Debug' onPress={navPush({
        path: routes.bookRead,
        params: {
            bookId: 9332
        }
    })} />

    readerDebug = null

    return (
        <Snow.View {...props}>
            <Snow.Grid focusStart itemsPerRow={3}>
                {readerDebug}
                <Snow.TextButton title='Downloads' onPress={navPush({ path: routes.downloadList })} />
                <Snow.TextButton title='Library' onPress={navPush({ path: routes.libraryList })} />
                <Snow.TextButton title='Series' onPress={navPush({ path: routes.seriesList })} />
                <Snow.TextButton title='Author' onPress={navPush({ path: routes.authorList })} />
                <Snow.TextButton title='Title' onPress={navPush({ path: routes.titleList })} />
                <Snow.TextButton title='Search' onPress={navPush({ path: routes.search })} />
                <Snow.TextButton title='Options' onPress={navPush({ path: routes.options })} />
            </Snow.Grid>
        </Snow.View>
    )
}
