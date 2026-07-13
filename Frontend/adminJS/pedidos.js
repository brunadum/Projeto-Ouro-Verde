exigirLogin();

const logoutBtn =
document.getElementById("logoutBtn");

const modal =
document.getElementById("logoutModal");

const confirmLogout =
document.getElementById("confirmLogout");

const cancelLogout =
document.getElementById("cancelLogout");

logoutBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    modal.classList.add("show");

});

cancelLogout.addEventListener("click",()=>{

    modal.classList.remove("show");

});

confirmLogout.addEventListener("click",()=>{

    logoutAdmin();

});

/* ==========================================================
   CARREGAR PEDIDOS (RESERVAS) DA API
========================================================== */

const tbody =
document.getElementById("pedidosTable");

function formatarMoeda(valor){
    return "R$ " + Number(valor || 0).toFixed(2).replace(".", ",");
}

async function carregarPedidos(){

    tbody.innerHTML = `<tr><td colspan="8">Carregando...</td></tr>`;

    try {

        const reservas = await apiFetch("/reservas");

        renderizarCards(reservas);
        renderizarTabela(reservas);

    } catch (erro) {

        tbody.innerHTML = `<tr><td colspan="8">${erro.message}</td></tr>`;
    }
}

function renderizarCards(reservas){

    const receitaEl = document.getElementById("receitaMensal");
    const pendentesEl = document.getElementById("pedidosPendentes");
    const finalizadosEl = document.getElementById("pedidosFinalizados");

    if (!receitaEl) return;

    const receita = reservas.reduce((soma, r) => soma + Number(r.valorTotal || 0), 0);
    const pendentes = reservas.filter(r => r.status === "PENDENTE").length;
    const finalizados = reservas.filter(r => r.status === "FINALIZADO" || r.status === "APROVADO").length;

    receitaEl.textContent = formatarMoeda(receita);
    pendentesEl.textContent = pendentes;
    finalizadosEl.textContent = finalizados;
}

function renderizarTabela(reservas){

    tbody.innerHTML = "";

    if (reservas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">Nenhum pedido encontrado.</td></tr>`;
        return;
    }

    reservas.forEach(reserva => {

        const statusClasse = (reserva.status || "").toLowerCase();

        tbody.innerHTML += `
        <tr>

            <td>${reserva.idReserva}</td>

            <td>${reserva.cliente?.nome ?? "-"}</td>

            <td>${reserva.servico?.nome ?? "-"}</td>

            <td>${reserva.dataEvento ?? "-"}</td>

            <td>${reserva.dataEvento ?? "-"}</td>

            <td>${formatarMoeda(reserva.valorTotal)}</td>

            <td>
                <span class="status ${statusClasse}">
                    ${reserva.status}
                </span>
            </td>

            <td>
                <button class="btn-action" onclick="alterarStatus(${reserva.idReserva}, '${reserva.status}')">
                    Ver
                </button>
            </td>

        </tr>
        `;

    });

}

/* ==========================================================
   ALTERAR STATUS DO PEDIDO
========================================================== */

async function alterarStatus(idReserva, statusAtual){

    const novoStatus = prompt(
        `Status atual: ${statusAtual}\nDigite o novo status (PENDENTE, APROVADO, FINALIZADO ou CANCELADO):`
    );

    if (!novoStatus) return;

    try {

        await apiFetch(`/reservas/${idReserva}/status?novoStatus=${encodeURIComponent(novoStatus)}`, {
            method: "PATCH"
        });

        carregarPedidos();

    } catch (erro) {

        alert(erro.message);
    }
}

carregarPedidos();
