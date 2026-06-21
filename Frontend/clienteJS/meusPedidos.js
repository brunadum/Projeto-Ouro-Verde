const tabela =
    document.getElementById(
        "listaPedidos"
    );

const pedidos = [

    {
        id:1,
        data:"15/06/2026",
        status:"Pendente",
        total:"350,00"
    },

    {
        id:2,
        data:"20/06/2026",
        status:"Confirmado",
        total:"580,00"
    }

];

function carregarPedidos(){

    tabela.innerHTML = "";

    pedidos.forEach(pedido => {

        tabela.innerHTML += `

            <tr>

                <td>
                    ${pedido.id}
                </td>

                <td>
                    ${pedido.data}
                </td>

                <td>
                    ${pedido.status}
                </td>

                <td>
                    R$ ${pedido.total}
                </td>

            </tr>

        `;

    });

}

carregarPedidos();