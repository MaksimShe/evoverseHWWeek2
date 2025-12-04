import { useState, useEffect, useCallback } from "react";
import { supabase } from "../helper/supabaseClient";

export interface Account {
  id: string;
  email: string;
  username?: string;
  balance: number;
}

export function useAuth() {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadProfile(data.session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    setLoading(false);
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) setUser(data);
  };

  const register = useCallback(
    async (email: string, password: string, username?: string) => {
      setLoading(true);
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError || !authData.user) throw authError;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: authData.user.id, email, username, balance: 1000 }])
          .select()
          .single();

        if (profileError || !profileData) throw profileError;

        setUser(profileData);
        return profileData;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error || !data.user) throw error;
      await loadProfile(data.user.id);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const addMoney = async (addMoney: number) => {
    if (!user) return;

    const newBalance = user.balance + addMoney;

    const { data, error } = await supabase
      .from("profiles")
      .update({ balance: +newBalance.toFixed(2) })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Balance update error:", error);
      return;
    }

    if (data) setUser(data);
  };

  return { user, loading, login, register, logout, addMoney };
}
