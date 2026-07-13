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
        logoutAdmin();
    });
}

const tbody = document.getElementById("pedidosTable");

function formatarMoeda(valor) {
    return "R$ " + Number(valor || 0).toFixed(2).replace(".", ",");
}

function formatarData(dataInput) {
    if (!dataInput) return "-";
    
    if (Array.isArray(dataInput)) {
        const ano = dataInput[0];
        const mes = String(dataInput[1]).padStart(2, '0');
        const dia = String(dataInput[2]).padStart(2, '0');
        return `${dia}/${mes}/${ano}`;
    }
    
    if (typeof dataInput === 'string' && dataInput.includes('-')) {
        const dataApenas = dataInput.split('T')[0];
        const partes = dataApenas.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    
    return dataInput;
}

async function carregarPedidos() {
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">Carregando pedidos do servidor...</td></tr>`;

    try {
        const reservas = await apiFetch("/reservas");

        renderizarCards(reservas);
        renderizarTabela(reservas);

    } catch (erro) {
        tbody.innerHTML = `<tr><td colspan="8" style="color: red; text-align: center;">${erro.message}</td></tr>`;
    }
}

function renderizarCards(reservas) {
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

function renderizarTabela(reservas) {
    tbody.innerHTML = "";

    if (reservas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">Nenhum pedido encontrado no banco de dados.</td></tr>`;
        return;
    }

    reservas.forEach(reserva => {
        const statusClasse = (reserva.status || "").toLowerCase();
        const id = reserva.idReserva || reserva.id || "-";
        const nomeCliente = reserva.cliente?.nome ?? "-";
        const nomeServico = reserva.servico?.nome ?? "-";
        
        const dataInicial = formatarData(reserva.dataEvento);
        const dataFinal = formatarData(reserva.dataEvento); 

        tbody.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${nomeCliente}</td>
            <td>${nomeServico}</td>
            <td>${dataInicial}</td>
            <td>${dataFinal}</td>
            <td style="font-weight: bold;">${formatarMoeda(reserva.valorTotal)}</td>
            <td>
                <span class="status ${statusClasse}">
                    ${reserva.status || "PENDENTE"}
                </span>
            </td>
            <td>
                <button class="btn-action" onclick="alterarStatus(${id}, '${reserva.status || 'PENDENTE'}')">
                    Ver
                </button>
            </td>
        </tr>
        `;
    });
}

async function alterarStatus(idReserva, statusAtual) {
    const novoStatus = prompt(
        `Status atual: ${statusAtual}\nDigite o novo status (PENDENTE, APROVADO, FINALIZADO ou CANCELADO):`
    );

    if (!novoStatus) return;

    const statusFormatado = novoStatus.trim().toUpperCase();

    try {
        await apiFetch(`/reservas/${idReserva}/status?novoStatus=${encodeURIComponent(statusFormatado)}`, {
            method: "PATCH"
        });

        carregarPedidos();

    } catch (erro) {
        alert("Erro ao atualizar status: " + erro.message);
    }
}

carregarPedidos();