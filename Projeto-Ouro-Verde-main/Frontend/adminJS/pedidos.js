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

    window.location.href =
    "login.html";

});

/* DADOS TEMPORÁRIOS */

const pedidos = [

    {
        id:1,
        cliente:"João Silva",
        produto:"Cadeira Tiffany",
        periodo:"3 dias",
        entrega:"25/06/2026",
        total:"R$ 350,00",
        status:"pendente"
    },

    {
        id:2,
        cliente:"Maria Souza",
        produto:"Mesa Redonda",
        periodo:"2 dias",
        entrega:"28/06/2026",
        total:"R$ 220,00",
        status:"aprovado"
    }

];

const tbody =
document.getElementById("pedidosTable");

function carregarPedidos(){

    tbody.innerHTML = "";

    pedidos.forEach(pedido => {

        tbody.innerHTML += `
        <tr>

            <td>${pedido.id}</td>

            <td>${pedido.cliente}</td>

            <td>${pedido.produto}</td>

            <td>${pedido.periodo}</td>

            <td>${pedido.entrega}</td>

            <td>${pedido.total}</td>

            <td>
                <span class="status ${pedido.status}">
                    ${pedido.status}
                </span>
            </td>

            <td>
                <button class="btn-action">
                    Ver
                </button>
            </td>

        </tr>
        `;

    });

}

carregarPedidos();