import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        { status: "error", source: "supabase.auth", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      supabase: {
        connected: true,
        hasSession: data.session !== null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}