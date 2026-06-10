# Como executar o projeto

Antes de iniciar a aplicação, certifique-se de possuir o Node.js instalado em sua máquina. Após clonar o repositório, acesse a pasta do projeto e instale as dependências utilizando o comando abaixo:

```bash
npm install
```

<br>

Com as dependências instaladas, inicie o ambiente de desenvolvimento executando:

```bash
npm run dev
```

<br>

Por questões de infraestrutura e padronização do ecossistema Rota Fácil, esta aplicação foi configurada para utilizar a porta **3001** durante o desenvolvimento. Após a inicialização do servidor, o sistema estará disponível no endereço:

```text
http://localhost:3001
```

Caso seja necessário interromper a execução da aplicação, utilize `CTRL + C` no terminal onde o processo está sendo executado.

<br>
<br>

## Build

Antes de realizar um deploy, recomenda-se gerar uma build de produção para verificar se não existem erros de compilação ou inconsistências na aplicação.

Para gerar a build, execute:

```bash
npm run build
```

Ao final do processo, o Next.js realizará a compilação da aplicação e exibirá informações sobre as rotas geradas e os recursos otimizados para produção.

<br>
<br>

## Deploy

Após a geração da build, a aplicação pode ser iniciada em modo de produção através do comando:

```bash
npm run start
```

Este comando executa a versão otimizada gerada pelo processo de build, simulando o comportamento utilizado nos ambientes de homologação e produção.

O processo de deploy poderá variar de acordo com a infraestrutura utilizada pela equipe, porém a geração da build deve sempre ser realizada antes da publicação de novas versões para garantir que a aplicação esteja apta para execução em ambiente produtivo.
