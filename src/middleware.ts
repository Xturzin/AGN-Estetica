import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/backend/lib/supabase/middleware";
import type { Database } from "@/supabase/types/database.types";

type RouteArea = "public" | "admin" | "clinic" | "client";
type TipoUsuario = Database["public"]["Enums"]["tipo_usuario"];

const PUBLIC_PATHS = ["/", "/login", "/admin/login", "/cliente/login"];

function getRouteArea(path: string): RouteArea {
  if (PUBLIC_PATHS.includes(path)) return "public";
  if (path.startsWith("/api/")) return "public";
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/cliente")) return "client";
  return "clinic";
}

function loginUrlForArea(area: RouteArea): string {
  switch (area) {
    case "admin":
      return "/admin/login";
    case "client":
      return "/cliente/login";
    case "clinic":
    default:
      return "/login";
  }
}

function defaultRouteForTipo(tipo: TipoUsuario): string {
  switch (tipo) {
    case "admin":
      return "/admin/dashboard";
    case "profissional":
    case "recepcionista":
      return "/dashboard";
    case "cliente":
      return "/cliente/home";
  }
}

function canAccess(tipo: TipoUsuario, area: RouteArea): boolean {
  switch (area) {
    case "public":
      return true;
    case "admin":
      return tipo === "admin";
    case "clinic":
      return tipo === "admin" || tipo === "profissional" || tipo === "recepcionista";
    case "client":
      return tipo === "cliente";
  }
}

export async function middleware(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request);

  const path = request.nextUrl.pathname;
  const area = getRouteArea(path);

  // Rotas públicas: só renova sessão e segue
  if (area === "public") return response;

  // Não autenticado em rota protegida: redirect pra login da área tentada
  if (!user) {
    return NextResponse.redirect(new URL(loginUrlForArea(area), request.url));
  }

  // Autenticado: verifica tipo no banco
  const { data: usuario } = await supabase
    .from("usuarios")
    .select("tipo")
    .eq("auth_id", user.id)
    .single();

  // User em auth.users mas sem linha em public.usuarios (situação fora do padrão)
  if (!usuario) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Tipo errado pra área tentada: redirect pra área correta
  if (!canAccess(usuario.tipo, area)) {
    return NextResponse.redirect(new URL(defaultRouteForTipo(usuario.tipo), request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Roda em todas as rotas EXCETO:
     *  - _next/static (arquivos estáticos)
     *  - _next/image (otimização de imagem)
     *  - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};