import { TipoPeca, StatusPeca } from "../enums";

export class Peca {
  constructor(
    public nome: string,
    public tipo: TipoPeca,
    public fornecedor: string,
    public status: StatusPeca
  ) {}

  atualizarStatus(novoStatus: StatusPeca): void {
    this.status = novoStatus;
  }

  exibirDetalhes(): string {
    return (
      `  Nome: ${this.nome} | Tipo: ${this.tipo} | ` +
      `Fornecedor: ${this.fornecedor} | Status: ${this.status}`
    );
  }

  toJSON(): object {
    return {
      nome: this.nome,
      tipo: this.tipo,
      fornecedor: this.fornecedor,
      status: this.status,
    };
  }

  static fromJSON(json: any): Peca {
    return new Peca(
      json.nome,
      json.tipo as TipoPeca,
      json.fornecedor,
      json.status as StatusPeca
    );
  }
}
