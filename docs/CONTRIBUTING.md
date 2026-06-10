# Como contribuir

Agradecemos o interesse em contribuir com o desenvolvimento do Rota Fácil Prefeitura.

O objetivo deste documento é definir um fluxo de trabalho padronizado para garantir consistência, qualidade e previsibilidade durante o desenvolvimento da aplicação.

<br>

## Fluxo de desenvolvimento

Toda nova funcionalidade, correção ou melhoria deve ser desenvolvida em uma branch derivada da branch principal de desenvolvimento.

Exemplos:

```bash
feat/create-student-page
feat/create-driver-form
fix/login-validation
refactor/sidebar-component
```

<br>

## Padrões de código

O projeto utiliza ferramentas de análise estática e formatação automática para garantir a qualidade do código.

Antes de enviar alterações, execute as validações do projeto para garantir que não existam erros de lint, tipagem ou build.

<br>

## Commits

Utilize mensagens de commit claras e descritivas.

Exemplos:

```bash
feat: create students management page
feat: add route registration form
fix: resolve login validation issue
refactor: simplify sidebar navigation
```

<br>

## Pull Requests

Ao abrir um Pull Request:

- descreva claramente o objetivo da alteração;
- informe possíveis impactos em funcionalidades existentes;
- inclua capturas de tela quando houver alterações visuais;
- mantenha o Pull Request focado em uma única responsabilidade.

<br>

## Revisão de código

Toda alteração deve passar por revisão antes da integração ao fluxo principal de desenvolvimento.

O objetivo da revisão é garantir qualidade, padronização e alinhamento arquitetural entre os módulos da aplicação.
