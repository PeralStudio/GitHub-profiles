const APIURL = 'https://api.github.com/users/';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const notFound = document.getElementById('notFound');
const array = [];
let lastSearch;


// Traer información del User
async function getUser(username) {
    const response = await fetch(APIURL + username);
    const data = await response.json();

    // Si no encuentra User... borrar card y salir de la función
    if (data.message === 'Not Found') {
        main.innerHTML = '';
        notFound.innerText = 'Usuario no encontrado';

        return;
    }
    notFound.innerText = '';
    createUserCard(data);
    getRepos(username);
}


// Traer información de los repositorios del User
async function getRepos(username) {
    const response = await fetch(`${APIURL}${username}/repos`);
    const data = await response.json();

    addRepostToCard(data);
}


// Crear la card con los datos del User
function createUserCard(user) {
    const card = document.createElement('div');
    card.classList.add('card');

    let target = "_blank";
    if (user.blog === "") {
        user.blog = "javascript:void(0);";
        target = "";
    }

    const cardHtml = `
        <div class="card">
            <div class="img-container">
                <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />
            </div>
            <div class="user-info">
                <h2><a href="${user.html_url}" target="_blank">${user.name}</a></h2>
                <p>${user.bio}</p>

                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                    <li><strong><a href="${user.blog}" target="${target}">WebSite</a></strong></li>
                    
                </ul>
                <div class="div-repos">
                    <h4>Repos:</h4>
                    <ul id="repos"></ul>
                </div>
            </div>
        </div>
        <div class="ultimosUsados">
            <h4>Usuarios vistos recientemente:</h4>
            <ul id="lastSearch"></ul>
        </div>
        `;
    main.innerHTML = cardHtml;

    lastSearch = document.getElementById('lastSearch');
    addLastSearchToCard(user.name, user.html_url)
}


// Añadir los repositorios del User a la card
function addRepostToCard(repos) {
    const publicRepos = document.getElementById('repos');

    // Ordenar repos por estrellas
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count).forEach((repo) => {
        const repoEl = document.createElement('a');

        repoEl.classList.add('repo');

        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;

        publicRepos.appendChild(repoEl);
    });
}


// Añadir Vistos recientemente
function addLastSearchToCard(user, userUrl) {

    array.push({ nombre: user, url: userUrl });

    for (arr of array) {
        let nombre = arr.nombre;
        let url = arr.url;
        let arrEl = document.createElement('a');

        arrEl.classList.add('repo');

        if (array.length <= 3) {
            arrEl.href = url;
            arrEl.target = "_blank";
            arrEl.innerText = nombre;

            lastSearch.appendChild(arrEl);
        } else {
            array.splice(0, 1);

            arrEl.href = array[0].url;
            arrEl.target = "_blank";
            arrEl.innerText = array[0].nombre;

            lastSearch.appendChild(arrEl);
        };
    };
}


// Listener del input para llamar a la funcion getUser()
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        getUser(user);
        search.value = "";
    }
})