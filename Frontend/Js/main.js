const categorias = [
    "Todos",
    "Cadeiras",
    "Mesas",
    "Louça",
    "Tecidos"
];

let produtos = [];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function abrirCarrinho() {
    document.getElementById("carrinho-lateral").classList.add("ativo");
}

function fecharCarrinho() {
    document.getElementById("carrinho-lateral").classList.remove("ativo");
}

function irParaCatalogo() {
    document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
}

function finalizarCompra() {
    window.location.href = "clienteHTML/checkout.html";
}

function salvarCarrinho() {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarCarrinho(idMaterial, nome, preco) {
    carrinho.push({ idMaterial, nome, preco });
    salvarCarrinho();
    atualizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById("itens-carrinho");
    const contador = document.getElementById("contador");
    const total = document.getElementById("total");

    contador.textContent = carrinho.length;

    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="vazio">Seu carrinho está vazio</p>';
        total.textContent = "0,00";
        return;
    }

    lista.innerHTML = "";
    let soma = 0;

    carrinho.forEach((item, index) => {
        soma += item.preco;
        lista.innerHTML += `
            <div class="item-carrinho">
                <div>
                    <strong>${item.nome}</strong>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                </div>
                <button class="btn-remover" onclick="removerItem(${index})">✕</button>
            </div>
        `;
    });

    total.textContent = soma.toFixed(2);
}

function carregarCategorias() {
    const filtros = document.getElementById("filtros");
    filtros.innerHTML = "";
    categorias.forEach(categoria => {
        filtros.innerHTML += `
            <button onclick="filtrarProdutos('${categoria}')">${categoria}</button>
        `;
    });
}

function carregarProdutos(lista) {
    const container = document.getElementById("lista-produtos");
    container.innerHTML = "";

    lista.forEach(produto => {
        container.innerHTML += `
            <div class="card">
                <div class="imagem"></div>
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.precoUnitario.toFixed(2)}</p>
                <p style="font-size: 13px; color: #555;">Estoque: ${produto.quantidadeEstoque} un.</p>
                <div class="estrelas">★★★★★</div>
                <button onclick="adicionarCarrinho(${produto.idMaterial}, '${produto.nome}', ${produto.precoUnitario})">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
    });
}

function filtrarProdutos(categoria) {
    if (categoria === "Todos") {
        carregarProdutos(produtos);
        return;
    }
    const filtrados = produtos.filter(produto => produto.categoria === categoria);
    carregarProdutos(filtrados);
}

async function buscarMateriaisDoBanco() {
    try {
        const resposta = await fetch('http://localhost:8080/api/materiais');
        const materiaisReais = await resposta.json();
        
        produtos = materiaisReais;
        
        carregarProdutos(produtos);
    } catch (erro) {
        console.error("Erro ao conectar com o Java. Verifique se o backend está rodando!", erro);
        document.getElementById("lista-produtos").innerHTML = 
            "<p style='color: red;'>Erro ao carregar os produtos. O servidor Java está desligado.</p>";
    }
}

carregarCategorias();
atualizarCarrinho();

buscarMateriaisDoBanco();