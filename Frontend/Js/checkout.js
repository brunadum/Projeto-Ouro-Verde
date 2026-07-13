let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

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

async function enviarReservaParaOJava(event) {
    event.preventDefault(); 
    if (carrinho.length === 0) {
        alert("O seu carrinho está vazio! Adicione produtos antes de finalizar.");
        return;
    }

    const dataDigitada = document.getElementById("data-evento").value;
    if (!dataDigitada) {
        alert("Por favor, selecione a data do evento.");
        return;
    }

    const payloadReserva = {
        idCliente: 1, 
        idServico: 1, 
        dataEvento: dataDigitada,
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
            alert("Reserva realizada com sucesso! Ouro Verde Buffet agradece.");
            
            localStorage.removeItem("carrinho");
            window.location.href = "index.html";
        } else {
            alert("Erro ao criar reserva: Estoque insuficiente ou dados inválidos.");
        }

    } catch (erro) {
        console.error("Erro na comunicação com o servidor:", erro);
        alert("Não foi possível conectar ao servidor Java.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-checkout");
    if (formulario) {
        formulario.addEventListener("submit", enviarReservaParaOJava);
    }
});