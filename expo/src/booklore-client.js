import axios from 'axios'

// https://booklore.9914.us/api/v1/swagger-ui/index.html

export class BookloreClient {
    constructor(details) {
        this.onApiError = details.onApiError
        this.webApiUrl = details.webApiUrl
        if (this.webApiUrl.indexOf('http') === -1) {
            this.webApiUrl = 'https://' + this.webApiUrl
        }
        if (this.webApiUrl.indexOf('/api') === -1) {
            this.webApiUrl = this.webApiUrl + '/api/v1'
        }
        this.apiErrorSent = false

        this.accessToken = null
        this.refreshToken = null
        this.username = details?.username
        if (details?.accessToken) {
            this.accessToken = details.accessToken
            this.refreshToken = details.refreshToken
            this.httpClient = axios.create({
                baseURL: this.webApiUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + details.accessToken
                }
            })
        } else {
            this.httpClient = axios.create({
                baseURL: this.webApiUrl,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    }

    handleError = (err) => {
        console.log({ err })
        if (err) {
            if (err?.code === 'ERR_NETWORK' || err?.code === 'ERR_BAD_REQUEST') {
                if (!this.apiErrorSent) {
                    this.onApiError(err)
                }
                this.apiErrorSent = true
            }
        }
    }

    httpGet = async (url, params) => {
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

    httpPost = async (url, payload) => {
        return this.httpClient
            .post(url, payload)
            .then((response) => {
                return response.data
            })
            .catch((err) => {
                this.handleError(err)
            })
    }

    httpDelete = async (url) => {
        return this.httpClient
            .delete(url)
            .then((response) => {
                return response.data
            })
            .catch((err) => {
                this.handleError(err)
            })
    }

    login = (username, password) => {
        return new Promise((resolve) => {
            return this.httpPost('/auth/login', { username, password })
                .then((response) => {
                    this.accessToken = response.accessToken
                    this.refreshToken = response.refreshToken
                    this.httpClient = axios.create({
                        baseURL: this.webApiUrl,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.accessToken
                        }
                    })
                    return resolve(this)
                })
        })
    }

    imageSource = (webPath) => {
        const uri = `${this.webApiUrl}${webPath}`
        return {
            uri: uri,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.accessToken
            }
        }
    }

    getLibraryList = () => {
        return new Promise((resolve) => {
            return this.httpGet("/libraries")
                .then((response) => {
                    if (response) {
                        response.sort((a, b) => {
                            const nameA = a.name.toLowerCase();
                            const nameB = b.name.toLowerCase();

                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        });
                        return resolve(response)
                    }
                    return resolve(null)
                })
        })
    }

    getBookListByLibrary = (libraryId) => {
        return new Promise((resolve) => {
            return this.httpGet("/books")
                .then((response) => {
                    if (response) {
                        let result = response.filter((item) => {
                            return item.libraryId === libraryId
                        });
                        return resolve(result)
                    }
                    return resolve(null)
                })
        })
    }

    getBookDetails = (bookId) => {
        return new Promise((resolve) => {
            return this.httpGet(`/books/${bookId}`)
                .then((response) => {
                    resolve(response)
                })
        })
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

    getSeriesThumbnail = (seriesId) => {
        return this.imageSource(`/series/${seriesId}/thumbnail`)
    }

    getBookList = (seriesId) => {
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

    getBookThumbnail = (bookId) => {
        return `${this.webApiUrl}/media/book/${bookId}/thumbnail?token=${this.accessToken}`
    }

    getPageList = (bookId) => {
        return this.httpGet(`books/${bookId}/pages`)
    }

    getPage = (bookId, pageNumber) => {
        return this.imageSource(`/books/${bookId}/pages/${pageNumber}`)
    }

    downloadBook = (bookId) => {
        return this.httpGet(`/books/${bookId}/download`)
    }

    getBookContent = (bookId) => {
        const bookUrl = `/books/${bookId}/download`
        return this.httpClient.get(bookUrl, {
            responseType: 'arraybuffer',
        }).then((response) => {
            return response.data
        })
    }

    getBookContentUrl = (bookId) => {
        const bookUrl = `/books/${bookId}/download`
        return new Promise(resolve => {
            return resolve({
                downloadUrl: bookUrl,
                authToken: this.accessToken
            })
        })
    }

    updateBookProgress = (bookId, percent) => {
        let payload = {
            epubProgress: {
                percentage: percent
            }
        }
        return this.httpPost(`/books/${bookId}/progress`, payload)
    }

    debug = () => {
        console.log({ webApiUrl: this.webApiUrl, apiKey: this.apiKey })
    }
}

export default BookloreClient