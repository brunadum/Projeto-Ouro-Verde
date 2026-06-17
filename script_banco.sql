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
                          url_imagem VARCHAR(255), -- Coluna nova adicionada
                          CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES Categoria_Material(id_categoria)
);

CREATE TABLE Servico (
                         id_servico SERIAL PRIMARY KEY,
                         nome VARCHAR(100) NOT NULL,
                         descricao TEXT,
                         preco_base NUMERIC(10, 2) NOT NULL,
                         url_imagem VARCHAR(255) -- Coluna nova adicionada
);

CREATE TABLE Cliente (
                         id_cliente SERIAL PRIMARY KEY,
                         nome VARCHAR(150) NOT NULL,
                         cpf_cnpj VARCHAR(20) UNIQUE NOT NULL,
                         email VARCHAR(150) UNIQUE, -- Coluna nova adicionada
                         senha VARCHAR(100),        -- Coluna nova adicionada
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
                         valor_total NUMERIC(10, 2),
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
                         status_pagamento VARCHAR(50) DEFAULT 'PENDENTE', -- Coluna de controle
                         data_pagamento DATE,                             -- Coluna de controle
                         PRIMARY KEY (id_reserva, numero_parcela),
                         CONSTRAINT fk_reserva_parcela FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva) ON DELETE CASCADE
);


INSERT INTO categoria_material (nome) VALUES
                                          ('Móveis'),
                                          ('Decoração'),
                                          ('Iluminação');

INSERT INTO material (id_categoria, nome, preco_unitario, quantidade_estoque, url_imagem) VALUES
                                                                                              (1, 'Sofá Marrom Premium', 150.00, 10, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'),
                                                                                              (1, 'Cadeira de Ferro', 15.00, 100, 'https://images.unsplash.com/photo-1506434304575-faa2220138dc?auto=format&fit=crop&w=800&q=80'),
                                                                                              (1, 'Mesa de Madeira Rústica', 80.00, 20, 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=800&q=80'),
                                                                                              (2, 'Arranjo de Flores Brancas', 45.00, 30, 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80'),
                                                                                              (3, 'Cortina de LED Cascata', 60.00, 15, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80');

INSERT INTO servico (nome, descricao, preco_base, url_imagem) VALUES
                                                                  ('Salão Ouro', 'Salão principal climatizado para grandes eventos e casamentos', 1500.00, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'),
                                                                  ('Espaço Jardim', 'Área externa arborizada, ideal para eventos diurnos', 800.00, 'https://images.unsplash.com/photo-1530103862676-de8c9de0f8db?auto=format&fit=crop&w=800&q=80'),
                                                                  ('Área de Churrasco', 'Espaço com piscina e churrasqueira para confraternizações', 500.00, 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80');

INSERT INTO cliente (nome, cpf_cnpj, email, senha, cep, rua, numero, bairro, cidade) VALUES
                                                                                         ('Maria Larissa', '111.222.333-44', 'larissa@email.com', 'senha123', '63700-000', 'Rua Doutor Moreira da Rocha', '100', 'Centro', 'Crateús'),
                                                                                         ('João Pedro', '555.666.777-88', 'joao@email.com', 'senha123', '63700-000', 'Rua Firmino Rosa', '250', 'Fátima', 'Crateús'),
                                                                                         ('Empresa Eventos S/A', '12.345.678/0001-90', 'contato@eventos.com', 'senha123', '63700-000', 'Av. Sargento Hermínio', '1500', 'São Vicente', 'Crateús');