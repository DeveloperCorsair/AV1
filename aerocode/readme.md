# 🛠️ Desafio
<p>
O desafio é construir o primeiro produto da Aerocode, um sistema CLI em TypeScript para gerenciar a produção de aeronaves. Conforme as especificações, o sistema precisa contemplar o cadastro e controle de aeronaves, peças, etapas de produção, funcionários com autenticação e testes. Além disso, ele deve gerar um relatório final e persistir todos os dados em arquivos de texto. O código abaixo implementa fielmente o Diagrama UML fornecido.
</p>

# 🚀 Como rodar o projeto
## Pré-requisitos
Você precisa ter o Node.js instalado (versão 18 ou superior).

## ✏️ Passo a passo
## 1. Entre na pasta
cd aerocode

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