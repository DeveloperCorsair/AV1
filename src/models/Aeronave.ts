import { TipoAeronave } from "../enums";
import { Peca } from "./Peca";
import { Etapa } from "./Etapa";
import { Teste } from "./Teste";

export class Aeronave {
  public pecas: Peca[] = [];
  public etapas: Etapa[] = [];
  public testes: Teste[] = [];

  constructor(
    public codigo: string,
    public modelo: string,
    public tipo: TipoAeronave,
    public capacidade: number,
    public alcance: number
  ) {}

  exibirDetalhes(): string {
    const sep = "=".repeat(52);
    const linhas: string[] = [
      sep,
      `  AERONAVE: ${this.codigo}`,
      sep,
      `  Modelo   : ${this.modelo}`,
      `  Tipo     : ${this.tipo}`,
      `  Capacidade: ${this.capacidade} passageiros`,
      `  Alcance  : ${this.alcance} km`,
      "",
      "  [ PECAS ]",
    ];

    if (this.pecas.length === 0) {
      linhas.push("  (nenhuma peça cadastrada)");
    } else {
      this.pecas.forEach((p, i) => linhas.push(`  ${i + 1}. ${p.exibirDetalhes().trim()}`));
    }

    linhas.push("");
    linhas.push("  [ ETAPAS ]");
    if (this.etapas.length === 0) {
      linhas.push("  (nenhuma etapa cadastrada)");
    } else {
      this.etapas.forEach((e, i) => {
        linhas.push(`  ${i + 1}. ${e.exibirDetalhes()}`);
      });
    }

    linhas.push("");
    linhas.push("  [ TESTES ]");
    if (this.testes.length === 0) {
      linhas.push("  (nenhum teste realizado)");
    } else {
      this.testes.forEach((t, i) => linhas.push(`  ${i + 1}. ${t.exibirDetalhes().trim()}`));
    }

    linhas.push(sep);
    return linhas.join("\n");
  }

  toJSON(): object {
    return {
      codigo: this.codigo,
      modelo: this.modelo,
      tipo: this.tipo,
      capacidade: this.capacidade,
      alcance: this.alcance,
      pecas: this.pecas.map((p) => p.toJSON()),
      etapas: this.etapas.map((e) => e.toJSON()),
      testes: this.testes.map((t) => t.toJSON()),
    };
  }

  static fromJSON(json: any): Aeronave {
    const a = new Aeronave(
      json.codigo,
      json.modelo,
      json.tipo as TipoAeronave,
      json.capacidade,
      json.alcance
    );
    a.pecas = (json.pecas || []).map((p: any) => Peca.fromJSON(p));
    a.etapas = (json.etapas || []).map((e: any) => Etapa.fromJSON(e));
    a.testes = (json.testes || []).map((t: any) => Teste.fromJSON(t));
    return a;
  }
}
