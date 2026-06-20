const categorias = [
    "Todos",
    "Cadeiras",
    "Mesas",
    "Louça",
    "Tecidos"
];

const produtos = [
    {
        nome:"Sofá Marrom",
        preco:50,
        categoria:"Mesas"
    },
    {
        nome:"Mesa Redonda",
        preco:35,
        categoria:"Mesas"
    },
    {
        nome:"Cadeira Tiffany",
        preco:15,
        categoria:"Cadeiras"
    },
    {
        nome:"Taça Cristal",
        preco:5,
        categoria:"Louça"
    },
    {
        nome:"Toalha Bege",
        preco:12,
        categoria:"Tecidos"
    }
];

let carrinho = JSON.parse(
    localStorage.getItem("carrinho")
) || [];

function abrirCarrinho(){
    document
        .getElementById("carrinho-lateral")
        .classList.add("ativo");
}

function fecharCarrinho(){
    document
        .getElementById("carrinho-lateral")
        .classList.remove("ativo");
}

function salvarCarrinho(){
    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );
}

function adicionarCarrinho(nome, preco){

    carrinho.push({
        nome,
        preco
    });

    salvarCarrinho();

    atualizarCarrinho();
}

function atualizarCarrinho(){

    const lista =
        document.getElementById("itens-carrinho");

    const contador =
        document.getElementById("contador");

    const total =
        document.getElementById("total");

    contador.textContent =
        carrinho.length;

    if(carrinho.length === 0){

        lista.innerHTML =
            '<p class="vazio">Seu carrinho está vazio</p>';

        total.textContent =
            "0,00";

        return;
    }

    lista.innerHTML = "";

    let soma = 0;

    carrinho.forEach(item => {

        soma += item.preco;

        lista.innerHTML += `
            <div class="item-carrinho">

                <span>${item.nome}</span>

                <span>
                    R$ ${item.preco.toFixed(2)}
                </span>

            </div>
        `;
    });

    total.textContent =
        soma.toFixed(2);
}

function carregarCategorias(){

    const filtros =
        document.getElementById("filtros");

    categorias.forEach(categoria => {

        filtros.innerHTML += `
            <button onclick="filtrarProdutos('${categoria}')">
                ${categoria}
            </button>
        `;
    });
}

function carregarProdutos(lista){

    const container =
        document.getElementById("lista-produtos");

    container.innerHTML = "";

    lista.forEach(produto => {

        container.innerHTML += `
            <div class="card">

                <div class="imagem"></div>

                <h3>${produto.nome}</h3>

                <p>R$ ${produto.preco.toFixed(2)}</p>

                <div class="estrelas">
                    ★★★★★
                </div>

                <button onclick="adicionarCarrinho('${produto.nome}', ${produto.preco})">
                    Adicionar ao Carrinho
                </button>

            </div>
        `;
    });
}

function filtrarProdutos(categoria){

    if(categoria === "Todos"){

        carregarProdutos(produtos);

        return;
    }

    const filtrados =
        produtos.filter(produto =>
            produto.categoria === categoria
        );

    carregarProdutos(filtrados);
}

carregarCategorias();
carregarProdutos(produtos);
atualizarCarrinho();