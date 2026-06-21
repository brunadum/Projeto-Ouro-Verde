const carrinho =
    JSON.parse(
        localStorage.getItem("carrinho")
    ) || [];

function alterarTipoEntrega(){

    const tipo =
        document.querySelector(
            'input[name="tipoEntrega"]:checked'
        ).value;

    const endereco =
        document.getElementById("endereco");

    endereco.classList.toggle(
        "oculto",
        tipo !== "entrega"
    );

    calcularResumo();
}

function calcularResumo(){

    const lista =
        document.getElementById("itensResumo");

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

    const frete =
        document.querySelector(
            'input[name="tipoEntrega"]:checked'
        ).value === "entrega"
        ? 30
        : 0;

    document.getElementById("subtotal")
        .textContent =
        subtotal.toFixed(2);

    document.getElementById("frete")
        .textContent =
        frete.toFixed(2);

    document.getElementById("total")
        .textContent =
        (subtotal + frete).toFixed(2);
}

function finalizarPedido(){

    alert(
        "Pedido enviado com sucesso!"
    );

    localStorage.removeItem(
        "carrinho"
    );

    window.location.href =
        "sucesso.html";
}

calcularResumo();