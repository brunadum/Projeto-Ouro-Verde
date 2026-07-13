exigirLogin();

const logoutBtn = document.getElementById("logoutBtn");
const modal = document.getElementById("logoutModal");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.classList.add("show");
    });
}

if (cancelLogout) {
    cancelLogout.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}

if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}

/* ==========================================================
   CATEGORIAS (Busca real com plano de contingência)
========================================================== */
const selectCategoria = document.getElementById("categoria");

async function carregarCategorias() {
    if (!selectCategoria) return;
    
    try {
        const resposta = await fetch("http://localhost:8080/api/categorias");
        if (resposta.ok) {
            const categorias = await resposta.json();
            selectCategoria.innerHTML = categorias
                .map(c => `<option value="${c.idCategoria}">${c.nome}</option>`)
                .join("");
        } else {
            // Caso a rota de categorias não exista ou esteja vazia, define o ID 1
            selectCategoria.innerHTML = `<option value="1">Categoria Padrão (ID: 1)</option>`;
        }
    } catch (erro) {
        console.warn("Rota /api/categorias não encontrada, usando ID padrão 1.");
        selectCategoria.innerHTML = `<option value="1">Categoria Padrão (ID: 1)</option>`;
    }
}

/* ==========================================================
   LISTAR PRODUTOS REAIS DO BANCO (GET)
========================================================== */
const produtosTbody = document.getElementById("produtosTable");

function formatarMoeda(valor) {
    return "R$ " + Number(valor || 0).toFixed(2).replace(".", ",");
}

async function carregarProdutos() {
    if (!produtosTbody) return;
    produtosTbody.innerHTML = `<tr><td colspan="6">Carregando do banco de dados...</td></tr>`;

    try {
        const resposta = await fetch("http://localhost:8080/api/materiais");
        const materiais = await resposta.json();

        if (materiais.length === 0) {
            produtosTbody.innerHTML = `<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>`;
            return;
        }

        produtosTbody.innerHTML = materiais.map(m => `
            <tr>
                <td>${m.idMaterial}</td>
                <td>${m.nome}</td>
                <td>${m.categoria?.nome ?? "-"}</td>
                <td>${formatarMoeda(m.precoUnitario)}</td>
                <td>${m.quantidadeEstoque}</td>
                <td>
                    <button class="btn-action" onclick="excluirProduto(${m.idMaterial})">
                        Excluir
                    </button>
                </td>
            </tr>
        `).join("");

    } catch (erro) {
        console.error(erro);
        produtosTbody.innerHTML = `<tr><td colspan="6" style="color:red;">Erro de conexão com o Java.</td></tr>`;
    }
}

/* ==========================================================
   EXCLUIR PRODUTO DO BANCO (DELETE)
========================================================== */
async function excluirProduto(id) {
    if (!confirm("Tem certeza que deseja excluir este produto do Banco de Dados?")) return;

    try {
        const resposta = await fetch(`http://localhost:8080/api/materiais/${id}`, { 
            method: "DELETE" 
        });

        if (resposta.ok) {
            alert("Produto excluído com sucesso!");
            carregarProdutos();
        } else {
            alert("Erro ao excluir. O produto pode estar associado a uma reserva pendente.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Falha na conexão com o servidor Java.");
    }
}

/* ==========================================================
   CADASTRAR NOVO PRODUTO NO BANCO (POST)
========================================================== */
const form = document.getElementById("produtoForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const preco = document.getElementById("preco").value;
        const estoque = document.getElementById("estoque").value;
        const idCategoria = document.getElementById("categoria").value;

        if (!nome || !estoque || !idCategoria) {
            alert("Preencha os campos obrigatórios (Nome, Categoria e Estoque).");
            return;
        }

        const novoMaterial = {
            nome: nome,
            precoUnitario: preco ? Number(preco) : 0.0,
            quantidadeEstoque: Number(estoque),
            categoria: { idCategoria: Number(idCategoria) }
        };

        try {
            const resposta = await fetch("http://localhost:8080/api/materiais", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoMaterial)
            });

            if (resposta.ok) {
                alert("Produto cadastrado com sucesso!");
                form.reset();
                carregarProdutos();
            } else {
                alert("Erro ao cadastrar o produto. Verifique os logs do servidor.");
            }
        } catch (erro) {
            console.error(erro);
            alert("Falha de conexão com o Java (porta 8080).");
        }
    });
}

carregarCategorias();
carregarProdutos();