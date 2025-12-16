# Tech4Bike Frontend

Frontend desenvolvido com Next.js 15 para o sistema de gestão de manutenção de bicicletas Tech4Bike.

## Descrição do Projeto

Interface moderna e responsiva para gerenciamento completo de bicicletas e manutenções. O sistema oferece dashboard com estatísticas visuais, CRUD completo de bicicletas e manutenções, busca de oficinas por CEP e filtros avançados.

## Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Recharts** - Gráficos e visualizações
- **Axios** - Cliente HTTP
- **date-fns** - Manipulação de datas

## Diferenciais Competitivos

1. **Dashboard com Estatísticas Visuais**
   - Cards informativos com métricas principais
   - Gráficos de linha para evolução de gastos
   - Gráficos de barras para quantidade de manutenções
   - Tabela de manutenções recentes

2. **Timeline Visual de Manutenções**
   - Visualização cronológica ordenada
   - Filtros por bicicleta e tipo de serviço
   - Informações completas em cards organizados

3. **Busca Inteligente de Oficinas**
   - Integração com ViaCEP via backend
   - Autocompletar endereço ao buscar CEP
   - Interface intuitiva para localização

4. **Design Minimalista e Robusto**
   - Interface limpa e profissional
   - Suporte a modo escuro
   - Responsivo para todos os dispositivos
   - Navegação intuitiva

## Estrutura do Projeto

```
tech4bike-frontend/
├── src/
│   ├── app/                    # App Router do Next.js
│   │   ├── bikes/             # Páginas de bicicletas
│   │   ├── maintenances/      # Páginas de manutenções
│   │   ├── workshops/         # Busca de oficinas
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Dashboard
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Navigation.tsx
│   │   └── StatsCard.tsx
│   ├── lib/                   # Utilitários
│   │   └── api.ts            # Cliente API
│   └── types/                 # Tipos TypeScript
│       └── index.ts
├── Dockerfile
├── next.config.ts
├── package.json
└── README.md
```

## Instalação

### Pré-requisitos

- Node.js 20 ou superior
- npm ou yarn
- Docker (opcional)

### Instalação Local

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd tech4bike-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e configure:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse http://localhost:3000

## Execução

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

### Docker

**Opção 1: Docker direto**

1. Construa a imagem:
```bash
docker build -t tech4bike-frontend .
```

2. Execute o container:
```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 tech4bike-frontend
```

**Opção 2: Docker Compose com Frontend + Backend (recomendado)**

O `docker-compose.yml` na raiz do repositório orquestra **ambos os serviços** (frontend e backend):

1. Execute com docker-compose:
```bash
docker-compose up --build
```

Isso irá:
- Construir e iniciar o backend na porta 8000
- Construir e iniciar o frontend na porta 3000
- Configurar a comunicação entre eles automaticamente
- Persistir o banco de dados SQLite em `../tech4bike-backend/data`

2. Acesse a aplicação:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentação Swagger: http://localhost:8000/docs

**Estrutura do docker-compose:**

- **Backend:** Serviço FastAPI rodando na porta 8000
- **Frontend:** Serviço Next.js rodando na porta 3000
- **Comunicação:** Frontend se comunica com backend usando `http://backend:8000/api/v1` (nome do serviço Docker)
- **Volumes:** Banco de dados SQLite persistido no diretório `../tech4bike-backend/data`

**Nota:** O docker-compose está na raiz do repositório do frontend (componente principal), conforme requisito do MVP.

**Sobre o Dockerfile:**

O Dockerfile utiliza **multistage building** otimizado para Next.js:
- **Stage 1 (deps):** Instala apenas as dependências
- **Stage 2 (builder):** Faz o build da aplicação com `output: standalone`
- **Stage 3 (runner):** Imagem final leve apenas com os arquivos necessários

O modo `standalone` do Next.js cria uma versão otimizada que inclui apenas os arquivos necessários para produção, resultando em uma imagem menor e mais rápida.

## Funcionalidades

### Dashboard (`/`)
- Estatísticas gerais (total de bicicletas, manutenções, gastos)
- Gráficos de evolução de gastos e manutenções
- Lista de manutenções recentes

### Bicicletas (`/bikes`)
- Listagem de todas as bicicletas
- Criação de nova bicicleta (`/bikes/new`)
- Edição de bicicleta (`/bikes/[id]/edit`)
- Exclusão de bicicleta

### Manutenções (`/maintenances`)
- Listagem de todas as manutenções
- Filtros por bicicleta e tipo de serviço
- Ordenação cronológica (mais recentes primeiro)
- Criação de nova manutenção (`/maintenances/new`)
- Edição de manutenção (`/maintenances/[id]/edit`)
- Exclusão de manutenção
- Busca de endereço por CEP ao cadastrar oficina

### Oficinas (`/workshops`)
- Busca de endereço por CEP
- Integração com ViaCEP via backend
- Visualização completa do endereço encontrado

## Chamadas HTTP Implementadas

- **GET** `/api/v1/bikes` - Listar bicicletas
- **GET** `/api/v1/bikes/{id}` - Obter bicicleta
- **POST** `/api/v1/bikes` - Criar bicicleta
- **PUT** `/api/v1/bikes/{id}` - Atualizar bicicleta
- **DELETE** `/api/v1/bikes/{id}` - Excluir bicicleta
- **GET** `/api/v1/maintenances` - Listar manutenções
- **GET** `/api/v1/maintenances/{id}` - Obter manutenção
- **POST** `/api/v1/maintenances` - Criar manutenção
- **PUT** `/api/v1/maintenances/{id}` - Atualizar manutenção
- **DELETE** `/api/v1/maintenances/{id}` - Excluir manutenção
- **GET** `/api/v1/address/{cep}` - Buscar endereço por CEP

## Diagrama de Arquitetura

```
┌─────────────────────┐
│   Frontend (Next.js)│
│                     │
│  ┌───────────────┐  │
│  │  Dashboard    │  │
│  │  - Stats      │  │
│  │  - Charts     │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │  Pages        │  │
│  │  - Bikes      │  │
│  │  - Maintenances│ │
│  │  - Workshops  │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │  API Client   │  │
│  │  (Axios)      │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │ HTTP REST
           │
┌──────────▼──────────┐
│  Backend API        │
│  (FastAPI)          │
└─────────────────────┘
```

## Convenções de Código

- **Componentes:** PascalCase (ex: `Navigation.tsx`)
- **Arquivos:** kebab-case ou PascalCase para componentes
- **Variáveis e funções:** camelCase
- **Tipos/Interfaces:** PascalCase
- **Comentários:** Apenas quando necessário
- **Código:** Inglês
- **Documentação:** Português

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa linter (Biome)
- `npm run format` - Formata código

## Licença

Este projeto é parte de um MVP acadêmico.
