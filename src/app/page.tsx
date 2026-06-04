"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CardHead,
  Chip,
  Icon,
  IconButton,
  Input,
  Logo,
  PhotoSlot,
  Pill,
  Toggle,
} from "@/frontend/components/ui";

export default function HomePage() {
  const [toggle, setToggle] = useState(true);
  const [search, setSearch] = useState("");
  const [chip, setChip] = useState("hoje");

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <header style={{ marginBottom: 28 }}>
        <Logo size={28} />
        <p style={{ marginTop: 8, color: "var(--ink-3)", fontSize: 14 }}>
          Demo dos primitivos do design system (temporária — será substituída na Etapa 1)
        </p>
      </header>

      <Card style={{ marginBottom: 16 }}>
        <CardHead title="Buttons & IconButtons" icon="settings" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <Button>Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="quiet">Quiet</Button>
          <Button icon="plus" size="sm">Novo</Button>
          <Button size="lg" iconRight="arrowRight">Continuar</Button>
          <Button disabled>Disabled</Button>
          <span style={{ width: 12 }} />
          <IconButton name="bell" badge />
          <IconButton name="search" active />
          <IconButton name="settings" />
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardHead title="Pills & Chips" icon="filter" />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <Pill kind="ok">Confirmado</Pill>
          <Pill kind="warn">Pendente</Pill>
          <Pill kind="info">Em andamento</Pill>
          <Pill kind="muted">Cancelado</Pill>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Chip active={chip === "hoje"} onClick={() => setChip("hoje")}>Hoje</Chip>
          <Chip active={chip === "semana"} onClick={() => setChip("semana")}>Esta semana</Chip>
          <Chip active={chip === "mes"} onClick={() => setChip("mes")}>Este mês</Chip>
          <Chip icon="filter">Filtros</Chip>
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardHead title="Avatars" icon="users" />
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar name="Ana Beatriz" size={32} />
          <Avatar name="Carlos Drummond" size={40} />
          <Avatar name="Maria Silva" size={56} ring />
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardHead title="Inputs" icon="edit" />
        <div style={{ display: "grid", gap: 14, maxWidth: 420 }}>
          <Input label="Nome completo" placeholder="Digite seu nome" />
          <Input
            label="Buscar paciente"
            icon="search"
            placeholder="Nome, CPF ou e-mail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardHead title="Toggle" icon="sliders" />
        <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
          <Toggle checked={toggle} onChange={setToggle} />
          <span style={{ fontSize: 14 }}>Lembretes por e-mail</span>
        </label>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <CardHead title="PhotoSlot" icon="camera" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <PhotoSlot label="Antes" h={140} />
          <PhotoSlot label="Durante" h={140} />
          <PhotoSlot label="Depois" h={140} />
        </div>
      </Card>

      <Card>
        <CardHead title="Icons (sample)" icon="grid" />
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", color: "var(--ink-2)" }}>
          {(["dashboard", "calendar", "users", "settings", "bell", "search", "plus", "check", "heart", "camera", "lock", "eye"] as const).map((n) => (
            <Icon key={n} name={n} />
          ))}
        </div>
      </Card>
    </main>
  );
}