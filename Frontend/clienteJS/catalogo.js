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
        categoria:"Mesas",
        imagem: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60"
    },
    {
        nome:"Mesa Redonda",
        preco:35,
        categoria:"Mesas",
        imagem: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500&auto=format&fit=crop&q=60"
    },
    {
        nome:"Cadeira Tiffany",
        categoria:"Cadeiras",
        preco:15,
        imagem: "https://images.unsplash.com/photo-1503602642458-232111445657?w=500&auto=format&fit=crop&q=60"
    },
    {
        nome:"Taça Cristal",
        preco:5,
        categoria:"Louça",
        imagem: "https://images.unsplash.com/photo-1538592116845-11eeeb905780?w=500&auto=format&fit=crop&q=60"
    },
    {
        nome:"Toalha Bege",
        preco:12,
        categoria:"Tecidos",
        imagem: "https://images.unsplash.com/photo-1584824486509-112e4181f1ce?w=500&auto=format&fit=crop&q=60"
    }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function abrirCarrinho(){
    document.getElementById("carrinho-lateral").classList.add("ativo");
}

function fecharCarrinho(){
    document.getElementById("carrinho-lateral").classList.remove("ativo");
}

function salvarCarrinho(){
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarCarrinho(nome, preco){
    carrinho.push({ nome, preco });
    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarCarrinho(){
    const lista = document.getElementById("itens-carrinho");
    const contador = document.getElementById("contador");
    const total = document.getElementById("total");

    contador.textContent = carrinho.length;

    if(carrinho.length === 0){
        lista.innerHTML = '<p class="vazio">Seu carrinho está vazio</p>';
        total.textContent = "0,00";
        return;
    }

    lista.innerHTML = "";
    let soma = 0;

    carrinho.forEach(item => {
        soma += item.preco;
        lista.innerHTML += `
            <div class="item-carrinho">
                <span>${item.nome}</span>
                <span>R$ ${item.preco.toFixed(2)}</span>
            </div>
        `;
    });

    total.textContent = soma.toFixed(2);
}

function carregarCategorias(){
    const filtros = document.getElementById("filtros");
    categorias.forEach(categoria => {
        filtros.innerHTML += `
            <button onclick="filtrarProdutos('${categoria}')">
                ${categoria}
            </button>
        `;
    });
}

function carregarProdutos(lista){
    const container = document.getElementById("lista-produtos");
    container.innerHTML = "";

    lista.forEach(produto => {

        container.innerHTML += `
            <div class="card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="imagem" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;">
                
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco.toFixed(2)}</p>
                <div class="estrelas">★★★★★</div>
                
                <button onclick="adicionarCarrinho('${produto.nome}',${produto.preco})">
                    Adicionar
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
    const filtrados = produtos.filter(produto => produto.categoria === categoria);
    carregarProdutos(filtrados);
}

function irCheckout(){
    window.location.href = "checkout.html";
}

carregarCategorias();
carregarProdutos(produtos);
atualizarCarrinho();