
const queryInputElem = document.getElementById('query');
const resultsContainerElem = document.getElementById("results");
const selctElem = document.getElementById("selct");

const form = document.getElementById('vestigial');
queryInputElem.addEventListener("keydown", whenSomeKeyPressed);

async function whenSomeKeyPressed(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        const news = await searchForNews(queryInputElem.value);
        newsElements = await createNewsElements(news.results);
        clearResultsElem();
        populateResultsElem(newsElements);
    }
}

function searchForNews(query) {
    const newsResults = fetch(
        `https://newsdata.io/api/1/news?apikey=pub_14349f52f64451f046a829672ecd657ed8abb&q=${encodeURIComponent(query)}`
    ).then(function (responseFromEndpoint) {
        return responseFromEndpoint.json();
    })
    console.log(newsResults);
    return newsResults;
}

async function createNewsElements(newsResultsJson) {
    const newsLanguages = await getNewsLanguages(newsResultsJson);
    createDropDownList(newsLanguages);
    console.log(newsResultsJson);

    return newsResultsJson.map((news, i) => {
        let resultElem = document.createElement('div');
        resultElem.classList.add('news');
        let resultElemLink = document.createElement('a');
        resultElemLink.setAttribute('href', `${news.link}`);
        resultElemLink.innerText = `${news.title}`;
        resultElem.appendChild(resultElemLink);
        resultElem.append(createNewsLanguageElements(newsLanguages[i]));
        return resultElem;
    });
}

async function getNewsLanguages(news) {
    const newsLanguages = await Promise.all(
        news.map(async (article) => {
            const newsLanguage = await fetch(
                `https://ws.detectlanguage.com/0.2/detect?q=${encodeURIComponent(article.title)}`, {
                headers: {
                    'Authorization': 'Bearer abc88271f7a8c4f96bc2ec83ad903b10'
                },
            }
            );
            const newsLanguageJson = await newsLanguage.json();
            console.log(article);
            console.log(newsLanguageJson);
            return newsLanguageJson.data.detections[0].language;
        })
    );
    console.log(newsLanguages);
    return newsLanguages;
}

function createDropDownList(options) {
    const langOptions = [... new Set(options)]
    let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    for(var i = 0; i < langOptions.length; i++) {
        var opt = languageNames.of(langOptions[i]);
        var optionElem = document.createElement("option");
        optionElem.textContent = opt;
        optionElem.value = opt;
        select.appendChild(optionElem);
    }
    let btn = document.createElement("button");
    btn.textContent = "Filter";
    btn.addEventListener("click", filterResults());
    form.appendChild(btn);
}

function filterResults() {
    clearResultsElem();
    populateResultsElem(newsElements);

}


function createNewsLanguageElements(newsLanguage) {
    const newsLanguageElem = document.createElement("div");
    newsLanguageElem.classList.add('language');
    let languageNames = new Intl.DisplayNames(['en'], {type: 'language'});
    console.log(languageNames.of(newsLanguage));
    newsLanguageElem.append(languageNames.of(newsLanguage));
    return newsLanguageElem;
}

function clearResultsElem() {
    Array.from(resultsContainerElem.childNodes).forEach((child) => {
        child.remove();
    });
}

function populateResultsElem(newsResultsElems) {
    resultsContainerElem.append(...newsResultsElems);
}




// form.addEventListener('submit', (event) => {
//     console.log('submitting');
//     event.preventDefault();
// })

// const result = document.getElementById('result');

// queryInputElem.addEventListener('keyup', async function (event) {
//     event.preventDefault();
//     if (event.key == 'Enter') {
//         console.log('pressed enter');

//         const newsResultsResp = await fetch(`https://newsdata.io/api/1/news?apikey=pub_14349f52f64451f046a829672ecd657ed8abb&q=${encodeURIComponent(queryInputElem.value)}`)
//         console.log(newsResultsResp);
//         const newsResults = await newsResultsResp.json();

//         console.log(newsResults);

//         const language = [];

//         const newsResultsElems = newsResults.results.map(async (news) => {
//             const resultElem = document.createElement('div');
//             resultElem.classList.add('news');
//             const resultElemLink = document.createElement('a');
//             resultElemLink.setAttribute('href', `${news.link}`);
//             resultElemLink.innerText = `${news.title}`;
//             resultElem.appendChild(resultElemLink);

//             const translateResultsElems = await fetch(``)
//             return resultElem;
//         })

//         const resultsContainer = document.getElementById("results");
//         Array.from(resultsContainer.childNodes).forEach((child) => {
//             child.remove();
//         });
//         resultsContainer.append(...newsResultsElems);
//         // for (let i = 0; i < 10; i++) {
//         //     const
//         // }
//     }
// })