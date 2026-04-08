import * as fs from "fs";
import * as path from "path";
import { Aeronave } from "./Aeronave";

export class Relatorio {
  constructor(
    private aeronave: Aeronave,
    private nomeCliente: string,
    private dataEntrega: string
  ) {}

  gerar(): string {
    const sep = "=".repeat(54);
    const linhas: string[] = [
      sep,
      "       RELATORIO FINAL DE ENTREGA — AEROCODE",
      sep,
      "",
      `  Data de Entrega : ${this.dataEntrega}`,
      `  Cliente         : ${this.nomeCliente}`,
      "",
      sep,
      "  DADOS DA AERONAVE",
      sep,
      `  Codigo    : ${this.aeronave.codigo}`,
      `  Modelo    : ${this.aeronave.modelo}`,
      `  Tipo      : ${this.aeronave.tipo}`,
      `  Capacidade: ${this.aeronave.capacidade} passageiros`,
      `  Alcance   : ${this.aeronave.alcance} km`,
      "",
      sep,
      "  PECAS UTILIZADAS",
      sep,
    ];

    if (this.aeronave.pecas.length === 0) {
      linhas.push("  (nenhuma peca registrada)");
    } else {
      this.aeronave.pecas.forEach((p, i) => {
        linhas.push(
          `  ${i + 1}. ${p.nome} | Tipo: ${p.tipo} | ` +
            `Fornecedor: ${p.fornecedor} | Status: ${p.status}`
        );
      });
    }

    linhas.push("");
    linhas.push(sep);
    linhas.push("  ETAPAS REALIZADAS");
    linhas.push(sep);

    if (this.aeronave.etapas.length === 0) {
      linhas.push("  (nenhuma etapa registrada)");
    } else {
      this.aeronave.etapas.forEach((e, i) => {
        linhas.push(
          `  ${i + 1}. ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status}`
        );
        if (e.funcionarios.length > 0) {
          linhas.push(
            `     Responsaveis: ${e.funcionarios.map((f) => f.nome).join(", ")}`
          );
        }
      });
    }

    linhas.push("");
    linhas.push(sep);
    linhas.push("  RESULTADOS DOS TESTES");
    linhas.push(sep);

    if (this.aeronave.testes.length === 0) {
      linhas.push("  (nenhum teste registrado)");
    } else {
      this.aeronave.testes.forEach((t, i) => {
        linhas.push(`  ${i + 1}. ${t.tipo}  =>  ${t.resultado}`);
      });
    }

    linhas.push("");
    linhas.push(sep);
    linhas.push("  FIM DO RELATORIO");
    linhas.push(sep);

    return linhas.join("\n");
  }

  salvar(): string {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    const nomeArquivo = `relatorio_${this.aeronave.codigo}_${Date.now()}.txt`;
    const caminho = path.join(dataDir, nomeArquivo);
    fs.writeFileSync(caminho, this.gerar(), "utf-8");
    return caminho;
  }
}
