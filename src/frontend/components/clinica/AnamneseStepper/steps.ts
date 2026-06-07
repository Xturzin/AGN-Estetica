export type FieldType = "text" | "textarea" | "radio" | "number";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: FieldOption[];
  placeholder?: string;
  rows?: number;
}

export type SecaoId = "dados_gerais" | "saude" | "habitos" | "contraindicacoes";

export interface StepDef {
  id: SecaoId;
  title: string;
  description: string;
  fields: FieldDef[];
}

export const STEPS: StepDef[] = [
  {
    id: "dados_gerais",
    title: "Dados gerais",
    description: "Informações pessoais e contato de emergência.",
    fields: [
      { name: "profissao", label: "Profissão", type: "text" },
      {
        name: "estado_civil",
        label: "Estado civil",
        type: "radio",
        options: [
          { value: "solteiro", label: "Solteiro(a)" },
          { value: "casado", label: "Casado(a)" },
          { value: "divorciado", label: "Divorciado(a)" },
          { value: "viuvo", label: "Viúvo(a)" },
        ],
      },
      { name: "filhos", label: "Filhos (quantos)", type: "number" },
      {
        name: "contato_emergencia_nome",
        label: "Contato de emergência — nome",
        type: "text",
      },
      {
        name: "contato_emergencia_telefone",
        label: "Contato de emergência — telefone",
        type: "text",
      },
    ],
  },
  {
    id: "saude",
    title: "Saúde",
    description: "Histórico médico, alergias e medicamentos.",
    fields: [
      {
        name: "doencas_preexistentes",
        label: "Doenças preexistentes",
        type: "textarea",
        placeholder: "Diabetes, hipertensão, etc.",
        rows: 3,
      },
      { name: "cirurgias", label: "Cirurgias prévias", type: "textarea", rows: 3 },
      {
        name: "alergias",
        label: "Alergias (medicamentos, cosméticos, alimentos)",
        type: "textarea",
        rows: 3,
      },
      { name: "medicamentos", label: "Medicamentos em uso", type: "textarea", rows: 3 },
      {
        name: "gestacao",
        label: "Gravidez ou amamentação",
        type: "radio",
        options: [
          { value: "nao", label: "Não" },
          { value: "gravida", label: "Grávida" },
          { value: "amamentando", label: "Amamentando" },
          { value: "na", label: "Não se aplica" },
        ],
      },
    ],
  },
  {
    id: "habitos",
    title: "Hábitos",
    description: "Estilo de vida e rotina.",
    fields: [
      {
        name: "fuma",
        label: "Tabagismo",
        type: "radio",
        options: [
          { value: "nao", label: "Não" },
          { value: "ex", label: "Ex-fumante" },
          { value: "sim", label: "Sim" },
        ],
      },
      {
        name: "cigarros_dia",
        label: "Cigarros por dia (se aplicável)",
        type: "number",
      },
      {
        name: "alcool",
        label: "Consumo de álcool",
        type: "radio",
        options: [
          { value: "nao", label: "Não bebe" },
          { value: "social", label: "Socialmente" },
          { value: "frequente", label: "Frequente" },
        ],
      },
      {
        name: "exercicios",
        label: "Pratica exercícios?",
        type: "textarea",
        placeholder: "Quais e frequência semanal",
        rows: 2,
      },
      { name: "horas_sono", label: "Horas de sono por noite", type: "number" },
      { name: "agua_litros", label: "Hidratação diária (litros)", type: "number" },
    ],
  },
  {
    id: "contraindicacoes",
    title: "Estética & Contraindicações",
    description: "Histórico estético, expectativas e contraindicações.",
    fields: [
      {
        name: "tratamentos_previos",
        label: "Tratamentos estéticos anteriores",
        type: "textarea",
        rows: 3,
      },
      {
        name: "queixas_principais",
        label: "Queixas principais",
        type: "textarea",
        placeholder: "O que mais te incomoda?",
        rows: 3,
      },
      {
        name: "expectativas",
        label: "Expectativas com o tratamento",
        type: "textarea",
        rows: 3,
      },
      {
        name: "sensibilidade_pele",
        label: "Sensibilidade da pele",
        type: "radio",
        options: [
          { value: "baixa", label: "Baixa" },
          { value: "normal", label: "Normal" },
          { value: "alta", label: "Alta" },
        ],
      },
      {
        name: "marcapasso_proteses",
        label: "Possui marca-passo ou próteses metálicas?",
        type: "radio",
        options: [
          { value: "nao", label: "Não" },
          { value: "sim", label: "Sim" },
        ],
      },
      {
        name: "outras_contraindicacoes",
        label: "Outras observações",
        type: "textarea",
        rows: 3,
      },
    ],
  },
];