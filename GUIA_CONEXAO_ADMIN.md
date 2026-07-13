# Guia — Conexão do Admin com o Backend

## O que foi alterado

### Backend (Java/Spring)
- `config/WebConfig.java` **(novo)** — libera CORS para `/api/**`, senão o navegador bloqueia as chamadas do frontend.
- `controller/AdministradorController.java` — adicionado `POST /api/administradores/login`.
- `repository/AdministradorRepository.java` — adicionado `findByEmail`.
- `dto/LoginRequestDTO.java` **(novo)**.
- `controller/CategoriaMaterialController.java` **(novo)** — `GET/POST /api/categorias`, usado no select de categoria da tela de produtos.
- `repository/CategoriaMaterialRepository.java` **(novo)**.
- `model/Administrador.java` e `model/Cliente.java` — a senha não é mais devolvida nas respostas JSON (antes ela vazava, por exemplo, dentro de `reserva.cliente.senha`).

### Banco de dados
- **`admin_setup.sql` (novo, na raiz do projeto)** — a tabela `administrador` não existia em nenhum dos scripts SQL, mas o backend precisa dela pra sequer subir (`ddl-auto=validate`). Rode esse script depois do `script_banco.sql`. Ele já cria um admin de teste:
  - **email:** `admin@ouroverde.com`
  - **senha:** `123456`

### Frontend (telas admin)
- `adminJS/api.js` **(novo)** — concentra a URL da API (`http://localhost:8080/api`) e funções de apoio (`apiFetch`, login/logout, `exigirLogin`).
- `adminHTML/login.html` + `adminJS/login.js` — login agora chama a API de verdade.
- `adminHTML/dashboard.html` + `adminJS/dashboard.js` — cards e tabela carregam dados reais (reservas e materiais).
- `adminHTML/pedidos.html` + `adminJS/pedidos.js` — lista reservas reais e permite mudar o status (botão "Ver").
- `adminHTML/produtos.html` + `adminJS/produtos.js` — formulário cadastra produto de verdade (com select de categoria vindo da API) e uma tabela nova lista os produtos cadastrados, com opção de excluir.
- `dashboard.html`, `pedidos.html` e `produtos.html` agora exigem login (redirecionam para `login.html` se não houver admin logado).

## Como rodar

1. **Banco de dados** (Postgres precisa estar instalado e rodando):
   ```
   psql -U postgres -c "CREATE DATABASE ouro_verde;"
   psql -U postgres -d ouro_verde -f script_banco.sql
   psql -U postgres -d ouro_verde -f admin_setup.sql
   ```
   Confira se usuário/senha em `backend/src/main/resources/application.properties` batem com o seu Postgres.

2. **Backend**:
   ```
   cd backend
   ./mvnw spring-boot:run
   ```
   (No Windows: `mvnw.cmd spring-boot:run`)
   Ele sobe em `http://localhost:8080`. Se a tela ficar cheia de erro `ValidationException`/`SchemaManagementException`, é sinal de que uma tabela não bate com o script SQL — confira o passo 1.

3. **Frontend**: abra `Frontend/adminHTML/login.html` no navegador (duplo clique já funciona).
   Entre com `admin@ouroverde.com` / `123456`.

## Se quiser mudar o endereço do backend
Só troque a constante `API_BASE_URL` no topo do arquivo `Frontend/adminJS/api.js`.

## Limitações que ficaram para depois (fora do pedido inicial)
- Login sem token/sessão — é guardado só no `localStorage` do navegador, sem expiração. Serve para o estágio atual do projeto, mas não é seguro para produção.
- Upload de imagem de produto virou um campo de URL, porque o backend não tem endpoint de upload de arquivo — teria que ser implementado à parte.
- O botão "Ver" em Pedidos troca o status via um `prompt()` simples; dá pra evoluir para um modal mais bonito depois.
