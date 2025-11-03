"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string; agree?: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem("login:email");
    if (saved) setEmail(saved);
  }, []);

  function validateForm() {
    const errs: { fullName?: string; email?: string; password?: string; confirmPassword?: string; agree?: string } = {};

    if (!fullName.trim()) errs.fullName = "Informe seu nome completo.";

    if (!email.trim()) errs.email = "Informe seu e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "E-mail inválido.";

    if (!password) errs.password = "Informe sua senha.";
    else if (password.length < 6) errs.password = "A senha deve ter pelo menos 6 caracteres.";

    if (!confirmPassword) errs.confirmPassword = "Confirme sua senha.";
    else if (confirmPassword !== password) errs.confirmPassword = "As senhas não coincidem.";

    if (!agree) errs.agree = "Você precisa aceitar os termos.";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName.trim(), email: email.trim(), password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Falha ao criar conta.");
      }

      const data = await res.json();

      // exemplo: se o backend retornar token, salvar e redirecionar
      if (data?.token) localStorage.setItem("auth:token", data.token);

      // opcional: salvar email para facilitar login
      localStorage.setItem("login:email", email.trim());

      // redireciona para a tela de login (ou dashboard, conforme desejar)
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-10 ">
      <div className="w-full max-w-md bg-gray-850/90 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-1">Criar conta</h1>
          <p className="text-sm text-gray-300 mb-6">Cadastre-se para acessar o painel</p>

          {error && (
            <div className="mb-4 rounded-md bg-red-600/90 text-white px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <label className="block">
              <span className="text-xs text-gray-300">Nome completo</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`mt-1 block w-full rounded-lg px-3 py-2 bg-gray-900 border ${
                  fieldErrors.fullName ? "border-red-500" : "border-gray-700"
                } text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500`}
                placeholder="Seu nome"
                aria-invalid={!!fieldErrors.fullName}
                aria-describedby={fieldErrors.fullName ? "err-fullname" : undefined}
              />
              {fieldErrors.fullName && (
                <p id="err-fullname" className="mt-1 text-xs text-red-400">
                  {fieldErrors.fullName}
                </p>
              )}
            </label>

            <label className="block">
              <span className="text-xs text-gray-300">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full rounded-lg px-3 py-2 bg-gray-900 border ${
                  fieldErrors.email ? "border-red-500" : "border-gray-700"
                } text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500`}
                placeholder="seu@exemplo.com"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "err-email" : undefined}
              />
              {fieldErrors.email && (
                <p id="err-email" className="mt-1 text-xs text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </label>

            <label className="block relative">
              <span className="text-xs text-gray-300">Senha</span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full rounded-lg px-3 py-2 bg-gray-900 border ${
                  fieldErrors.password ? "border-red-500" : "border-gray-700"
                } text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500`}
                placeholder="••••••••"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? "err-password" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-8 text-gray-300 hover:text-white p-1 rounded"
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.3-6.3M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>

              {fieldErrors.password && (
                <p id="err-password" className="mt-1 text-xs text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </label>

            <label className="block">
              <span className="text-xs text-gray-300">Confirme a senha</span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 block w-full rounded-lg px-3 py-2 bg-gray-900 border ${
                  fieldErrors.confirmPassword ? "border-red-500" : "border-gray-700"
                } text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500`}
                placeholder="Repita a senha"
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={fieldErrors.confirmPassword ? "err-confirm" : undefined}
              />
              {fieldErrors.confirmPassword && (
                <p id="err-confirm" className="mt-1 text-xs text-red-400">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </label>

            <label className="inline-flex items-start gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                className={`form-checkbox h-4 w-4 text-indigo-500 bg-gray-800 border-gray-700 rounded ${fieldErrors.agree ? "ring-2 ring-red-500" : ""}`}
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span className="text-xs">Aceito os termos e políticas de privacidade</span>
            </label>
            {fieldErrors.agree && <p className="mt-1 text-xs text-red-400">{fieldErrors.agree}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition ${
                  loading ? "bg-indigo-700/70 cursor-wait" : "bg-indigo-600 hover:bg-indigo-500"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeDasharray="60" strokeLinecap="round" fill="none" />
                    </svg>
                    Criando...
                  </>
                ) : (
                  "Criar conta"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Ou cadastre-se com
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                type="button"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 hover:bg-gray-700"
                onClick={() => alert("Cadastro com Google - integrar OAuth")}
              >
                Google
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 hover:bg-gray-700"
                onClick={() => alert("Cadastro com Facebook - integrar OAuth")}
              >
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Já tem conta?{" "}
            <button onClick={() => router.push("/login")} className="text-indigo-400 hover:underline">
              Entrar
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
