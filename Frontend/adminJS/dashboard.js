exigirLogin();

const logoutBtn = document.getElementById("logoutBtn");
const modal = document.getElementById("logoutModal");
const confirmLogout = document.getElementById("confirmLogout");
const cancelLogout = document.getElementById("cancelLogout");

if (logoutBtn) {
    logoutBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        modal.classList.add("show");
    });
}

if (cancelLogout) {
    cancelLogout.addEventListener("click", ()=>{
        modal.classList.remove("show");
    });
}

if (confirmLogout) {
    confirmLogout.addEventListener("click", ()=>{
        window.location.href = "login.html"; // Faz o logout simples
    });
}

/* ==========================================================
   CARREGAR RESUMO DO PAINEL
========================================================== */

const tbody = document.getElementById("pedidosTable");

function formatarMoeda(valor){
    return "R$ " + Number(valor || 0).toFixed(2).replace(".", ",");
}

async function carregarDashboard(){
    if (tbody) tbody.innerHTML = `<tr><td colspan="7">Carregando dados do Banco...</td></tr>`;

    try {
        const respReservas = await fetch('http://localhost:8080/api/reservas');
        const reservas = await respReservas.json();

        const respMateriais = await fetch('http://localhost:8080/api/materiais');
        const materiais = await respMateriais.json();

        preencherCards(reservas, materiais);
        preencherTabela(reservas);

    } catch (erro) {
        console.error(erro);
        if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="color:red;">Erro ao conectar. O Java está rodando?</td></tr>`;
    }
}

function preencherCards(reservas, materiais){
    const receitaEl = document.getElementById("receitaMensal");
    const produtosEl = document.getElementById("produtosAtivos");
    const pendentesEl = document.getElementById("pedidosPendentes");

    const receita = reservas.reduce((soma, r) => soma + Number(r.valorTotal || 0), 0);
    const pendentes = reservas.filter(r => r.status === "PENDENTE").length;

    if (receitaEl) receitaEl.textContent = formatarMoeda(receita);
    if (produtosEl) produtosEl.textContent = materiais.length;
    if (pendentesEl) pendentesEl.textContent = pendentes;
}

function preencherTabela(reservas){
    if (!tbody) return;

    tbody.innerHTML = "";

    const recentes = [...reservas]
        .sort((a, b) => b.idReserva - a.idReserva)
        .slice(0, 5);

    if (recentes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">Nenhum pedido encontrado.</td></tr>`;
        return;
    }

    recentes.forEach(reserva => {
        const statusClasse = (reserva.status || "").toLowerCase();

        tbody.innerHTML += `
        <tr>
            <td>${reserva.idReserva}</td>
            <td>${reserva.cliente?.nome ?? "-"}</td>
            <td>${reserva.dataEvento ?? "-"}</td> <td>${reserva.dataEvento ?? "-"}</td>
            <td>${formatarMoeda(reserva.valorTotal)}</td>
            <td>
                <span class="status ${statusClasse}">
                    ${reserva.status}
                </span>
            </td>
            <td>
                <button class="btn-action" onclick="alert('Funcionalidade de detalhes em breve!')">
                    Ver
                </button>
            </td>
        </tr>
        `;
    });
}

carregarDashboard();