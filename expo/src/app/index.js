import C from '../common'
import { config } from '../settings'
export default function LibraryListPage() {
    const { authed, routes, apiClient } = C.useAppContext()

    if (authed) {
        return <C.Redirect href={routes.libraryList} />
    }

    return <C.Redirect href={routes.login} />
}
