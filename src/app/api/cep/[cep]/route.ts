import { NextResponse } from "next/server";

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  ddd: string;
  erro?: boolean;
}

export async function GET(
  _request: Request,
  { params }: { params: { cep: string } }
) {
  const cep = params.cep.replace(/\D/g, "");

  if (cep.length !== 8) {
    return NextResponse.json(
      { data: null, error: { message: "CEP inválido", code: "invalid_cep" } },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      // CEP raramente muda — cache de 24h
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { data: null, error: { message: "Erro ao consultar CEP", code: "external_error" } },
        { status: 502 }
      );
    }

    const data = (await response.json()) as ViaCEPResponse;

    if (data.erro) {
      return NextResponse.json(
        { data: null, error: { message: "CEP não encontrado", code: "cep_not_found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { data: null, error: { message, code: "fetch_failed" } },
      { status: 500 }
    );
  }
}