import axios from 'axios'

import Snow from 'expo-snowui'

import cache from './cache'

// https://booklore.9914.us/api/v1/swagger-ui/index.html

const by_name = (a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

const by_input = (a, b) => {
    const nameA = a.toLowerCase()
    const nameB = b.toLowerCase()

    if (nameA < nameB) {
        return -1
    }
    if (nameA > nameB) {
        return 1
    }
    return 0
}

const by_title = (a, b) => {
    const nameA = a?.metadata?.title?.toLowerCase() ?? ""
    const nameB = b?.metadata?.title?.toLowerCase() ?? ""

    if (nameA < nameB) {
        return -1
    }
    if (nameA > nameB) {
        return 1
    }
    return 0
}

const by_series_then_title = (a, b) => {
    if (a.metadata?.seriesNumber !== b.metadata?.seriesNumber) {
        return a.metadata.seriesNumber - b.metadata.seriesNumber
    }

    return by_title(a, b)
}

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

    heartbeat = async () => {
        return new Promise(resolve => {
            return this.httpGet("/libraries")
                .then(() => {
                    return resolve(this.httpClient)
                })
                .catch(err => {
                    this.webApiUrl = Snow.loadData('bookloreUrl')
                    let username = Snow.loadData('username')
                    let password = Snow.loadData('password')
                    this.httpClient = axios.create({
                        baseURL: this.webApiUrl,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    this.login(username, password).then(result => {
                        return resolve(this.httpClient)
                    })
                })
        })
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

    readRemoteIfStale = (key, getter) => {
        return new Promise(resolve => {
            return this.heartbeat().then(() => {
                cache.readApiCache(key, () => {
                    return getter().then(result => {
                        if (result) {
                            return resolve(result)
                        }
                        return resolve(null)
                    })
                })
            })
        })
    }

    login = (username, password) => {
        return new Promise((resolve) => {
            return this.httpPost('/auth/login', { username, password })
                .then((response) => {
                    Snow.saveData('username', username)
                    Snow.saveData('password', password)
                    Snow.saveData('bookloreUrl', this.webApiUrl)
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
        return this.readRemoteIfStale('library-list', () => {
            return this.httpGet("/libraries")
                .then((response) => {
                    if (response) {
                        response.sort(by_name);
                        return response
                    }
                    return null
                })
        })
    }


    getBookListByLibrary = (libraryId) => {
        return this.readRemoteIfStale(`book-list-${libraryId}`, () => {
            return this.httpGet("/books")
                .then((response) => {
                    if (response) {
                        let result = response.filter((item) => {
                            return item.libraryId === libraryId
                        }).sort(by_title)
                        return result
                    }
                    return null
                })
        })
    }

    getSeriesList = (libraryId) => {
        return this.readRemoteIfStale(`series-list`, () => {
            return this.httpGet("/books")
                .then((response) => {
                    if (response) {
                        let dedupe = {}
                        for (let item of response) {
                            if (item?.metadata?.seriesName) {
                                dedupe[item?.metadata?.seriesName] = true
                            }
                        }
                        let result = Object.keys(dedupe)
                            .sort(by_input)
                        return result
                    }
                    return null
                })
        })
    }

    getBookListBySeries = (seriesName) => {
        return this.readRemoteIfStale(`series-name-${seriesName}`, () => {
            return this.httpGet("/books")
                .then((response) => {
                    if (response) {
                        let result = response.filter((item) => {
                            return item?.metadata?.seriesName === seriesName
                        }).sort(by_series_then_title)
                        return result
                    }
                    return null
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

    getBookThumbnail = (bookId) => {
        return `${this.webApiUrl}/media/book/${bookId}/thumbnail?token=${this.accessToken}`
    }

    search(query) {
        return this.readRemoteIfStale(`book-list`, () => {
            return this.httpGet("/books").then((response) => {
                return response
            })
        }).then(response => {
            let dedupe = {
                series: {},
                category: {}
            }
            let matches = [
                {
                    name: 'Book',
                    items: []
                },
                {
                    name: 'Series',
                    items: [],
                },
                {
                    name: 'Category',
                    items: []
                }
            ]
            if (response) {
                let needle = query.toLowerCase()
                for (let book of response) {
                    if (book?.metadata?.title?.toLowerCase().includes(needle)) {
                        matches[0].items.push(book)
                    }
                    if (book?.metadata?.seriesName?.toLowerCase().includes(needle)) {
                        if (!dedupe.series.hasOwnProperty(book?.metadata?.seriesName)) {
                            matches[1].items.push(book)
                            dedupe.series[book.metadata.seriesName] = true
                        }
                    }
                    if (book?.metadata?.categories) {
                        for (let category of book.metadata.categories) {
                            if (category.toLowerCase().includes(needle)) {
                                if (!dedupe.category.hasOwnProperty(category)) {
                                    matches[2].items.push(category)
                                    dedupe.category[category] = true
                                }
                            }
                        }
                    }
                }
            }
            if (matches[2].items.length == 0) {
                matches.splice(2, 1)
            }
            if (matches[1].items.length == 0) {
                matches.splice(1, 1)
            }
            if (matches[0].items.length == 0) {
                matches.splice(0, 1)
            }
            return matches
        })
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