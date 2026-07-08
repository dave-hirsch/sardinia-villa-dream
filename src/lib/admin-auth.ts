import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "not-admin"; email: string }
  | { status: "admin"; email: string; userId: string };

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        if (!cancelled) setState({ status: "signed-out" });
        return;
      }
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (cancelled) return;
      if (error || !data) setState({ status: "not-admin", email: user.email ?? "" });
      else setState({ status: "admin", email: user.email ?? "", userId: user.id });
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") check();
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return state;
}
