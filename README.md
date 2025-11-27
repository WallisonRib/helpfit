# HelpFit

Bem-vindo ao **HelpFit**, uma plataforma completa para Personal Trainers gerenciarem seus alunos, avaliações físicas e planos de treino.

## Visão Geral

O HelpFit foi desenvolvido para facilitar a comunicação e o acompanhamento entre treinadores e seus alunos. A plataforma oferece duas experiências distintas: uma para o **Professor (Personal Trainer)** e outra para o **Usuário Comum (Aluno)**.

## Casos de Uso

### 1. Professor (Personal Trainer)

O Professor tem acesso a um painel administrativo completo para gerenciar seus alunos.

*   **Dashboard**: Visão geral dos alunos e atividades recentes.
*   **Gestão de Alunos**:
    *   **Cadastrar Alunos**: Adicionar novos alunos ao sistema.
    *   **Listar Alunos**: Visualizar todos os alunos vinculados.
    *   **Perfil do Aluno**: Acessar detalhes específicos de cada aluno.
*   **Avaliações Físicas**:
    *   **Criar Avaliação**: Registrar dados antropométricos (peso, altura, dobras cutâneas) para calcular o percentual de gordura e acompanhar o progresso.
    *   **Histórico**: Visualizar a evolução física do aluno ao longo do tempo.
*   **Planos de Treino**:
    *   **Criar Treino**: Prescrever treinos personalizados para os alunos.
    *   **Gerenciar Treinos**: Editar ou atualizar rotinas de exercícios.

### 2. Usuário Comum (Aluno)

O Aluno tem acesso a uma área exclusiva para acompanhar seu desenvolvimento e acessar seus treinos.

*   **Dashboard**: Visão rápida do seu progresso e treinos atuais.
*   **Meus Treinos**: Acesso fácil aos planos de treino prescritos pelo professor, com detalhes dos exercícios.
*   **Minhas Avaliações**: Visualização dos resultados das avaliações físicas, permitindo acompanhar a evolução da composição corporal e medidas.

## Tecnologias Utilizadas

*   **Frontend**: Next.js, React, Tailwind CSS
*   **Backend**: Next.js API Routes
*   **Banco de Dados**: SQLite (com Prisma ORM)
*   **Autenticação**: NextAuth.js

## Como Rodar o Projeto

1.  Instale as dependências:
    ```bash
    npm install
    ```

2.  Configure o banco de dados:
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```

3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

4.  Acesse `http://localhost:3000` no seu navegador.
