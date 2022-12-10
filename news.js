
const queryInputElem = document.getElementById('query');
const resultsContainerElem = document.getElementById("results");
const selectElem = document.getElementById("select");
const filterElem = document.getElementById("filter");

const form = document.getElementById('vestigial');
queryInputElem.addEventListener("keydown", whenSomeKeyPressed);
filterElem.addEventListener("click", filterResults);

var searched = false;
var allNewsLanguages;
var newsLanguages;

async function whenSomeKeyPressed(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        news = await searchForNews(queryInputElem.value);
        newsElements = await createNewsElements(news.results);
        clearResultsElem();
        let titleElem = document.createElement('div');
        titleElem.classList.add('resultTitle');
        let langTitleElem = document.createElement('div');
        langTitleElem.classList.add('langTitle');
        langTitleElem.textContent = 'Language';
        let linkTitleElem = document.createElement('div');
        linkTitleElem.classList.add('linkTitle');
        linkTitleElem.textContent = 'Link';
        titleElem.appendChild(langTitleElem);
        titleElem.appendChild(linkTitleElem);
        resultsContainerElem.append(titleElem);
        populateResultsElem(newsElements);
        clearDropDownElem();
        createDropDownList(newsLanguages);
        allNewsLanguages = newsLanguages;

        searched = true;
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
    newsLanguages = await getNewsLanguages(newsResultsJson);
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
    let languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
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
            return languageNames.of(newsLanguageJson.data.detections[0].language);
        })
    );
    return newsLanguages;
}

function createDropDownList(options) {
    var allOptionElem = document.createElement("option");
    allOptionElem.textContent = "All";
    allOptionElem.value = "All";
    select.appendChild(allOptionElem);
    const langOptions = [... new Set(options)]
    for (var i = 0; i < langOptions.length; i++) {
        var optionElem = document.createElement("option");
        optionElem.textContent = langOptions[i];
        optionElem.value = langOptions[i];
        select.appendChild(optionElem);
    }
}

async function filterResults(event) {
    event.preventDefault();
    clearResultsElem();
    if (newsLanguages == null) {
        alert("Please search for news!");
        return
    }
    let titleElem = document.createElement('div');
    titleElem.classList.add('resultTitle');
    let langTitleElem = document.createElement('div');
    langTitleElem.classList.add('langTitle');
    langTitleElem.textContent = 'Language';
    let linkTitleElem = document.createElement('div');
    linkTitleElem.classList.add('linkTitle');
    linkTitleElem.textContent = 'Link';
    titleElem.appendChild(langTitleElem);
    titleElem.appendChild(linkTitleElem);
    resultsContainerElem.append(titleElem);
    const newsResults = new Array();

    const selectElement = selectElem.options[selectElem.selectedIndex].value;
    if (selectElement == "All") {
        newsElements = await createNewsElements(news.results);
        populateResultsElem(newsElements);
        return
    }
    for (var j = 0; j < news.results.length; j++) {
        if (selectElement === allNewsLanguages[j]) {
            console.log(j);
            newsResults.push(news.results[j]);
        }
    }
    newsElements = await createNewsElements(newsResults);
    populateResultsElem(newsElements);
}


function createNewsLanguageElements(newsLanguage) {
    const newsLanguageElem = document.createElement("div");
    newsLanguageElem.classList.add('language');
    newsLanguageElem.append(newsLanguage);
    return newsLanguageElem;
}

function clearResultsElem() {
    Array.from(resultsContainerElem.childNodes).forEach((child) => {
        child.remove();
    });
}

function clearDropDownElem() {
    Array.from(selectElem.childNodes).forEach((child) => {
        child.remove();
    });
}

function populateResultsElem(newsResultsElems) {
    resultsContainerElem.append(...newsResultsElems);
}
