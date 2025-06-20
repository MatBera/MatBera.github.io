let filmes = JSON.parse(localStorage.getItem('filmes')) || [];

function salvarFilmes() {
    localStorage.setItem('filmes', JSON.stringify(filmes));
}

function renderizarTabela(filtrar = '') {
    const tabela = document.getElementById('tabela-filmes');
    tabela.innerHTML = '';

    const listaFiltrada = filmes.filter(filme => 
        filme.titulo.toLowerCase().includes(filtrar.toLowerCase())
    );

    listaFiltrada.forEach(filme => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${filme.titulo}</td>
            <td>${filme.diretor}</td>
            <td>${filme.ano}</td>
            <td>${filme.notaUsuario}</td>
            <td>
                <button onclick="editarFilme(${filme.id})">Editar</button>
                <button onclick="excluirFilme(${filme.id})">Excluir</button>
            </td>
        `;

        tabela.appendChild(tr);
    });
}

function abrirFormulario() {
    document.getElementById('formulario').style.display = 'block';
    document.getElementById('titulo-form').innerText = 'Adicionar Filme';
    document.getElementById('formFilme').reset();
    document.getElementById('id').value = '';
}

function fecharFormulario() {
    document.getElementById('formulario').style.display = 'none';
}

document.getElementById('formFilme').addEventListener('submit', function(e) {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const filme = {
        id: id ? Number(id) : Date.now(),
        titulo: document.getElementById('titulo').value,
        diretor: document.getElementById('diretor').value,
        ano: document.getElementById('ano').value,
        genero: document.getElementById('genero').value,
        duracao: document.getElementById('duracao').value,
        elenco: document.getElementById('elenco').value,
        classificacao: document.getElementById('classificacao').value,
        sinopse: document.getElementById('sinopse').value,
        notaUsuario: document.getElementById('notaUsuario').value,
        dataAdicao: new Date().toISOString().split('T')[0]
    };

    if (id) {
        const index = filmes.findIndex(f => f.id === Number(id));
        filmes[index] = filme;
    } else {
        filmes.push(filme);
    }

    salvarFilmes();
    renderizarTabela();
    fecharFormulario();
});

function editarFilme(id) {
    const filme = filmes.find(f => f.id === id);
    abrirFormulario();
    document.getElementById('titulo-form').innerText = 'Editar Filme';

    for (let key in filme) {
        if (document.getElementById(key)) {
            document.getElementById(key).value = filme[key];
        }
    }
}

function excluirFilme(id) {
    if (confirm('Deseja realmente excluir este filme?')) {
        filmes = filmes.filter(f => f.id !== id);
        salvarFilmes();
        renderizarTabela();
    }
}

document.getElementById('pesquisar').addEventListener('input', function() {
    renderizarTabela(this.value);
});

renderizarTabela();
