import { NivelPermissao } from "../enums";

export class Funcionario {
  constructor(
    public id: string,
    public nome: string,
    public telefone: string,
    public endereco: string,
    public usuario: string,
    public senha: string,
    public nivelPermissao: NivelPermissao
  ) {}

  autenticar(usuario: string, senha: string): boolean {
    return this.usuario === usuario && this.senha === senha;
  }

  exibirDetalhes(): string {
    return (
      `  ID: ${this.id}\n` +
      `  Nome: ${this.nome}\n` +
      `  Telefone: ${this.telefone}\n` +
      `  Endereço: ${this.endereco}\n` +
      `  Usuário: ${this.usuario}\n` +
      `  Nível de Permissão: ${this.nivelPermissao}`
    );
  }

  toJSON(): object {
    return {
      id: this.id,
      nome: this.nome,
      telefone: this.telefone,
      endereco: this.endereco,
      usuario: this.usuario,
      senha: this.senha,
      nivelPermissao: this.nivelPermissao,
    };
  }

  static fromJSON(json: any): Funcionario {
    return new Funcionario(
      json.id,
      json.nome,
      json.telefone,
      json.endereco,
      json.usuario,
      json.senha,
      json.nivelPermissao as NivelPermissao
    );
  }
}
