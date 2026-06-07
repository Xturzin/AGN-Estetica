"use client";

import { useState } from "react";
import { Card } from "@/frontend/components/ui";
import styles from "./PermissoesMatrix.module.css";

export interface PermissaoToggleResult {
  error?: string;
  success?: string;
}

interface MatrixCell {
  habilitado: boolean;
}

type Matrix = Record<string, Record<string, MatrixCell>>;

interface OptionLabel {
  id: string;
  label: string;
}

interface PermissoesMatrixProps {
  initialMatrix: Matrix;
  perfis: OptionLabel[];
  areas: OptionLabel[];
  toggleAction: (formData: FormData) => Promise<PermissaoToggleResult>;
}

export function PermissoesMatrix({
  initialMatrix,
  perfis,
  areas,
  toggleAction,
}: PermissoesMatrixProps) {
  const [matrix, setMatrix] = useState<Matrix>(initialMatrix);
  const [error, setError] = useState<string | null>(null);
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());

  function cellKey(perfilId: string, areaId: string): string {
    return `${perfilId}:${areaId}`;
  }

  async function handleToggle(perfilId: string, areaId: string) {
    const key = cellKey(perfilId, areaId);
    if (pendingKeys.has(key)) return;

    const currentValue = matrix[perfilId]?.[areaId]?.habilitado ?? false;
    const newValue = !currentValue;

    // Optimistic update
    setMatrix((prev) => ({
      ...prev,
      [perfilId]: {
        ...prev[perfilId],
        [areaId]: { habilitado: newValue },
      },
    }));
    setPendingKeys((prev) => new Set(prev).add(key));
    setError(null);

    const formData = new FormData();
    formData.append("perfil", perfilId);
    formData.append("area", areaId);
    formData.append("habilitado", String(newValue));

    const result = await toggleAction(formData);

    setPendingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });

    if (result.error) {
      // Revert
      setMatrix((prev) => ({
        ...prev,
        [perfilId]: {
          ...prev[perfilId],
          [areaId]: { habilitado: currentValue },
        },
      }));
      setError(result.error);
    }
  }

  return (
    <div className={styles.wrapper}>
      {error && <div className={styles.errorBox}>{error}</div>}

      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.areaHead}>Área</th>
                {perfis.map((p) => (
                  <th key={p.id} className={styles.perfilHead}>
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.id}>
                  <td className={styles.areaCell}>{area.label}</td>
                  {perfis.map((p) => {
                    const checked = matrix[p.id]?.[area.id]?.habilitado ?? false;
                    const isPending = pendingKeys.has(cellKey(p.id, area.id));
                    return (
                      <td key={p.id} className={styles.toggleCell}>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          aria-label={`${p.label} - ${area.label}`}
                          className={`${styles.toggle} ${checked ? styles.toggleOn : ""} ${isPending ? styles.togglePending : ""}`}
                          onClick={() => handleToggle(p.id, area.id)}
                          disabled={isPending}
                        >
                          <span className={styles.toggleKnob} />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className={styles.hint}>
        Alterações são salvas automaticamente. Admin sempre tem todas as permissões.
      </p>
    </div>
  );
}