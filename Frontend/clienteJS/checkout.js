const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function alterarTipoEntrega() {
    const tipo = document.querySelector('input[name="tipoEntrega"]:checked').value;
    const endereco = document.getElementById("endereco");
    endereco.classList.toggle("oculto", tipo !== "entrega");
    calcularResumo();
}

function calcularResumo() {
    const lista = document.getElementById("itensResumo");
    let subtotal = 0;
    lista.innerHTML = "";

    carrinho.forEach(item => {
        subtotal += item.preco;
        lista.innerHTML += `
            <div class="linha-resumo">
                <span>${item.nome}</span>
                <span>R$ ${item.preco.toFixed(2)}</span>
            </div>
        `;
    });

    const frete = document.querySelector('input[name="tipoEntrega"]:checked').value === "entrega" ? 30 : 0;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("frete").textContent = frete.toFixed(2);
    document.getElementById("total").textContent = (subtotal + frete).toFixed(2);
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

async function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const dataEvento = document.getElementById("dataInicio").value;
    if (!dataEvento) {
        alert("Por favor, selecione a Data Inicial do evento.");
        return;
    }

    const payloadReserva = {
        idCliente: 1, 
        idServico: 1,
        dataEvento: dataEvento,
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
            const reservaCriada = await resposta.json();
            
            alert(`Pedido enviado com sucesso! Número do pedido: ${reservaCriada.idReserva}`);
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