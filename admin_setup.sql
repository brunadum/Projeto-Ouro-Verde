-- ==========================================================
-- Cria a tabela "administrador", que o backend já espera
-- (models/AdministradorController) mas que não existia em
-- nenhum dos scripts do banco (script_banco.sql ou
-- implementacao_ouro_verde.sql).
--
-- Rode este script no banco "ouro_verde" DEPOIS de rodar o
-- script_banco.sql.
-- ==========================================================

DROP TABLE IF EXISTS administrador;

CREATE TABLE administrador (
    id_admin SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Admin de teste para você conseguir logar na tela admin
-- (mesmas credenciais que já estavam "hardcoded" no login.js)
INSERT INTO administrador (nome, email, senha) VALUES
    ('Administrador', 'admin@ouroverde.com', '123456');
