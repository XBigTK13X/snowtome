import React, { useState, useCallback } from 'react'
import Snow from '@snowsuite/expo-snowui'
import BookListPage from './template/book-list-page'

const SORT_OPTIONS = [
    { name: 'Release Date', value: 'releaseDate' },
    { name: 'Title', value: 'title' }
]

export default function SeriesDetailsPage(props) {
    const { currentRoute, navPush } = Snow.useSnowContext()

    const initialSort = currentRoute?.routeParams?.sortBy ?? 'releaseDate'
    const foundIndex = SORT_OPTIONS.findIndex((option) => option.value === initialSort)
    const initialIndex = foundIndex !== -1 ? foundIndex : 0

    const [sortIndex, setSortIndex] = useState(initialIndex)

    const currentSort = SORT_OPTIONS[sortIndex].value

    const loadData = useCallback((bookloreClient, routeParams) => {
        const activeSort = routeParams?.sortBy ?? currentSort
        return bookloreClient.getBookListBySeries(routeParams.seriesName, activeSort)
    }, [currentSort])

    return (
        <Snow.View {...props}>
            <BookListPage
                getHeader={(routeParams) => {
                    return `Series - ${routeParams?.seriesName}`
                }}
                renderHeaderControls={() => (
                    <Snow.Dropdown
                        title="Sort By"
                        focusKey="series-sort-dropdown"
                        valueIndex={sortIndex}
                        options={SORT_OPTIONS}
                        onValueChange={(chosenIndex) => {
                            const selectedOption = SORT_OPTIONS[chosenIndex]
                            navPush({
                                replace: true,
                                params: {
                                    ...currentRoute?.routeParams,
                                    sortBy: selectedOption.value
                                },
                                func: false
                            })
                            setSortIndex(chosenIndex)
                        }}
                    />
                )}
                loadData={loadData}
            />
        </Snow.View>
    )
}