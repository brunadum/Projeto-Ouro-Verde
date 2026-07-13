/* ==========================================================
   CONFIGURAÇÃO DA API - TELAS ADMIN
   ==========================================================
   Se o backend rodar em outro endereço/porta, troque
   só esta constante que tudo mais continua funcionando.
========================================================== */

const API_BASE_URL = "http://localhost:8080/api";

/**
 * Faz uma requisição para a API e já trata erros comuns.
 * Retorna o JSON da resposta (ou null se não houver corpo).
 */
async function apiFetch(endpoint, options = {}) {

    let resposta;

    try {
        resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        });
    } catch (erro) {
        throw new Error(
            "Não foi possível conectar ao servidor. Verifique se o backend está rodando em " + API_BASE_URL
        );
    }

    if (!resposta.ok) {
        let mensagemErro = `Erro ${resposta.status} ao acessar ${endpoint}`;

        try {
            const corpoErro = await resposta.json();
            mensagemErro = corpoErro.message || corpoErro.error || mensagemErro;
        } catch (_) {
            // corpo do erro não era JSON, mantém mensagem padrão
        }

        throw new Error(mensagemErro);
    }

    const texto = await resposta.text();
    return texto ? JSON.parse(texto) : null;
}

/* ==========================================================
   AUTENTICAÇÃO (simples, guardada no localStorage)
========================================================== */

function salvarAdminLogado(admin) {
    localStorage.setItem("adminLogado", JSON.stringify(admin));
}

function getAdminLogado() {
    const dados = localStorage.getItem("adminLogado");
    return dados ? JSON.parse(dados) : null;
}

function logoutAdmin() {
    localStorage.removeItem("adminLogado");
    window.location.href = "login.html";
}

/**
 * Chame no topo de dashboard.html, pedidos.html e produtos.html
 * para bloquear o acesso de quem não fez login.
 */
function exigirLogin() {
    if (!getAdminLogado()) {
        window.location.href = "login.html";
    }
}
