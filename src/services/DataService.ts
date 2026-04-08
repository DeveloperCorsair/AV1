import * as fs from "fs";
import * as path from "path";
import { Aeronave } from "../models/Aeronave";
import { Funcionario } from "../models/Funcionario";
import { NivelPermissao } from "../enums";

const DATA_DIR = path.join(process.cwd(), "data");
const AERONAVES_FILE = path.join(DATA_DIR, "aeronaves.json");
const FUNCIONARIOS_FILE = path.join(DATA_DIR, "funcionarios.json");

function garantirDiretorio(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Aeronaves

export function salvarAeronaves(aeronaves: Aeronave[]): void {
  garantirDiretorio();
  fs.writeFileSync(
    AERONAVES_FILE,
    JSON.stringify(aeronaves.map((a) => a.toJSON()), null, 2),
    "utf-8"
  );
}

export function carregarAeronaves(): Aeronave[] {
  garantirDiretorio();
  if (!fs.existsSync(AERONAVES_FILE)) return [];
  try {
    const raw = fs.readFileSync(AERONAVES_FILE, "utf-8");
    return (JSON.parse(raw) as any[]).map((a) => Aeronave.fromJSON(a));
  } catch {
    return [];
  }
}

// Funcionários

export function salvarFuncionarios(funcionarios: Funcionario[]): void {
  garantirDiretorio();
  fs.writeFileSync(
    FUNCIONARIOS_FILE,
    JSON.stringify(funcionarios.map((f) => f.toJSON()), null, 2),
    "utf-8"
  );
}

export function carregarFuncionarios(): Funcionario[] {
  garantirDiretorio();
  if (!fs.existsSync(FUNCIONARIOS_FILE)) return [];
  try {
    const raw = fs.readFileSync(FUNCIONARIOS_FILE, "utf-8");
    return (JSON.parse(raw) as any[]).map((f) => Funcionario.fromJSON(f));
  } catch {
    return [];
  }
}

// Cria um administrador padrão se não existir nenhum funcionário.

export function garantirAdminPadrao(funcionarios: Funcionario[]): Funcionario[] {
  if (funcionarios.length === 0) {
    const admin = new Funcionario(
      "0001",
      "Administrador",
      "(00) 00000-0000",
      "Sede Aerocode",
      "admin",
      "admin123",
      NivelPermissao.ADMINISTRADOR
    );
    funcionarios.push(admin);
    salvarFuncionarios(funcionarios);
    console.log(
      "\n[INFO] Nenhum usuario encontrado. Admin padrao criado: usuario=admin / senha=admin123\n"
    );
  }
  return funcionarios;
}
