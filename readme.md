# 🛠️ Desafio
<p>
O desafio é construir o primeiro produto da Aerocode, um sistema CLI em TypeScript para gerenciar a produção de aeronaves. Conforme as especificações, o sistema precisa contemplar o cadastro e controle de aeronaves, peças, etapas de produção, funcionários com autenticação e testes. Além disso, ele deve gerar um relatório final e persistir todos os dados em arquivos de texto. O código abaixo implementa fielmente o Diagrama UML fornecido.
</p>

## 📋 Pré-requisitos
- Node.js (versão 18 ou superior).
- npm (incluído com o Node.js).

---

## 🚀 Como rodar o projeto

## 1. Entre na pasta source
cd src

## 2. Instale as dependências
npm install

## 3. Compile o TypeScript
npm run build

## 4. Execute o sistema
npm start

### 🔑 Login padrão (criado automaticamente na 1ª execução)

---

| Usuário | Senha | Nível |
| :---------: | :---------: | :---------: |
| admin | admin123 | Administrador |

## Como Usar
Após iniciar o programa, digite os números de acordo com a operação desejada:
```
[1] Aeronaves
[2] Pecas
[3] Etapas de Producao
[4] Testes
[5] Funcionarios
[6] Gerar Relatorio Final
[7] Sair / Logout
```

### Operações disponíveis:
- Cadastrar: Possibilita o cadastro de aeronaves, peças, etapas de processo, testes das aeronaves e funcionários.
- Listar: Possibilita a listagem de todas as aeronaves, peças, etapas de uma aeronave, testes nas aeronaves, funcionários com seus níveis de permissões e dados pessoais.
- Atualizar: Possibilita atualizar o status de uma peça.
- Relatório: Gera um relatório de uma aeronave a partir do nome do cliente, data de entrega da aeronave. Mostrando mais aprofundado os dados da aeronave, peças, etapas, testes e realizados.
- Voltar: Retorna ao ambiente anterior.

## 📁 Estrutura do projeto
```
├── 📁 data
│   ├── ⚙️ aeronaves.json
│   ├── ⚙️ funcionarios.json
├── 📁 src
│   ├── 📁 models
│   │   ├── 📄 Aeronave.ts
│   │   ├── 📄 Etapa.ts
│   │   ├── 📄 Funcionario.ts
│   │   ├── 📄 Peca.ts
│   │   ├── 📄 Relatorio.ts
│   │   └── 📄 Teste.ts
│   ├── 📁 services
│   │   └── 📄 DataService.ts
│   ├── 📄 enums.ts
│   └── 📄 index.ts
├── ⚙️ .gitignore
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── ⚙️ tsconfig.json
```

## 📦 O que foi implementado

- Aeronaves — cadastro com código único, modelo, tipo (enum), capacidade, alcance.
- Peças — nome, tipo (NACIONAL/IMPORTADA), fornecedor, status com atualização.
- Etapas — controle de ordem (não pode iniciar sem a anterior estar concluída), iniciar/finalizar.
- Funcionários — cadastro completo, autenticação com senha oculta, níveis de permissão.
- Testes — Elétrico, Hidráulico, Aerodinâmico com resultado Aprovado/Reprovado.
- Relatório — gerado e salvo como .txt na pasta data/
- Persistência — todos os dados salvos em JSON na pasta data/ (formato texto/ASCII).
- Permissões — Admin vê tudo; Engenheiro não gerencia funcionários; Operador só opera etapas e peças.
- Enumerações — todas as 7 enums implementadas.
