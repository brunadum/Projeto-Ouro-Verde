async function carregarPedidosReais() {
    const corpoTabela = document.getElementById("listaPedidos");
    
    if(corpoTabela) {
        corpoTabela.innerHTML = '<tr><td colspan="4" style="text-align:center;">Buscando pedidos no servidor...</td></tr>';
    }

    try {
        const resposta = await fetch('http://localhost:8080/api/reservas');

        if (resposta.ok) {
            const listaReservas = await resposta.json();
            
            corpoTabela.innerHTML = "";

            if (listaReservas.length === 0) {
                corpoTabela.innerHTML = '<tr><td colspan="4" style="text-align:center;">Você ainda não possui pedidos.</td></tr>';
                return;
            }

            listaReservas.forEach(reserva => {
                const id = reserva.idReserva || reserva.id || "N/A";
                
                let dataFormatada = "N/A";
                if (reserva.dataEvento) {
                    if (Array.isArray(reserva.dataEvento)) {
                        const ano = reserva.dataEvento[0];
                        const mes = String(reserva.dataEvento[1]).padStart(2, '0');
                        const dia = String(reserva.dataEvento[2]).padStart(2, '0');
                        dataFormatada = `${dia}/${mes}/${ano}`;
                    } else if (typeof reserva.dataEvento === 'string' && reserva.dataEvento.includes('-')) {
                        const dataApenas = reserva.dataEvento.split('T')[0]; 
                        const partes = dataApenas.split('-');
                        dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
                    } else {
                        dataFormatada = reserva.dataEvento;
                    }
                }

                const status = reserva.status || "PENDENTE";
                
                const valor = reserva.valorTotal || reserva.total || reserva.valor || reserva.precoTotal;
                
                let totalFormatado = "A calcular";
                if (valor !== undefined && valor !== null) {
                    totalFormatado = `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
                }
                
                corpoTabela.innerHTML += `
                    <tr>
                        <td>${id}</td>
                        <td>${dataFormatada}</td>
                        <td style="color: #b71c1c; font-weight: bold;">${status}</td>
                        <td style="font-weight: bold;">${totalFormatado}</td>
                    </tr>
                `;
            });

        } else {
            corpoTabela.innerHTML = '<tr><td colspan="4" style="text-align:center; color: red;">Erro ao buscar pedidos do servidor.</td></tr>';
        }

    } catch (erro) {
        console.error("Erro de conexão:", erro);
        corpoTabela.innerHTML = '<tr><td colspan="4" style="text-align:center; color: red;">Falha de conexão com o servidor Java.</td></tr>';
    }
}

document.addEventListener("DOMContentLoaded", carregarPedidosReais);