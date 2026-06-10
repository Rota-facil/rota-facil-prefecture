# Estrutura do projeto

A aplicação foi organizada de forma modular para facilitar manutenção, escalabilidade e separação de responsabilidades. Cada diretório possui uma finalidade específica dentro da arquitetura do frontend, permitindo que novas funcionalidades sejam desenvolvidas sem comprometer a organização do projeto.

```text
src
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── atom
│   │   └── default.txt
│   ├── molecules
│   │   └── default.txt
│   ├── organims
│   │   └── default.txt
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── sonner.tsx
│       └── table.tsx
├── hooks
│   └── default.txt
├── lib
│   └── utils.ts
├── service
│   └── default.txt
├── types
│   ├── entites
│   │   └── default.txt
│   ├── request
│   │   └── default.txt
│   └── response
│       └── defaul.txt
└── utils
    └── default.txt
```

## app

O diretório `app` representa o ponto de entrada da aplicação e concentra toda a estrutura de roteamento baseada no App Router do Next.js. É responsável por definir layouts compartilhados, páginas, configurações globais e elementos fundamentais para o funcionamento da interface. Toda nova página do sistema deverá ser criada dentro desta estrutura, respeitando a organização das rotas definidas pelo framework.

## components

O diretório `components` concentra todos os componentes visuais reutilizáveis da aplicação. A sua organização segue os princípios do Atomic Design, permitindo a construção gradual de interfaces através da composição de elementos menores em estruturas mais complexas. Essa abordagem reduz duplicação de código, melhora a consistência visual do sistema e facilita a manutenção da interface ao longo do tempo.

### components/atom

A pasta `atom` contém os componentes mais básicos da aplicação. São elementos visuais simples que possuem uma única responsabilidade e normalmente não dependem de outros componentes para funcionar. Ícones, indicadores, badges, labels e pequenas abstrações de elementos HTML são exemplos de componentes que podem ser armazenados nesta camada.

### components/molecules

A pasta `molecules` agrupa componentes formados pela combinação de múltiplos átomos. Essas estruturas representam pequenas funcionalidades reutilizáveis da interface e geralmente já possuem algum comportamento ou significado dentro do domínio da aplicação. Campos de busca, grupos de inputs, cabeçalhos de cartões e filtros simples são exemplos comuns dessa categoria.

### components/organims

A pasta `organims` reúne estruturas maiores compostas por diversas moléculas e átomos trabalhando em conjunto. Normalmente representam blocos completos da interface, como tabelas administrativas, formulários complexos, barras laterais de navegação, cabeçalhos do sistema ou seções inteiras de uma página. Por serem componentes de maior complexidade, costumam concentrar boa parte da lógica visual relacionada à experiência do usuário.

> Recomenda-se renomear este diretório para `organisms`, alinhando a nomenclatura ao padrão original do Atomic Design.

### components/ui

A pasta `ui` armazena os componentes base disponibilizados pelo Shadcn/UI. Esses componentes servem como fundação visual para o restante da aplicação e podem ser utilizados diretamente ou encapsulados por componentes pertencentes às demais camadas do Atomic Design. Como fazem parte de uma biblioteca externa, normalmente concentram elementos genéricos como botões, inputs, diálogos, tabelas e componentes de feedback visual.

## hooks

O diretório `hooks` centraliza hooks customizados reutilizados em diferentes partes da aplicação. Seu objetivo é encapsular lógica compartilhada, evitando repetição de código entre páginas e componentes. Funcionalidades relacionadas a autenticação, controle de formulários, paginação, gerenciamento de estados locais e integração com APIs podem ser abstraídas nesta camada.

## lib

O diretório `lib` é destinado a configurações compartilhadas e integrações que precisam ser reutilizadas em diferentes módulos da aplicação. Normalmente concentra inicializações de bibliotecas externas, funções auxiliares ligadas a frameworks e configurações globais utilizadas por múltiplas funcionalidades do sistema.

## service

O diretório `service` é responsável pela comunicação com os serviços externos da plataforma. Todas as chamadas para APIs devem ser centralizadas nesta camada, isolando a lógica de acesso a dados da camada de apresentação. Essa separação reduz o acoplamento entre interface e infraestrutura, além de facilitar testes, manutenção e evolução dos contratos de comunicação.

Em um cenário real do Rota Fácil Prefeitura, esta camada poderá conter serviços relacionados ao gerenciamento de alunos, motoristas, veículos, rotas, viagens, autenticação e demais recursos disponibilizados pelo backend.

## types

O diretório `types` concentra todas as definições de tipos e contratos utilizados pela aplicação. Sua existência permite padronizar a comunicação entre frontend e backend, reduzir inconsistências e aumentar a segurança proporcionada pelo TypeScript.

### types/entities

A pasta `entities` armazena as representações das entidades de domínio utilizadas pelo sistema. Essas estruturas refletem os principais conceitos de negócio da plataforma, como alunos, motoristas, veículos, rotas, viagens e demais recursos gerenciados pela prefeitura.

### types/request

A pasta `request` contém os contratos utilizados para envio de dados ao backend. Seu objetivo é representar com clareza quais informações devem ser fornecidas para criação, atualização ou execução de operações disponibilizadas pela API.

### types/response

A pasta `response` armazena os contratos recebidos do backend. Essa organização facilita a identificação das estruturas retornadas pelos serviços e reduz a dependência direta da interface em relação às respostas brutas da API.

## utils

O diretório `utils` concentra funções utilitárias independentes de regras de negócio específicas. São recursos reutilizáveis que auxiliam no processamento de dados, formatação de valores e manipulação de informações utilizadas em diferentes módulos da aplicação.

Funções para formatação de datas, máscaras de documentos, tratamento de strings, transformação de objetos e validações genéricas são exemplos de responsabilidades adequadas para esta camada.
