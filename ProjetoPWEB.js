document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = 'ef96aeb6a5b4668abf7cc49016df4390';

    // 🔒 Login
    const botaoLogar = document.getElementById('botaoLogin');
    if (botaoLogar) {
        botaoLogar.addEventListener('click', function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            if (email === "" || senha === "") {
                alert('Por favor, preencha todos os campos!');
                return;
            }

            // Login simulado
            if (email === "teste@cinecheck.com" && senha === "1234") {
                window.location.href = 'ProjetoPWEBPerfil.html';
            } else {
                alert('E-mail ou senha incorretos!');
            }
        });
    }

    // 📝 Cadastro
    const botaoCadastrar = document.getElementById('botaoCadastrar');
    if (botaoCadastrar) {
        botaoCadastrar.addEventListener('click', function (event) {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const sobrenome = document.getElementById('sobrenome').value;

            if (nome === "" || sobrenome === "") {
                alert('Por favor, preencha seu nome e sobrenome!');
                return;
            }

            const nomeCompleto = nome;
            localStorage.setItem('nomeUsuario', nomeCompleto);

            window.location.href = 'ProjetoPWEBPerfil.html';
        });
    }

    // 👤 Mostrar nome no perfil
    const campoNome = document.getElementById('usuario-nome');
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    if (campoNome && nomeUsuario) {
        campoNome.textContent = `Olá, ${nomeUsuario}`;
    }

    // 🎥 Carregar filmes na lista do perfil
    const lista = document.getElementById('lista-filmes');
    if (lista) {
        carregarFilmes();
    }

    // 🎬 Carregar detalhes do filme
    const poster = document.getElementById('poster');
    const titulo = document.getElementById('titulo');
    const sinopse = document.getElementById('sinopse');
    const info = document.getElementById('info');

    if (poster && titulo && sinopse && info) {
        carregarDetalhesFilme();
    }

    // 🔗 Função: carregar lista de filmes
    async function carregarFilmes() {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;

        const resposta = await fetch(url);
        const dados = await resposta.json();

        lista.innerHTML = '';

        dados.results.forEach(filme => {
            const link = document.createElement('a');
            link.href = `ProjetoPWEBFilme.html?id=${filme.id}`;
            link.target = "_self";

            const poster = document.createElement('img');
            poster.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            poster.alt = filme.title;

            link.appendChild(poster);
            lista.appendChild(link);
        });
    }

    // 🔍 Função: carregar detalhes do filme
    async function carregarDetalhesFilme() {
        const params = new URLSearchParams(window.location.search);
        const filmeId = params.get('id');

        if (!filmeId) {
            alert('Filme não encontrado!');
            return;
        }

        const url = `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${API_KEY}&language=pt-BR`;

        try {
            const resposta = await fetch(url);
            const filme = await resposta.json();

            titulo.innerText = filme.title;
            sinopse.innerText = filme.overview;
            poster.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
            poster.alt = filme.title;

            info.innerHTML = `
                <p><strong>Ano:</strong> ${filme.release_date.substring(0, 4)}</p>
                <p><strong>Gênero:</strong> ${filme.genres.map(g => g.name).join(', ')}</p>
                <p><strong>Duração:</strong> ${filme.runtime} minutos</p>
                <p><strong>Nota:</strong> ${filme.vote_average}</p>
            `;
        } catch (error) {
            console.error('Erro ao carregar detalhes do filme:', error);
        }
    }
});
