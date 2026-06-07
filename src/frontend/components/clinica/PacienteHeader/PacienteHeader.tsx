import Link from "next/link";
import { Icon } from "@/frontend/components/ui";
import type { Paciente } from "@/backend/services/pacienteService";
import styles from "./PacienteHeader.module.css";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

function calcAge(birth: string | null): string | null {
  if (!birth) return null;
  const b = new Date(birth);
  if (isNaN(b.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return `${age} anos`;
}

function formatLocation(p: Paciente): string | null {
  if (p.cidade && p.estado) return `${p.cidade}/${p.estado}`;
  return p.cidade ?? null;
}

export function PacienteHeader({ paciente }: { paciente: Paciente }) {
  const age = calcAge(paciente.data_nascimento);
  const location = formatLocation(paciente);

  return (
    <header className={styles.header}>
      <Link href="/pacientes" className={styles.backLink}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>{" "}
        Voltar para pacientes
      </Link>

      <div className={styles.row}>
        <div className={styles.avatar}>
          {paciente.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={paciente.foto_url} alt={paciente.nome_completo} />
          ) : (
            <span>{getInitials(paciente.nome_completo)}</span>
          )}
        </div>

        <div className={styles.identity}>
          <h1 className={styles.name}>{paciente.nome_completo}</h1>
          <div className={styles.meta}>
            {age && <span>{age}</span>}
            {age && location && <span className={styles.dot}>·</span>}
            {location && <span>{location}</span>}
            {!paciente.ativo && (
              <span className={styles.badgeInativo}>Inativo</span>
            )}
          </div>
          <div className={styles.contacts}>
            {paciente.telefone && (
              <span className={styles.contact}>
                <Icon name="phone" size={14} /> {paciente.telefone}
              </span>
            )}
            {paciente.email && (
              <span className={styles.contact}>
                <Icon name="mail" size={14} /> {paciente.email}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}