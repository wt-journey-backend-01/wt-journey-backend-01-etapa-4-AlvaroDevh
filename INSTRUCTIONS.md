Instruções para rodar o projeto
1. Pré-requisitos
Node.js (>= 18)

Docker e Docker Compose

npm ou yarn

2. Configurar variáveis de ambiente
Crie um arquivo .env na raiz do projeto com os seguintes valores:

env
Copiar
Editar
# Banco de dados
POSTGRES_USER=meuuser
POSTGRES_PASSWORD=123456
POSTGRES_DB=meubanco
POSTGRES_PORT=5432

# JWT
JWT_SECRET=minhachavesecreta
JWT_EXPIRES_IN=1d
3. Subir o banco de dados com Docker
Na raiz do projeto, execute:

bash
Copiar
Editar
docker-compose up -d
Isso vai subir um container do PostgreSQL rodando na porta 5432.

4. Rodar migrations e seeds
Com o banco no ar, rode:

bash
Copiar
Editar
npx knex migrate:latest
npx knex seed:run
Isso vai criar as tabelas necessárias e inserir dados iniciais (seeds).

5. Rodar a API
Inicie o servidor Node:

bash
Copiar
Editar
npm install
npm run dev
O servidor ficará disponível em http://localhost:3000.

6. Rotas principais da API
Autenticação
Registrar usuário
http
Copiar
Editar
POST /auth/register
Content-Type: application/json

{
  "nome": "João",
  "email": "joao@email.com",
  "senha": "123456"
}
Login
http
Copiar
Editar
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "123456"
}
Resposta:

json
Copiar
Editar
{
  "token": "seu_jwt_token_aqui"
}
Guarde esse token para acessar rotas protegidas.

Logout
http
Copiar
Editar
POST /auth/logout
Authorization: Bearer seu_jwt_token
Usuários
Listar usuários
http
Copiar
Editar
GET /users
Authorization: Bearer seu_jwt_token
Deletar usuário
http
Copiar
Editar
DELETE /users/:id
Authorization: Bearer seu_jwt_token
7. Como passar o token JWT
Nas rotas protegidas, adicione o header:

http
Copiar
Editar
Authorization: Bearer seu_jwt_token
8. Testes rápidos com cURL ou Insomnia
Exemplo cURL – criar usuário
bash
Copiar
Editar
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria","email":"maria@email.com","senha":"123456"}'
Exemplo cURL – login
bash
Copiar
Editar
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","senha":"123456"}'