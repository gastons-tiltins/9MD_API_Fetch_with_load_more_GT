const initialUrl = 'https://rickandmortyapi.com/api/character';
let nextPage = 2;
let cardsPerPage = 0;
let cardPosition = 0;

fetch(`${initialUrl}`, {method: 'get'})
    .then((response) => response.json())
    .then((data) => {
        // find how many cards in API
        let cardAmount = Object.keys(data.results).length;

        // create initial page cards
        for (let i = 0; i < cardAmount; i++) {
            createCards(initialUrl, i, cardPosition);
        }

        // Print another page of cards
        const button = document.querySelector('.button');
        button.addEventListener('click', () => {
            let apiUrl = `https://rickandmortyapi.com/api/character/?page=${nextPage}`;
            console.log(apiUrl);
            if (apiUrl !== undefined || apiUrl !== null) {
                cardsPerPage = cardAmount;
                cardPosition += cardsPerPage;
                nextPage += 1;
                console.log(nextPage);
                for (let i = 0; i < cardsPerPage; i++) {
                    createCards(apiUrl, i, cardPosition);
                }
            }
        });
    });

function createCards(url: string, cardAmount: number, cardPosition: number) {
    fetch(`${url}`, {method: 'get'})
        .then((response) => response.json())
        .then((data) => {
            // create card HTML structure
            makeCard();

            // Assign var values from API
            let image = data.results[cardAmount].image;
            let name = data.results[cardAmount].name;
            let status = data.results[cardAmount].status;
            let species = data.results[cardAmount].location.name;
            let gender = data.results[cardAmount].gender;
            let origin = data.results[cardAmount].location.name;
            const episode = data.results[cardAmount].episode[0];

            document
                .getElementsByClassName('img')
                [cardPosition + cardAmount].setAttribute('src', image);
            document.getElementsByClassName('name')[
                cardPosition + cardAmount
            ].innerHTML = name;
            document.getElementsByClassName('status')[
                cardPosition + cardAmount
            ].innerHTML = `${status} - ${species}, ${gender}`;
            document.getElementsByClassName('origin')[
                cardPosition + cardAmount
            ].innerHTML = origin;

            return fetch(episode); // make a 2nd request and return a promise
        })
        .then((response) => response.json())
        .then((data) => {
            let episode = data.name;
            if (episode !== undefined) {
                document.getElementsByClassName('episode')[
                    cardPosition + cardAmount
                ].innerHTML = episode;
            }
        })
        .catch((err) => {
            console.error('Request failed', err);
        });
}

// make HTML card function
const makeCard = () => {
    let div = document.createElement('div');
    div.innerHTML = `
    <div class="card">
    <div class="left">
        <img class="img" src="" alt="" />
    </div>
    <div class="right">
        <div class="name"></div>
        <div class="status"></div>
            <p>Last known location:</p>
        <div class="origin"></div>
            <p>First seen in:</p>
        <div class="episode"></div>
        </div>
    </div>
`;
    document.getElementsByClassName('container')[0].appendChild(div);
};

// I'm using the result const to show that you can continue to extend the chain from the returned promise
// result.then((r) => {
//     console.log(r.name); // 2nd request result first_stage property
// });
