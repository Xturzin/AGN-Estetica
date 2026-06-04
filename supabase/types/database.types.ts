export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          created_at: string
          criado_por: string | null
          data_hora_fim: string
          data_hora_inicio: string
          id: string
          observacoes: string | null
          paciente_id: string
          profissional_id: string
          servico_id: string
          status: Database["public"]["Enums"]["status_agendamento"]
          tipo: Database["public"]["Enums"]["tipo_agendamento"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          criado_por?: string | null
          data_hora_fim: string
          data_hora_inicio: string
          id?: string
          observacoes?: string | null
          paciente_id: string
          profissional_id: string
          servico_id: string
          status?: Database["public"]["Enums"]["status_agendamento"]
          tipo: Database["public"]["Enums"]["tipo_agendamento"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          criado_por?: string | null
          data_hora_fim?: string
          data_hora_inicio?: string
          id?: string
          observacoes?: string | null
          paciente_id?: string
          profissional_id?: string
          servico_id?: string
          status?: Database["public"]["Enums"]["status_agendamento"]
          tipo?: Database["public"]["Enums"]["tipo_agendamento"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      anamnese: {
        Row: {
          atualizada_por: string | null
          contraindicacoes: Json | null
          created_at: string
          dados_gerais: Json | null
          habitos: Json | null
          id: string
          paciente_id: string
          preenchida_por_cliente: boolean
          saude: Json | null
          updated_at: string
        }
        Insert: {
          atualizada_por?: string | null
          contraindicacoes?: Json | null
          created_at?: string
          dados_gerais?: Json | null
          habitos?: Json | null
          id?: string
          paciente_id: string
          preenchida_por_cliente?: boolean
          saude?: Json | null
          updated_at?: string
        }
        Update: {
          atualizada_por?: string | null
          contraindicacoes?: Json | null
          created_at?: string
          dados_gerais?: Json | null
          habitos?: Json | null
          id?: string
          paciente_id?: string
          preenchida_por_cliente?: boolean
          saude?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "anamnese_atualizada_por_fkey"
            columns: ["atualizada_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anamnese_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: true
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      aprovacoes: {
        Row: {
          agendamento_id: string | null
          created_at: string
          dados: Json | null
          id: string
          resolvido_em: string | null
          resolvido_por: string | null
          solicitante_id: string
          status: Database["public"]["Enums"]["status_aprovacao"]
          tipo: Database["public"]["Enums"]["tipo_aprovacao"]
          updated_at: string
        }
        Insert: {
          agendamento_id?: string | null
          created_at?: string
          dados?: Json | null
          id?: string
          resolvido_em?: string | null
          resolvido_por?: string | null
          solicitante_id: string
          status?: Database["public"]["Enums"]["status_aprovacao"]
          tipo: Database["public"]["Enums"]["tipo_aprovacao"]
          updated_at?: string
        }
        Update: {
          agendamento_id?: string | null
          created_at?: string
          dados?: Json | null
          id?: string
          resolvido_em?: string | null
          resolvido_por?: string | null
          solicitante_id?: string
          status?: Database["public"]["Enums"]["status_aprovacao"]
          tipo?: Database["public"]["Enums"]["tipo_aprovacao"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aprovacoes_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aprovacoes_resolvido_por_fkey"
            columns: ["resolvido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aprovacoes_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      atendimentos: {
        Row: {
          agendamento_id: string | null
          created_at: string
          data_hora_fim: string | null
          data_hora_inicio: string
          duracao_minutos: number | null
          id: string
          observacoes: string | null
          paciente_id: string
          profissional_id: string
          servico_id: string
          status: Database["public"]["Enums"]["status_atendimento"]
          updated_at: string
        }
        Insert: {
          agendamento_id?: string | null
          created_at?: string
          data_hora_fim?: string | null
          data_hora_inicio: string
          duracao_minutos?: number | null
          id?: string
          observacoes?: string | null
          paciente_id: string
          profissional_id: string
          servico_id: string
          status?: Database["public"]["Enums"]["status_atendimento"]
          updated_at?: string
        }
        Update: {
          agendamento_id?: string | null
          created_at?: string
          data_hora_fim?: string | null
          data_hora_inicio?: string
          duracao_minutos?: number | null
          id?: string
          observacoes?: string | null
          paciente_id?: string
          profissional_id?: string
          servico_id?: string
          status?: Database["public"]["Enums"]["status_atendimento"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "atendimentos_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendimentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendimentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendimentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      clinica: {
        Row: {
          cep: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          horario_funcionamento: Json | null
          id: string
          logo_url: string | null
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          horario_funcionamento?: Json | null
          id?: string
          logo_url?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          horario_funcionamento?: Json | null
          id?: string
          logo_url?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      documentos: {
        Row: {
          created_at: string
          enviado_por: string | null
          id: string
          mime_type: string | null
          nome: string
          paciente_id: string
          storage_path: string
          tamanho_bytes: number | null
          tipo: Database["public"]["Enums"]["tipo_documento"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          enviado_por?: string | null
          id?: string
          mime_type?: string | null
          nome: string
          paciente_id: string
          storage_path: string
          tamanho_bytes?: number | null
          tipo: Database["public"]["Enums"]["tipo_documento"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          enviado_por?: string | null
          id?: string
          mime_type?: string | null
          nome?: string
          paciente_id?: string
          storage_path?: string
          tamanho_bytes?: number | null
          tipo?: Database["public"]["Enums"]["tipo_documento"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      evolucoes: {
        Row: {
          atendimento_id: string | null
          created_at: string
          data_hora: string
          descricao: string | null
          id: string
          paciente_id: string
          profissional_id: string
          tipo: Database["public"]["Enums"]["tipo_evolucao"]
          titulo: string
          updated_at: string
        }
        Insert: {
          atendimento_id?: string | null
          created_at?: string
          data_hora?: string
          descricao?: string | null
          id?: string
          paciente_id: string
          profissional_id: string
          tipo: Database["public"]["Enums"]["tipo_evolucao"]
          titulo: string
          updated_at?: string
        }
        Update: {
          atendimento_id?: string | null
          created_at?: string
          data_hora?: string
          descricao?: string | null
          id?: string
          paciente_id?: string
          profissional_id?: string
          tipo?: Database["public"]["Enums"]["tipo_evolucao"]
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evolucoes_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolucoes_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      fotos_clinicas: {
        Row: {
          atendimento_id: string | null
          created_at: string
          descricao: string | null
          enviado_por: string | null
          evolucao_id: string | null
          id: string
          paciente_id: string
          storage_path: string
          tipo: Database["public"]["Enums"]["tipo_foto"]
          updated_at: string
        }
        Insert: {
          atendimento_id?: string | null
          created_at?: string
          descricao?: string | null
          enviado_por?: string | null
          evolucao_id?: string | null
          id?: string
          paciente_id: string
          storage_path: string
          tipo: Database["public"]["Enums"]["tipo_foto"]
          updated_at?: string
        }
        Update: {
          atendimento_id?: string | null
          created_at?: string
          descricao?: string | null
          enviado_por?: string | null
          evolucao_id?: string | null
          id?: string
          paciente_id?: string
          storage_path?: string
          tipo?: Database["public"]["Enums"]["tipo_foto"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotos_clinicas_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotos_clinicas_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotos_clinicas_evolucao_id_fkey"
            columns: ["evolucao_id"]
            isOneToOne: false
            referencedRelation: "evolucoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotos_clinicas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacoes: {
        Row: {
          corpo: string | null
          created_at: string
          dados: Json | null
          id: string
          lida: boolean
          tipo: Database["public"]["Enums"]["tipo_notificacao"]
          titulo: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          corpo?: string | null
          created_at?: string
          dados?: Json | null
          id?: string
          lida?: boolean
          tipo: Database["public"]["Enums"]["tipo_notificacao"]
          titulo: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          corpo?: string | null
          created_at?: string
          dados?: Json | null
          id?: string
          lida?: boolean
          tipo?: Database["public"]["Enums"]["tipo_notificacao"]
          titulo?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          ativo: boolean
          bairro: string | null
          cadastrado_por: string | null
          cep: string | null
          cidade: string | null
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          estado: string | null
          foto_url: string | null
          id: string
          logradouro: string | null
          nome_completo: string
          status: Database["public"]["Enums"]["status_paciente"]
          telefone: string | null
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          ativo?: boolean
          bairro?: string | null
          cadastrado_por?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          logradouro?: string | null
          nome_completo: string
          status?: Database["public"]["Enums"]["status_paciente"]
          telefone?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          ativo?: boolean
          bairro?: string | null
          cadastrado_por?: string | null
          cep?: string | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          estado?: string | null
          foto_url?: string | null
          id?: string
          logradouro?: string | null
          nome_completo?: string
          status?: Database["public"]["Enums"]["status_paciente"]
          telefone?: string | null
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_cadastrado_por_fkey"
            columns: ["cadastrado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pacientes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      permissoes: {
        Row: {
          area: Database["public"]["Enums"]["area_permissao"]
          atualizado_por: string | null
          created_at: string
          habilitado: boolean
          id: string
          perfil: Database["public"]["Enums"]["tipo_usuario"]
          updated_at: string
        }
        Insert: {
          area: Database["public"]["Enums"]["area_permissao"]
          atualizado_por?: string | null
          created_at?: string
          habilitado?: boolean
          id?: string
          perfil: Database["public"]["Enums"]["tipo_usuario"]
          updated_at?: string
        }
        Update: {
          area?: Database["public"]["Enums"]["area_permissao"]
          atualizado_por?: string | null
          created_at?: string
          habilitado?: boolean
          id?: string
          perfil?: Database["public"]["Enums"]["tipo_usuario"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_atualizado_por_fkey"
            columns: ["atualizado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean
          categoria: string | null
          cor: string | null
          created_at: string
          descricao: string | null
          duracao_minutos: number
          id: string
          nome: string
          preco: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          cor?: string | null
          created_at?: string
          descricao?: string | null
          duracao_minutos: number
          id?: string
          nome: string
          preco: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          cor?: string | null
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number
          id?: string
          nome?: string
          preco?: number
          updated_at?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean
          auth_id: string
          avatar_url: string | null
          cor_agenda: string | null
          created_at: string
          email: string
          id: string
          nome_completo: string
          tipo: Database["public"]["Enums"]["tipo_usuario"]
          updated_at: string
          username: string
        }
        Insert: {
          ativo?: boolean
          auth_id: string
          avatar_url?: string | null
          cor_agenda?: string | null
          created_at?: string
          email: string
          id?: string
          nome_completo: string
          tipo: Database["public"]["Enums"]["tipo_usuario"]
          updated_at?: string
          username: string
        }
        Update: {
          ativo?: boolean
          auth_id?: string
          avatar_url?: string | null
          cor_agenda?: string | null
          created_at?: string
          email?: string
          id?: string
          nome_completo?: string
          tipo?: Database["public"]["Enums"]["tipo_usuario"]
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_id: { Args: never; Returns: string }
      current_user_paciente_id: { Args: never; Returns: string }
      current_user_tipo: {
        Args: never
        Returns: Database["public"]["Enums"]["tipo_usuario"]
      }
      is_team: { Args: never; Returns: boolean }
    }
    Enums: {
      area_permissao:
        | "ver_prontuario"
        | "editar_prontuario"
        | "iniciar_atendimento"
        | "gerenciar_servicos"
        | "gerenciar_usuarios"
        | "editar_configuracoes"
        | "aprovar_solicitacoes"
      status_agendamento:
        | "agendado"
        | "confirmado"
        | "em_andamento"
        | "concluido"
        | "cancelado"
        | "falta"
      status_aprovacao: "pendente" | "aprovado" | "recusado"
      status_atendimento: "em_andamento" | "concluido" | "cancelado"
      status_paciente: "novo" | "ativo" | "em_tratamento" | "inativo"
      tipo_agendamento: "clinica" | "solicitado_cliente"
      tipo_aprovacao: "solicitacao_agendamento" | "novo_cadastro"
      tipo_documento: "termo_consentimento" | "exame" | "receita" | "outro"
      tipo_evolucao:
        | "consulta"
        | "avaliacao"
        | "procedimento"
        | "observacao"
        | "retorno"
        | "exame"
      tipo_foto: "antes" | "durante" | "depois"
      tipo_notificacao:
        | "nova_solicitacao"
        | "agendamento_confirmado"
        | "agendamento_cancelado"
        | "lembrete_consulta"
      tipo_usuario: "admin" | "profissional" | "recepcionista" | "cliente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      area_permissao: [
        "ver_prontuario",
        "editar_prontuario",
        "iniciar_atendimento",
        "gerenciar_servicos",
        "gerenciar_usuarios",
        "editar_configuracoes",
        "aprovar_solicitacoes",
      ],
      status_agendamento: [
        "agendado",
        "confirmado",
        "em_andamento",
        "concluido",
        "cancelado",
        "falta",
      ],
      status_aprovacao: ["pendente", "aprovado", "recusado"],
      status_atendimento: ["em_andamento", "concluido", "cancelado"],
      status_paciente: ["novo", "ativo", "em_tratamento", "inativo"],
      tipo_agendamento: ["clinica", "solicitado_cliente"],
      tipo_aprovacao: ["solicitacao_agendamento", "novo_cadastro"],
      tipo_documento: ["termo_consentimento", "exame", "receita", "outro"],
      tipo_evolucao: [
        "consulta",
        "avaliacao",
        "procedimento",
        "observacao",
        "retorno",
        "exame",
      ],
      tipo_foto: ["antes", "durante", "depois"],
      tipo_notificacao: [
        "nova_solicitacao",
        "agendamento_confirmado",
        "agendamento_cancelado",
        "lembrete_consulta",
      ],
      tipo_usuario: ["admin", "profissional", "recepcionista", "cliente"],
    },
  },
} as const
