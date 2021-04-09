const APIURL = 'https://api.github.com/users/';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const notFound = document.getElementById('notFound');
let array = [];


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

    (user.bio === null) ? user.bio = "" : user.bio;
    (user.name === null) ? user.name = user.login : user.name;

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
                <h2><a id="${user.login}" href="${user.html_url}" target="_blank">${user.name}</a></h2>
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
            <div id="svgClose">
                <svg onclick="deleteSearch()" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h4>Usuarios vistos recientemente:</h4>
            <ul id="lastSearch"></ul>
        </div>
        `;
    main.innerHTML = cardHtml;

    lastSearch = document.getElementById('lastSearch');
    addLastSearchToCard(user.name, user.html_url, user.login)
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
function addLastSearchToCard(user, userUrl, userLogin) {
    array.push({ nombre: user, url: userUrl, userNameLogin: userLogin });


    // Filtrar para descartar users repetidos (result: array sin los repetidos)
    const hash = {};
    array = array.filter(function (current) {
        let exists = !hash[current.nombre];
        hash[current.nombre] = true;
        return exists;
    });

    for (arr of array) {
        const nameTitulo = document.querySelector('.user-info a').id;
        let nameLogin = arr.userNameLogin;
        if (arr.nombre != undefined) {
            // let nombre = arr.nombre;
            // let url = arr.url;
            let aLastSearch = document.createElement('a');
            aLastSearch.classList.add('repo');
            aLastSearch.id = `${arr.userNameLogin}`;

            if (array.length <= 8) {
                aLastSearch.onclick = (e) => {
                    if (e.target.innerHTML == nameTitulo) return;
                    getUser(nameLogin)
                };
                // aLastSearch.href = url;
                aLastSearch.target = "_blank";
                aLastSearch.innerText = nameLogin;

                lastSearch.appendChild(aLastSearch);
            }

            if (array.length > 8) {
                array.splice(0, 1);

                aLastSearch.onclick = (e) => {
                    if (e.target.innerHTML === nameTitulo) return;
                    getUser(array[0].userNameLogin)
                };
                // aLastSearch.href = array[0].url;
                aLastSearch.target = "_blank";
                aLastSearch.innerText = array[0].userNameLogin;

                lastSearch.appendChild(aLastSearch);
            }
        }
    }
};


// Función para eliminar usuarios vistos recientemente
function deleteSearch() {
    const svgClose = document.getElementById('svgClose');
    lastSearch.remove();
    svgClose.style.display = "none";
    array = [];
};


// Listener del input para llamar a la funcion getUser()
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        getUser(user);
        search.value = "";
    }
})