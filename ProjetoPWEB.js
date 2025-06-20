document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = 'ef96aeb6a5b4668abf7cc49016df4390';

    let paginaAtual = 1;
    let totalPaginas = 1;
    let carregando = false;

    // 🟦 Login
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

            if (email === "teste@cinecheck.com" && senha === "1234") {
                window.location.href = 'ProjetoPWEBPerfil.html';
            } else {
                alert('E-mail ou senha incorretos!');
            }
        });
    }

    // 🟦 Cadastro
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

    // 🟦 Mostrar nome no perfil
    const campoNome = document.getElementById('usuario-nome');
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (campoNome && nomeUsuario) {
        campoNome.textContent = `Olá, ${nomeUsuario}`;
    }

    // 🟦 Carregar filmes na lista
    const lista = document.getElementById('lista-filmes');
    if (lista) {
        carregarFilmes();

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const alturaPagina = document.documentElement.scrollHeight;
            const alturaJanela = window.innerHeight;

            if (scrollTop + alturaJanela >= alturaPagina - 100) {
                if (paginaAtual <= totalPaginas) {
                    carregarFilmes();
                }
            }
        });
    }

    async function carregarFilmes() {
        if (carregando) return;

        carregando = true;

        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${paginaAtual}`;

        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();

            totalPaginas = dados.total_pages;

            dados.results.forEach(filme => {
                const link = document.createElement('a');
                link.href = `ProjetoPWEBFilme.html?id=${filme.id}`;

                const poster = document.createElement('img');
                poster.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
                poster.alt = filme.title;

                link.appendChild(poster);
                lista.appendChild(link);
            });

            paginaAtual++;

        } catch (error) {
            console.error('Erro ao carregar filmes:', error);
        }

        carregando = false;
    }

    // 🟦 Carregar detalhes do filme
    const poster = document.getElementById('poster');
    const titulo = document.getElementById('titulo');
    const sinopse = document.getElementById('sinopse');
    const info = document.getElementById('info');

    if (poster && titulo && sinopse && info) {
        carregarDetalhesFilme();
    }

    async function carregarDetalhesFilme() {
        const params = new URLSearchParams(window.location.search);
        const filmeId = params.get('id');

        if (!filmeId) {
            console.error('ID do filme não encontrado na URL');
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
