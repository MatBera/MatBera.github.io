document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = 'ef96aeb6a5b4668abf7cc49016df4390';

    let paginaAtual = 1;
    let totalPaginas = 1;
    let carregando = false;

    const lista = document.getElementById('lista-filmes') || document.getElementById('lista-favoritos');
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const campoNome = document.getElementById('usuario-nome');

    if (campoNome && nomeUsuario) {
        campoNome.textContent = `Olá, ${nomeUsuario}`;
    }

    // Login do usuário
    const botaoLogar = document.getElementById('botaoLogin');
    if (botaoLogar) {
        botaoLogar.addEventListener('click', function (event) {

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

    // Cadastro do usuário
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

    // Criar poster dos filmes
    function criarElementoFilme(filme) {
        const item = document.createElement('div');
        item.classList.add('filme-item');

        const link = document.createElement('a');
        link.href = `ProjetoPWEBFilme.html?id=${filme.id}`;

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w500${filme.poster_path}`;
        poster.alt = filme.title;

        const titulo = document.createElement('p');
        titulo.classList.add('titulo-filme');
        titulo.innerText = filme.title;

        const estrela = document.createElement('img');
        estrela.src = isFavorito(filme.id) ? 'estrela-preenchida.png' : 'estrela.png';
        estrela.alt = 'Favoritar';
        estrela.classList.add('icone-favorito');

        // Favoritar filme
        estrela.addEventListener('click', (event) => {
            event.preventDefault(); // não abre o link
            event.stopPropagation();

            if (isFavorito(filme.id)) {
                removerFavorito(filme.id);
                estrela.src = 'estrela.png';
            } else {
                adicionarFavorito(filme);
                estrela.src = 'estrela-preenchida.png';
            }
        });

        link.appendChild(poster);
        item.appendChild(link);
        item.appendChild(titulo);
        item.appendChild(estrela);

        return item;
    }

    // Importar filmes da API
    async function carregarFilmes() {
        if (carregando) return;
        carregando = true;

        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${paginaAtual}`;

        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();

            totalPaginas = dados.total_pages;

            dados.results.forEach(filme => {
                const filmeItem = criarElementoFilme(filme);
                lista.appendChild(filmeItem);
            });

            paginaAtual++;
        } catch (error) {
            console.error('Erro ao carregar filmes:', error);
        }

        carregando = false;
    }

    const inputPesquisa = document.getElementById('input-pesquisa');

    // Pesquisar filmes na lista
    if (inputPesquisa) {
        inputPesquisa.addEventListener('input', async function () {
            const termo = inputPesquisa.value.trim();

            if (termo === "") {
                lista.innerHTML = "";
                paginaAtual = 1;
                carregarFilmes();
                return;
            }

            // Faz a busca na API
            const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(termo)}`;

            try {
                const resposta = await fetch(url);
                const dados = await resposta.json();

                lista.innerHTML = "";

                if (dados.results.length === 0) {
                    lista.innerHTML = "<p>Nenhum filme encontrado.</p>";
                    return;
                }

                dados.results.forEach(filme => {
                    const filmeItem = criarElementoFilme(filme);
                    lista.appendChild(filmeItem);
                });
            } catch (error) {
                console.error('Erro ao buscar filmes:', error);
            }
        });
    }

    // Scroll infinito para carregar menos coisas quando abre a página
    if (lista && lista.id === 'lista-filmes') {
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

    // Importar filmes favoritados
    if (lista && lista.id === 'lista-favoritos') {
        carregarFavoritos();
    }

    function carregarFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];

        favoritos.forEach(filme => {
            const filmeItem = criarElementoFilme(filme);
            lista.appendChild(filmeItem);
        });
    }

    // Salvar os filmes favoritos localmente
    function adicionarFavorito(filme) {
        let favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];

        if (!favoritos.some(f => f.id === filme.id)) {
            favoritos.push({
                id: filme.id,
                title: filme.title,
                poster_path: filme.poster_path
            });
            localStorage.setItem('filmesFavoritos', JSON.stringify(favoritos));
        }
    }

    function removerFavorito(id) {
        let favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
        favoritos = favoritos.filter(f => f.id !== id);
        localStorage.setItem('filmesFavoritos', JSON.stringify(favoritos));
    }

    function isFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem('filmesFavoritos')) || [];
        return favoritos.some(f => f.id === id);
    }

    // Importar detalhes dos filmes
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
