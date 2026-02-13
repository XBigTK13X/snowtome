import Snow from 'expo-snowui'
import C from '../../common'
export default function LibraryListPage() {
    const { navPush } = Snow.useSnowContext()
    const { routes } = C.useAppContext()

    return (
        <>
            <Snow.Grid itemsPerRow={2}>
                <Snow.TextButton title='Library' onPress={navPush({ path: routes.libraryList })} />
                <Snow.TextButton title='Series' onPress={navPush({ path: routes.seriesList })} />
                <Snow.TextButton title='Author' onPress={navPush({ path: routes.authorList })} />
                <Snow.TextButton title='Title' onPress={navPush({ path: routes.titleList })} />
                <Snow.TextButton title='Search' onPress={navPush({ path: routes.search })} />
            </Snow.Grid>
        </>
    )
}
