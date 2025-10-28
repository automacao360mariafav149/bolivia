
export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  cpfCnpj: string | null;
  nascimento: string | null;
  modelo: string | null;
  cor: string | null;
  preco: string | null;
  data_agendamento: string | null;
  funcionario: string | null;
  confirmação: string | null;
  status: string;
  created_at: string | null;
  lastContact: string;
}
