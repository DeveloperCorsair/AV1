// amora
import * as readlineSync from "readline-sync";
import { Aeronave } from "./models/Aeronave";
import { Peca } from "./models/Peca";
import { Etapa } from "./models/Etapa";
import { Teste } from "./models/Teste";
import { Funcionario } from "./models/Funcionario";
import { Relatorio } from "./models/Relatorio";
import {
  TipoAeronave,
  TipoPeca,
  StatusPeca,
  StatusEtapa,
  NivelPermissao,
  TipoTeste,
  ResultadoTeste,
} from "./enums";
import {
  salvarAeronaves,
  carregarAeronaves,
  salvarFuncionarios,
  carregarFuncionarios,
  garantirAdminPadrao,
} from "./services/DataService";

let aeronaves: Aeronave[] = carregarAeronaves();
let funcionarios: Funcionario[] = carregarFuncionarios();
funcionarios = garantirAdminPadrao(funcionarios);
let usuarioLogado: Funcionario | null = null;

function limpar(): void {
  process.stdout.write("\x1Bc");
}

function cabecalho(): void {
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║         AEROCODE — Gestão de Produção Aeronave       ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  if (usuarioLogado) {
    console.log(
      `  Logado como: ${usuarioLogado.nome} [${usuarioLogado.nivelPermissao}]`
    );
  }
  console.log();
}

function pausar(): void {
  readlineSync.question("\n  Pressione ENTER para continuar...");
}

function escolherEnum<T extends string>(
  label: string,
  valores: T[]
): T {
  const opcoes = valores.map((v, i) => `${i + 1}. ${v}`);
  const idValorX = readlineSync.keyInSelect(valores, `Escolha ${label}:`, {
    cancel: false,
  });
  return valores[idValorX];
}

function temPermissao(...niveis: NivelPermissao[]): boolean {
  return usuarioLogado !== null && niveis.includes(usuarioLogado.nivelPermissao);
}

function exigir(...niveis: NivelPermissao[]): boolean {
  if (!temPermissao(...niveis)) {
    console.log("\n  [ERRO] Voce nao tem permissao para esta acao.");
    pausar();
    return false;
  }
  return true;
}

// LOGIN
function telaLogin(): boolean {
  limpar();
  cabecalho();
  console.log("  === LOGIN ===\n");
  const usuario = readlineSync.question("  Usuario: ");
  const senha = readlineSync.question("  Senha  : ", { hideEchoBack: true });

  const encontrado = funcionarios.find((f) => f.autenticar(usuario, senha));
  if (encontrado) {
    usuarioLogado = encontrado;
    console.log(`\n  Bem-vindo(a), ${encontrado.nome}!`);
    pausar();
    return true;
  }
  console.log("\n  [ERRO] Usuario ou senha invalidos.");
  pausar();
  return false;
}

// GESTÃO DE AERONAVES 
function menuAeronaves(): void {
  while (true) {
    limpar();
    cabecalho();
    console.log("  === AERONAVES ===\n");
    const opcao = readlineSync.keyInSelect(
      [
        "Cadastrar nova aeronave",
        "Listar aeronaves",
        "Ver detalhes de uma aeronave",
        "Voltar",
      ],
      "Opcao:",
      { cancel: false }
    );

    if (opcao === 0) cadastrarAeronave();
    else if (opcao === 1) listarAeronaves();
    else if (opcao === 2) verDetalhesAeronave();
    else break;
  }
}

function cadastrarAeronave(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) return;
  limpar();
  cabecalho();
  console.log("  === CADASTRAR AERONAVE ===\n");

  const codigo = readlineSync.question("  Codigo (unico): ").trim();
  if (!codigo) { console.log("  Codigo nao pode ser vazio."); pausar(); return; }
  if (aeronaves.find((a) => a.codigo === codigo)) {
    console.log(`\n  [ERRO] Ja existe uma aeronave com o codigo "${codigo}".`);
    pausar();
    return;
  }

  const modelo = readlineSync.question("  Modelo: ").trim();
  const tipo = escolherEnum("Tipo", Object.values(TipoAeronave));
  const capacidade = parseInt(readlineSync.question("  Capacidade (passageiros): "), 10);
  const alcance = parseInt(readlineSync.question("  Alcance (km): "), 10);

  const nova = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
  aeronaves.push(nova);
  salvarAeronaves(aeronaves);
  console.log(`\n  Aeronave "${codigo}" cadastrada com sucesso!`);
  pausar();
}

function listarAeronaves(): void {
  limpar();
  cabecalho();
  console.log("  === LISTA DE AERONAVES ===\n");
  if (aeronaves.length === 0) {
    console.log("  Nenhuma aeronave cadastrada.");
  } else {
    aeronaves.forEach((a, i) => {
      console.log(
        `  ${i + 1}. [${a.codigo}] ${a.modelo} — ${a.tipo} — ` +
          `${a.capacidade} pax — ${a.alcance} km`
      );
    });
  }
  pausar();
}

function verDetalhesAeronave(): void {
  limpar();
  cabecalho();
  if (aeronaves.length === 0) {
    console.log("  Nenhuma aeronave cadastrada.");
    pausar();
    return;
  }
  const nomes = aeronaves.map((a) => `[${a.codigo}] ${a.modelo}`);
  const idValorX = readlineSync.keyInSelect(nomes, "Selecione a aeronave:", { cancel: true });
  if (idValorX === -1) return;
  limpar();
  console.log(aeronaves[idValorX].exibirDetalhes());
  pausar();
}

function selecionarAeronave(): Aeronave | null {
  if (aeronaves.length === 0) {
    console.log("  Nenhuma aeronave cadastrada.");
    pausar();
    return null;
  }
  const nomes = aeronaves.map((a) => `[${a.codigo}] ${a.modelo}`);
  const idValorX = readlineSync.keyInSelect(nomes, "Selecione a aeronave:", { cancel: true });
  if (idValorX === -1) return null;
  return aeronaves[idValorX];
}

// GESTÃO DE PEÇAS
function menuPecas(): void {
  while (true) {
    limpar();
    cabecalho();
    console.log("  === PECAS ===\n");
    const opcao = readlineSync.keyInSelect(
      [
        "Adicionar peca a uma aeronave",
        "Listar pecas de uma aeronave",
        "Atualizar status de uma peca",
        "Voltar",
      ],
      "Opcao:",
      { cancel: false }
    );
    if (opcao === 0) adicionarPeca();
    else if (opcao === 1) listarPecas();
    else if (opcao === 2) atualizarStatusPeca();
    else break;
  }
}

function adicionarPeca(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) return;
  limpar();
  cabecalho();
  console.log("  === ADICIONAR PECA ===\n");
  const aeronave = selecionarAeronave();
  if (!aeronave) return;

  const nome = readlineSync.question("  Nome da peca: ").trim();
  const tipo = escolherEnum("Tipo da Peca", Object.values(TipoPeca));
  const fornecedor = readlineSync.question("  Fornecedor: ").trim();
  const status = escolherEnum("Status da Peca", Object.values(StatusPeca));

  aeronave.pecas.push(new Peca(nome, tipo, fornecedor, status));
  salvarAeronaves(aeronaves);
  console.log(`\n  Peca "${nome}" adicionada a aeronave ${aeronave.codigo}.`);
  pausar();
}

function listarPecas(): void {
  limpar();
  cabecalho();
  console.log("  === LISTAR PECAS ===\n");
  const aeronave = selecionarAeronave();
  if (!aeronave) return;

  if (aeronave.pecas.length === 0) {
    console.log("  Nenhuma peca cadastrada nesta aeronave.");
  } else {
    aeronave.pecas.forEach((p, i) =>
      console.log(`  ${i + 1}. ${p.exibirDetalhes()}`)
    );
  }
  pausar();
}

function atualizarStatusPeca(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR)) return;
  limpar();
  cabecalho();
  const aeronave = selecionarAeronave();
  if (!aeronave || aeronave.pecas.length === 0) {
    console.log("  Nenhuma peca disponivel.");
    pausar();
    return;
  }

  const nomes = aeronave.pecas.map((p, i) => `${i + 1}. ${p.nome} (${p.status})`);
  const idValorX = readlineSync.keyInSelect(nomes, "Selecione a peca:", { cancel: true });
  if (idValorX === -1) return;

  const novoStatus = escolherEnum("Novo Status", Object.values(StatusPeca));
  aeronave.pecas[idValorX].atualizarStatus(novoStatus);
  salvarAeronaves(aeronaves);
  console.log("\n  Status atualizado com sucesso!");
  pausar();
}

// GESTÃO DE ETAPAS
function menuEtapas(): void {
  while (true) {
    limpar();
    cabecalho();
    console.log("  === ETAPAS DE PRODUCAO ===\n");
    const opcao = readlineSync.keyInSelect(
      [
        "Adicionar etapa a uma aeronave",
        "Listar etapas de uma aeronave",
        "Iniciar etapa",
        "Finalizar etapa",
        "Associar funcionario a etapa",
        "Voltar",
      ],
      "Opcao:",
      { cancel: false }
    );
    if (opcao === 0) adicionarEtapa();
    else if (opcao === 1) listarEtapas();
    else if (opcao === 2) iniciarEtapa();
    else if (opcao === 3) finalizarEtapa();
    else if (opcao === 4) associarFuncionarioEtapa();
    else break;
  }
}

function adicionarEtapa(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) return;
  limpar();
  cabecalho();
  console.log("  === ADICIONAR ETAPA ===\n");
  const aeronave = selecionarAeronave();
  if (!aeronave) return;

  const nome = readlineSync.question("  Nome da etapa: ").trim();
  const prazo = readlineSync.question("  Prazo (ex: 2025-12-31): ").trim();

  aeronave.etapas.push(new Etapa(nome, prazo));
  salvarAeronaves(aeronaves);
  console.log(`\n  Etapa "${nome}" adicionada (status: PENDENTE).`);
  pausar();
}

function listarEtapas(): void {
  limpar();
  cabecalho();
  const aeronave = selecionarAeronave();
  if (!aeronave) return;

  if (aeronave.etapas.length === 0) {
    console.log("  Nenhuma etapa cadastrada.");
  } else {
    aeronave.etapas.forEach((e, i) => {
      console.log(`\n  ${i + 1}. ${e.exibirDetalhes()}`);
    });
  }
  pausar();
}

function selecionarEtapa(aeronave: Aeronave): Etapa | null {
  if (aeronave.etapas.length === 0) {
    console.log("  Nenhuma etapa cadastrada nesta aeronave.");
    pausar();
    return null;
  }
  const nomes = aeronave.etapas.map(
    (e, i) => `${i + 1}. ${e.nome} [${e.status}]`
  );
  const idValorX = readlineSync.keyInSelect(nomes, "Selecione a etapa:", { cancel: true });
  if (idValorX === -1) return null;
  return aeronave.etapas[idValorX];
}

function iniciarEtapa(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR)) return;
  limpar();
  cabecalho();
  const aeronave = selecionarAeronave();
  if (!aeronave) return;
  const etapa = selecionarEtapa(aeronave);
  if (!etapa) return;

  const idValorX = aeronave.etapas.indexOf(etapa);
  const etapaAnterior = idValorX > 0 ? aeronave.etapas[idValorX - 1] : undefined;
  const ok = etapa.iniciar(etapaAnterior);

  if (ok) {
    salvarAeronaves(aeronaves);
    console.log(`\n  Etapa "${etapa.nome}" iniciada com sucesso!`);
  } else {
    console.log(
      `\n  [ERRO] Nao foi possivel iniciar. Verifique:\n` +
        `  - A etapa deve estar PENDENTE.\n` +
        `  - A etapa anterior deve estar CONCLUIDA.`
    );
  }
  pausar();
}

function finalizarEtapa(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO, NivelPermissao.OPERADOR)) return;
  limpar();
  cabecalho();
  const aeronave = selecionarAeronave();
  if (!aeronave) return;
  const etapa = selecionarEtapa(aeronave);
  if (!etapa) return;

  const ok = etapa.finalizar();
  if (ok) {
    salvarAeronaves(aeronaves);
    console.log(`\n  Etapa "${etapa.nome}" concluida!`);
  } else {
    console.log(`\n  [ERRO] A etapa deve estar EM ANDAMENTO para ser finalizada.`);
  }
  pausar();
}

function associarFuncionarioEtapa(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) return;
  limpar();
  cabecalho();
  const aeronave = selecionarAeronave();
  if (!aeronave) return;
  const etapa = selecionarEtapa(aeronave);
  if (!etapa) return;

  if (funcionarios.length === 0) {
    console.log("  Nenhum funcionario cadastrado.");
    pausar();
    return;
  }

  const nomes = funcionarios.map((f) => `${f.nome} [${f.nivelPermissao}]`);
  const idValorX = readlineSync.keyInSelect(nomes, "Selecione o funcionario:", { cancel: true });
  if (idValorX === -1) return;

  const ok = etapa.associarFuncionario(funcionarios[idValorX]);
  if (ok) {
    salvarAeronaves(aeronaves);
    console.log(`\n  Funcionario associado com sucesso!`);
  } else {
    console.log(`\n  [AVISO] Funcionario ja associado a esta etapa.`);
  }
  pausar();
}

// GESTÃO DE FUNCIONÁRIOS
function menuFuncionarios(): void {
  while (true) {
    limpar();
    cabecalho();
    console.log("  === FUNCIONARIOS ===\n");
    const opcao = readlineSync.keyInSelect(
      ["Cadastrar funcionario", "Listar funcionarios", "Voltar"],
      "Opcao:",
      { cancel: false }
    );
    if (opcao === 0) cadastrarFuncionario();
    else if (opcao === 1) listarFuncionarios();
    else break;
  }
}

function cadastrarFuncionario(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR)) return;
  limpar();
  cabecalho();
  console.log("  === CADASTRAR FUNCIONARIO ===\n");

  const id = (funcionarios.length + 1).toString().padStart(4, "0");
  console.log(`  ID gerado: ${id}`);
  const nome = readlineSync.question("  Nome: ").trim();
  const telefone = readlineSync.question("  Telefone: ").trim();
  const endereco = readlineSync.question("  Endereco: ").trim();
  const usuario = readlineSync.question("  Usuario (login): ").trim();

  if (funcionarios.find((f) => f.usuario === usuario)) {
    console.log("\n  [ERRO] Este nome de usuario ja esta em uso.");
    pausar();
    return;
  }

  const senha = readlineSync.question("  Senha: ", { hideEchoBack: true });
  const nivel = escolherEnum("Nivel de Permissao", Object.values(NivelPermissao));

  funcionarios.push(new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel));
  salvarFuncionarios(funcionarios);
  console.log(`\n  Funcionario "${nome}" cadastrado com ID ${id}.`);
  pausar();
}

function listarFuncionarios(): void {
  limpar();
  cabecalho();
  console.log("  === LISTA DE FUNCIONARIOS ===\n");
  if (funcionarios.length === 0) {
    console.log("  Nenhum funcionario cadastrado.");
  } else {
    funcionarios.forEach((f) => {
      console.log();
      console.log(f.exibirDetalhes());
    });
  }
  pausar();
}

// GESTÃO DE TESTES
function menuTestes(): void {
  while (true) {
    limpar();
    cabecalho();
    console.log("  === TESTES ===\n");
    const opcao = readlineSync.keyInSelect(
      ["Registrar teste", "Listar testes de aeronave", "Voltar"],
      "Opcao:",
      { cancel: false }
    );
    if (opcao === 0) registrarTeste();
    else if (opcao === 1) listarTestes();
    else break;
  }
}

function registrarTeste(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) return;
  limpar();
  cabecalho();
  console.log("  === REGISTRAR TESTE ===\n");
  const aeronave = selecionarAeronave();
  if (!aeronave) return;

  const tipo = escolherEnum("Tipo de Teste", Object.values(TipoTeste));
  const resultado = escolherEnum("Resultado", Object.values(ResultadoTeste));

  aeronave.testes.push(new Teste(tipo, resultado));
  salvarAeronaves(aeronaves);
  console.log(`\n  Teste ${tipo} registrado: ${resultado}.`);
  pausar();
}

function listarTestes(): void {
  limpar();
  cabecalho();
  const aeronave = selecionarAeronave();
  if (!aeronave) return;

  console.log(`\n  Testes da aeronave ${aeronave.codigo}:\n`);
  if (aeronave.testes.length === 0) {
    console.log("  Nenhum teste registrado.");
  } else {
    aeronave.testes.forEach((t, i) =>
      console.log(`  ${i + 1}. ${t.exibirDetalhes()}`)
    );
  }
  pausar();
}
//  RELATÓRIO
function gerarRelatorio(): void {
  if (!exigir(NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO)) return;
  limpar();
  cabecalho();
  console.log("  === GERAR RELATORIO FINAL ===\n");
  const aeronave = selecionarAeronave();
  if (!aeronave) return;

  const nomeCliente = readlineSync.question("  Nome do cliente: ").trim();
  const dataEntrega = readlineSync.question("  Data de entrega (ex: 2025-12-31): ").trim();

  const relatorio = new Relatorio(aeronave, nomeCliente, dataEntrega);
  const conteudo = relatorio.gerar();
  const caminho = relatorio.salvar();

  limpar();
  console.log(conteudo);
  console.log(`\n  Relatorio salvo em: ${caminho}`);
  pausar();
}

//  MENU PRINCIPAL 
function menuPrincipal(): void {
  while (true) {
    limpar();
    cabecalho();
    console.log("  === MENU PRINCIPAL ===\n");

    const opcoes: string[] = [
      "Aeronaves",
      "Pecas",
      "Etapas de Producao",
      "Testes",
    ];

    // Opções exclusivas de admin/engenheiro
    if (temPermissao(NivelPermissao.ADMINISTRADOR)) {
      opcoes.push("Funcionarios");
    }

    opcoes.push("Gerar Relatorio Final");
    opcoes.push("Sair / Logout");

    const opcao = readlineSync.keyInSelect(opcoes, "Opcao:", { cancel: false });
    const escolha = opcoes[opcao];

    if (escolha === "Aeronaves") menuAeronaves();
    else if (escolha === "Pecas") menuPecas();
    else if (escolha === "Etapas de Producao") menuEtapas();
    else if (escolha === "Testes") menuTestes();
    else if (escolha === "Funcionarios") menuFuncionarios();
    else if (escolha === "Gerar Relatorio Final") gerarRelatorio();
    else {
      // Logout
      usuarioLogado = null;
      return;
    }
  }
}

// PONTO DE ENTRADA
function main(): void {
  limpar();
  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║       Bem-vindo ao Sistema Aerocode v1.0.0            ║");
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log();

  while (true) {
    const logado = telaLogin();
    if (logado) {
      menuPrincipal();
    } else {
      const sair = readlineSync.keyInYNStrict("  Deseja tentar novamente?");
      if (!sair) {
        console.log("\n  Encerrando sistema. Ate logo!\n");
        process.exit(0);
      }
    }
  }
}

main();
