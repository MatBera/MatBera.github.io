document.addEventListener('DOMContentLoaded', function () {
    const botaoLogar = document.getElementById('botaoLogin');

    botaoLogar.addEventListener('click', function (event) {
        event.preventDefault(); // impede o link de executar antes da validação

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        // Simples verificação se os campos estão preenchidos
        if (email === "" || senha === "") {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        // ✅ Simula um login correto
        // Aqui você poderia comparar com dados salvos, mas faremos simples:
        if (email === "teste@cinecheck.com" && senha === "1234") {
            window.location.href = 'ProjetoPWEBPerfil.html'; // redireciona para o perfil
        } else {
            alert('E-mail ou senha incorretos!');
        }
    });
});

// Salvar nome no cadastro
document.addEventListener('DOMContentLoaded', function () {
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
});

// Mostrar nome no perfil
document.addEventListener('DOMContentLoaded', function () {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const campoNome = document.getElementById('usuario-nome');

    if (campoNome && nomeUsuario) {
        campoNome.textContent = nomeUsuario;
    }
});
