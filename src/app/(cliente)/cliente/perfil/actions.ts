"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/backend/lib/supabase/server";

export async function logoutClienteAction(): Promise<void> {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/cliente/login");
}