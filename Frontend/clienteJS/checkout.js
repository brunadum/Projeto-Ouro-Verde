const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function calcularResumo() {
    const lista = document.getElementById("itensResumo");
    let subtotal = 0;
    
    if (lista) lista.innerHTML = "";

    carrinho.forEach(item => {
        const precoItem = typeof item.preco === 'number' ? item.preco : parseFloat(item.preco) || 0;
        subtotal += precoItem;
        
        if (lista) {
            lista.innerHTML += `
                <div class="linha-resumo">
                    <span>${item.nome}</span>
                    <span>R$ ${precoItem.toFixed(2)}</span>
                </div>
            `;
        }
    });

    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (totalEl) totalEl.textContent = subtotal.toFixed(2);
}

function agruparItensParaOBackend() {
    const itensAgrupados = {};

    carrinho.forEach(item => {
        if (itensAgrupados[item.idMaterial]) {
            itensAgrupados[item.idMaterial].quantidade += 1;
        } else {
            itensAgrupados[item.idMaterial] = {
                idMaterial: item.idMaterial,
                quantidade: 1
            };
        }
    });

    return Object.values(itensAgrupados);
}

async function finalizarPedido(event) {
    if (event) event.preventDefault(); 

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if (!nome || !email || !telefone) {
        alert("Por favor, preencha todos os seus campos de identificação (Nome, E-mail e Telefone).");
        return;
    }

    const dataEvento = document.getElementById("dataInicio").value;
    if (!dataEvento) {
        alert("Por favor, selecione a Data Inicial do evento.");
        return;
    }

    const totalTexto = document.getElementById("total").textContent;
    const totalNumerico = parseFloat(totalTexto);

    const payloadReserva = {
        idCliente: 1, 
        idServico: 1,
        dataEvento: dataEvento,
        valorTotal: totalNumerico,
        materiais: agruparItensParaOBackend()
    };

    try {
        const resposta = await fetch('http://localhost:8080/api/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadReserva)
        });

        if (resposta.ok) {
            const metodoEscolhido = document.querySelector('input[name="metodoPagamento"]:checked').value;
            
            localStorage.setItem("pagamentoEscolhido", metodoEscolhido);
            
            alert("Pedido enviado com sucesso! Ouro Verde Buffet agradece.");
            localStorage.removeItem("carrinho");
            
            window.location.href = "sucesso.html"; 
        } else {
            alert("Erro ao criar reserva. Pode não haver estoque suficiente.");
        }

    } catch (erro) {
        console.error("Erro na integração com o Java:", erro);
        alert("Falha na conexão. O servidor Java está rodando na porta 8080?");
    }
}

calcularResumo();

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-checkout");
    if (formulario) {
        formulario.addEventListener("submit", finalizarPedido);
    }
});