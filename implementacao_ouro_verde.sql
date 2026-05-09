DROP TABLE IF EXISTS Parcela;
DROP TABLE IF EXISTS Reserva_Material;
DROP TABLE IF EXISTS Reserva CASCADE;
DROP TABLE IF EXISTS Telefone_Cliente;
DROP TABLE IF EXISTS Cliente CASCADE;
DROP TABLE IF EXISTS Servico CASCADE;
DROP TABLE IF EXISTS Material CASCADE;
DROP TABLE IF EXISTS Categoria_Material CASCADE;

CREATE TABLE Categoria_Material (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE Material (
    id_material SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    quantidade_estoque INT NOT NULL,
    preco_unitario NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES Categoria_Material(id_categoria)
);

CREATE TABLE Servico (
    id_servico SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco_base NUMERIC(10, 2) NOT NULL
);

CREATE TABLE Cliente (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
    rua VARCHAR(150),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    cep VARCHAR(20)
);

CREATE TABLE Telefone_Cliente (
    id_telefone SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    numero VARCHAR(20) NOT NULL,
    CONSTRAINT fk_cliente_telefone FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE Reserva (
    id_reserva SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_servico INT NOT NULL,
    data_solicitacao DATE DEFAULT CURRENT_DATE,
    data_evento DATE NOT NULL,
    data_hora_evento TIMESTAMP, 
    status VARCHAR(50) NOT NULL,
    valor_total NUMERIC(10, 2), -- Atributo derivado
    CONSTRAINT fk_cliente_reserva FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
    CONSTRAINT fk_servico_reserva FOREIGN KEY (id_servico) REFERENCES Servico(id_servico)
);

CREATE TABLE Reserva_Material (
    id_reserva INT NOT NULL,
    id_material INT NOT NULL,
    quantidade_alocada INT NOT NULL,
    preco_no_momento NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (id_reserva, id_material),
    CONSTRAINT fk_reserva_mat FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva) ON DELETE CASCADE,
    CONSTRAINT fk_material_res FOREIGN KEY (id_material) REFERENCES Material(id_material)
);

CREATE TABLE Parcela (
    id_reserva INT NOT NULL,
    numero_parcela INT NOT NULL,
    data_vencimento DATE NOT NULL,
    valor_parcela NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (id_reserva, numero_parcela),
    CONSTRAINT fk_reserva_parcela FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva) ON DELETE CASCADE
);

