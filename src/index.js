// global variables here
const quotesURL = 'http://localhost:3000/quotes'
const likesURL = 'http://localhost:3000/likes'
const newQuoteForm = document.querySelector('#new-quote-form')
const quoteList = document.querySelector('#quote-list')

// event listeners
newQuoteForm.addEventListener('submit', fetchAndAppendNewQuote)
quoteList.addEventListener('click', handleButtonClicks)


// declare functions
getAllQuotes()


// define functions

    // ----- BUTTON CLICK HANDLER ----- //

function handleButtonClicks(event) {
    if (event.target.tagName != 'BUTTON') {return}

    const targettedListItemId = event.target.parentNode.parentNode.dataset.quoteId

    if (event.target.className === 'btn-success') {
        likeQuote(targettedListItemId)
    } else if (event.target.className === 'btn-danger') {
        deleteQuote(targettedListItemId)
    }
}

    // ----- LIKE A QUOTE AND UPDATE THE DATABASE ----- //

function likeQuote(quoteId) {
    const configObject = createLikePostObjectFromId(quoteId)

    fetch(likesURL, configObject)
        .then(res => res.json())
        .then(getAllQuotes)
}

function createLikePostObjectFromId(quoteId) {
    const body = JSON.stringify({ quoteId: parseInt(quoteId) })
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: body
    }
}


    // ----- DELETE A QUOTE FROM THE PAGE AND DATABASE ----- //

function deleteQuote(quoteId) {
    fetch (quotesURL+'/'+quoteId, {method: 'DELETE'})
        .then(res => res.json())
        .then(getAllQuotes)
}

    // ----- POST A SINGLE NEW QUOTE FROM FORM ----- //

function fetchAndAppendNewQuote(event) {
    event.preventDefault()
    const configObject = createQuotePostObjectFromForm(event.target)
    
    fetch(quotesURL, configObject)
        .then(resp => resp.json())
        .then(getAllQuotes)

}

function createQuotePostObjectFromForm(form) {
    const body = JSON.stringify({quote: form.quote.value, author: form.author.value})
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: body
    }
}

    // ----- GET ALL QUOTES AND HELPERS ----- //

function getAllQuotes() {
    fetch(quotesURL+'?_embed=likes')
        .then(res => res.json())
        .then(json => {
            populateQuoteList(json)
        })
}

function populateQuoteList(quoteObjectArray) {
    // generate and append quote list-items to the quote list
    const quoteList = document.querySelector('#quote-list')
    quoteList.innerHTML = ''
    for (const quote of quoteObjectArray) {
        const quoteListItem = createQuoteListItem(quote)
        quoteList.appendChild(quoteListItem)
    }
}

function createQuoteListItem(quoteObject) {
    // generate and return single quote list items
    const li = document.createElement('li')
    li.className = 'quote-card'
    li.dataset.quoteId = quoteObject.id
    li.innerHTML = `
        <blockquote class="blockquote">
            <p class="mb-0">"${quoteObject.quote}"</p>
            <footer class="blockquote-footer">${quoteObject.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quoteObject.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>
         </blockquote>`
    return li
}
