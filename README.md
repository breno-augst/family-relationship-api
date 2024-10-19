# Family Relationship API
A Family Relationship API é uma API RESTful para gerenciar dados e relacionamentos familiares, permitindo o cadastro e a manutenção de informações de crianças e seus pais.

# Tecnologias
- Node.js e TypeScript: Utilizados para o desenvolvimento da aplicação.
- NestJS: Framework que estrutura a API de forma modular e escalável.
- TypeORM: Biblioteca ORM para interação com o banco de dados relacional.
- Swagger: Documentação automática da API, com suporte a operações CRUD.

# Funcionalidades Principais
## Crianças (/children)
- Criar criança: Registra uma nova criança com informações como CPF, nome, idade, sexo e CPF dos pais.
- Listar todas as crianças: Retorna uma lista completa das crianças cadastradas.
- Buscar por CPF: Encontra uma criança com base em seu CPF.
- Buscar pais por CPF da criança: Retorna os pais relacionados ao CPF de uma criança.
- Atualizar informações: Edita os dados de uma criança pelo CPF.
- Excluir criança: Remove uma criança do sistema pelo CPF.
  
## Pais (/parents)
- Criar pai/mãe: Registra um novo pai ou mãe com informações como CPF, nome, idade e tipo de relacionamento (pai/mãe).
- Listar todos os pais/mães: Retorna uma lista completa dos pais/mães cadastrados.
- Buscar por CPF: Encontra um pai ou mãe com base em seu CPF.
- Buscar filhos pelo CPF do pai/mãe: Lista os filhos associados ao CPF do pai ou mãe.
- Atualizar informações: Edita os dados de um pai/mãe pelo CPF.
- Excluir pai/mãe: Remove um registro de pai ou mãe pelo CPF.

# Endpoints
## Crianças
- POST /children/createChild: Cria uma nova criança.
- GET /children/findAllChildren: Lista todas as crianças.
- GET /children/findChildByCPF?cpf={cpf}: Busca uma criança pelo CPF.
- GET /children/findParentsByChildsCPF/{cpf}: Encontra os pais pelo CPF da criança.
- PATCH /children/updateChild/{cpf}: Atualiza informações de uma criança.
- DELETE /children/deleteChild/{cpf}: Deleta uma criança pelo CPF.

## Pais
- POST /parents/createParent: Cria um novo pai/mãe.
- GET /parents/findAllParents: Lista todos os pais/mães.
- GET /parents/findParentsByCPF?cpf={cpf}: Busca um pai/mãe pelo CPF.
- GET /parents/findChildrenByParentsCPF/{cpf}: Encontra filhos pelo CPF do pai/mãe.
- PATCH /parents/updateParent/{cpf}: Atualiza os dados de um pai/mãe.
- DELETE /parents/deleteParent/{cpf}: Deleta um pai/mãe pelo CPF.

# Como Rodar
### 1. Clone o repositório e instale as dependências:
git clone https://github.com/seu-usuario/family-relationship-api.git
cd family-relationship-api
npm install

### 2. Configure as variáveis de ambiente no arquivo .env.

### 3. Inicie o servidor:
npm run start:dev

### 4. Swagger:
A API estará disponível em http://localhost:3000, com a documentação Swagger acessível em http://localhost:3000/api.

# Licença
MIT License
