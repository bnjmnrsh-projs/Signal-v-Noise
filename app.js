;(function () {
    const app = document.querySelector('#app')
    const KEY = '.json?api-key=' + 'phTGaNCB3ipdmBV1gZ1OlGVX6rne7i8Z'
    const API = 'https://api.nytimes.com/svc/topstories/v2/'

    /**
     *
     *
     * @param {*} data
     */
    const buildArticles = function (oData) {
        const articleList = app.querySelector('#articles')

        // prettier-ignore
        articleList.innerHTML =
                oData.results
                    .map(function (article) {
                        let assembly = `<li>
                                    <article class='news-item ${article.section}'>
                                        <header>`
                        // Account for multimedia not coming in as expeced.
                        if (
                            'multimedia' in article &&
                            article.multimedia !== null &&
                            article.multimedia.length >= 3
                        ) {
                            assembly += `   <a href="${article.short_url}">
                                                <img alt src="${article.multimedia[3].url}"
                                                height="${article.multimedia[3].height}"
                                                width="${article.multimedia[3].width}"
                                                alt="${article.multimedia[3].caption}"/>
                                            </a>`
                        }
                        assembly += `</header>
                                        <section>
                                            <header>
                                                <h3><a href="${
                                                    article.short_url
                                                }">${article.title}</a></h3>
                                                  <p class="details screen-lg">
                                                    <a class="pill ${
                                                        article.section
                                                    }"
                                                        href="https://www.nytimes.com/section/${
                                                            article.section
                                                        }">
                                                        ${article.section.toUpperCase()}
                                                    </a>
                                                    ${
                                                        article.byline
                                                            ? '<span class="byline">'
                                                            : ''
                                                    }
                                                    ${article.byline}
                                                    ${
                                                        article.byline
                                                            ? '</span>'
                                                            : ''
                                                    }
                                                </p>
                                            </header>
                                            <div class="abstract">
                                                <p >${article.abstract}
                                                    <a href="${
                                                        article.short_url
                                                    }" class="read-more">[...more]</a>
                                                </p>
                                            </div>
                                        </section>
                                    </article>
                                </li>`

                        return assembly
                    })
                    .join('')
    }

    /*
        The sections listed, are not up to date. And there are many article.section coming from the
        API that do not resolve to a section via https://www.nytimes.com/section/{section}.
        There isn't an enpoint that I am aware of for getting official sections, so rolling own.

        https://developer.nytimes.com/docs/top-stories-product/1/overview
    */
    // prettier-ignore
    const aSections = [
    'arts', 'automobiles', 'books', 'business','style',
        'fashion', 'dining', 'food', 'health', 'insider', 'magazine',
        'movies', 'nyregion', 'obituaries', 'opinion', 'politics', 'realestate',
        'science', 'sports', 'technology', 'theater',
        't-magazine', 'travel', 'upshot', 'us', 'world',]

    /**
     * Build the nav pills using our section array.
     *
     * @param {array} [data=aSections]
     */
    const buildNav = function (data = aSections) {
        const navItems = app.querySelector('nav')
        navItems.innerHTML =
            '<ul>' +
            data
                .map(function (section) {
                    return `<li><a href="#${section}" class="pill ${section}" data-section="${section}">${section.toUpperCase()}</a></li>`
                })
                .join('') +
            '</ul>'
    }

    /**
     * Gets the articles, defauts to 'home' section
     *
     * @param {string} [section='home']
     */
    const getArticles = function (sSecton = 'home') {
        const articles = new Promise(function (resolve, reject) {
            fetch(API + sSecton + KEY)
                .then(function (resp) {
                    if (resp.ok) {
                        return resp.json()
                    } else {
                        return Promise.reject(resp)
                    }
                })
                .then(function (data) {
                    buildArticles(data)
                })
                .catch(function (err, data) {
                    console.error(err)
                    console.dir(err)
                    app.innerHTML = `
                    <div id="ohnos">
                        <h3>⥀.⥀ Oh Nooos!</h3>
                        <p>Bahh! Something went wrong....</p>
                        <div>
    <pre>${err.stack}</pre>
                        </div>
                    </div>`
                })
        })
    }

    /**
     * Listener callback for nav clicks
     *
     * @param {*} e
     */
    const navLink = function (e) {
        console.log(e.path[3])
        if (
            'path' in e &&
            e.path.length >= 3 &&
            e.path[3].classList.contains('noise')
        ) {
            console.dir(e.target.dataset.section)
            if ('section' in e.target.dataset) {
                getArticles(e.target.dataset.section)
            }
        }
    }
    addEventListener('click', navLink)

    getArticles()
    buildNav()
})()
