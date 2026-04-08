import { TipoTeste, ResultadoTeste } from "../enums";

export class Teste {
  constructor(
    public tipo: TipoTeste,
    public resultado: ResultadoTeste
  ) {}

  exibirDetalhes(): string {
    return `  Tipo: ${this.tipo} | Resultado: ${this.resultado}`;
  }

  toJSON(): object {
    return {
      tipo: this.tipo,
      resultado: this.resultado,
    };
  }

  static fromJSON(json: any): Teste {
    return new Teste(
      json.tipo as TipoTeste,
      json.resultado as ResultadoTeste
    );
  }
}
