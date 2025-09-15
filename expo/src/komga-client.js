import axios from 'axios'

export class KomgaClient {
    constructor(details) {
        this.onApiError = details.onApiError
        this.apiErrorSent = false

        this.httpGet = this.httpGet.bind(this)
        this.httpPost = this.httpPost.bind(this)
        this.httpDelete = this.httpDelete.bind(this)

        this.imageSource = this.imageSource.bind(this)
        this.getPage = this.getPage.bind(this)
        this.getSeriesThumbnail = this.getSeriesThumbnail.bind(this)

        const auth = `kids@kids.kids:kids`

        this.httpClient = axios.create({
            baseURL: this.webApiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(auth)}`
            }
        })
    }

    handleError(err) {
        console.log({ err })
        if (err) {
            if (err.code && err.code === 'ERR_NETWORK') {
                if (!this.apiErrorSent) {
                    this.onApiError(err)
                }
                this.apiErrorSent = true
            }
        }
    }

    async httpGet(url, params) {
        let queryParams = null
        if (params) {
            queryParams = { params: params }
        }
        return this.httpClient
            .get(url, queryParams)
            .then((response) => {
                return response.data
            })
            .catch((err) => {
                this.handleError(err)
            })
    }

    async httpPost(url, payload) {
        return this.httpClient
            .post(url, payload)
            .then((response) => {
                return response.data
            })
            .catch((err) => {
                this.handleError(err)
            })
    }

    async httpDelete(url) {
        return this.httpClient
            .delete(url)
            .then((response) => {
                return response.data
            })
            .catch((err) => {
                this.handleError(err)
            })
    }

    imageSource(webPath) {
        const uri = `${this.webApiUrl}${webPath}`
        return {
            uri: uri,
            method: 'GET',
            headers: {
                'X-API-Key': this.apiKey
            }
        }
    }

    getLibraryList() {
        return this.httpGet("/libraries")
    }

    getSeriesList(libraryId) {
        const payload = {
            "condition": {
                "allOf": [{
                    "libraryId": {
                        "operator": "is",
                        "value": libraryId
                    }
                }]
            }
        }
        return this.httpPost(`/series/list?page=0&size=500&sort=metadata.titleSort,asc`, payload)
    }

    getSeriesThumbnail(seriesId) {
        return this.imageSource(`/series/${seriesId}/thumbnail`)
    }

    getBookList(seriesId) {
        const payload = {
            "condition": {
                "allOf": [{
                    "seriesId": {
                        "operator": "is",
                        "value": seriesId
                    }
                }]
            }
        }
        return this.httpPost(`/books/list?page=0&size=500&sort=metadata.numberSort,asc`, payload)
    }

    getBookThumbnail(bookId) {
        return this.imageSource(`/books/${bookId}/thumbnail`)
    }

    getPageList(bookId) {
        return this.httpGet(`books/${bookId}/pages`)
    }

    getPage(bookId, pageNumber) {
        return this.imageSource(`/books/${bookId}/pages/${pageNumber}`)
    }

    debug() {
        console.log({ webApiUrl: this.webApiUrl, apiKey: this.apiKey })
    }
}

export default KomgaClient