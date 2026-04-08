import { StatusEtapa } from "../enums";
import { Funcionario } from "./Funcionario";

export class Etapa {
  public funcionarios: Funcionario[] = [];

  constructor(
    public nome: string,
    public prazo: string,
    public status: StatusEtapa = StatusEtapa.PENDENTE
  ) {}

  /*
   Inicia a etapa. Retorna false se a etapa anterior não estiver concluída
   ou se esta etapa não estiver PENDENTE.
   */
  iniciar(etapaAnterior?: Etapa): boolean {
    if (etapaAnterior && etapaAnterior.status !== StatusEtapa.CONCLUIDA) {
      return false;
    }
    if (this.status !== StatusEtapa.PENDENTE) {
      return false;
    }
    this.status = StatusEtapa.ANDAMENTO;
    return true;
  }

  /*
    Finaliza a etapa. Só é possível se estiver em ANDAMENTO.
   */
  finalizar(): boolean {
    if (this.status !== StatusEtapa.ANDAMENTO) {
      return false;
    }
    this.status = StatusEtapa.CONCLUIDA;
    return true;
  }

  /*
   Associa um funcionário à etapa, evitando duplicidade.
   */
  associarFuncionario(funcionario: Funcionario): boolean {
    const jaAssociado = this.funcionarios.some((f) => f.id === funcionario.id);
    if (jaAssociado) return false;
    this.funcionarios.push(funcionario);
    return true;
  }

  listarFuncionarios(): string {
    if (this.funcionarios.length === 0) return "    (nenhum funcionário associado)";
    return this.funcionarios
      .map((f) => `    - ${f.nome} [${f.nivelPermissao}]`)
      .join("\n");
  }

  exibirDetalhes(): string {
    return (
      `  Nome: ${this.nome} | Prazo: ${this.prazo} | Status: ${this.status}\n` +
      `  Funcionários:\n${this.listarFuncionarios()}`
    );
  }

  toJSON(): object {
    return {
      nome: this.nome,
      prazo: this.prazo,
      status: this.status,
      funcionarios: this.funcionarios.map((f) => f.toJSON()),
    };
  }

  static fromJSON(json: any): Etapa {
    const etapa = new Etapa(json.nome, json.prazo, json.status as StatusEtapa);
    etapa.funcionarios = (json.funcionarios || []).map((f: any) =>
      Funcionario.fromJSON(f)
    );
    return etapa;
  }
}
