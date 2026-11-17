"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DEMO_ACCOUNT,
  hasSession,
  isDemoAccount,
  startSession,
  subscribeToSession,
} from "./session";

// Messages say what is missing and how to fix it. They never blame the person.
const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: `Falta o e-mail. O da demo é ${DEMO_ACCOUNT.email}.` })
    .pipe(z.email({ error: "Esse e-mail parece incompleto. Confere o @ e o final?" })),
  password: z.string().min(1, { error: "Falta a senha. A da demo está logo abaixo." }),
});

type LoginValues = z.infer<typeof schema>;

const FIELD =
  "mt-2 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-lg transition-colors hover:border-ink/30 focus:border-amber-signal focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-signal aria-invalid:border-attention";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm text-attention">
      <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-attention" />
      {message}
    </p>
  );
}

export function LoginForm() {
  const router = useRouter();

  // Already signed in: skip the form.
  const signedIn = useSyncExternalStore(subscribeToSession, hasSession, () => false);
  useEffect(() => {
    if (signedIn) router.replace("/inicio");
  }, [signedIn, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password },
  });

  function onSubmit({ email, password }: LoginValues) {
    if (!isDemoAccount(email, password)) {
      setError("root", {
        message: "Esses não são os dados da conta demo. Use o e-mail e a senha que aparecem aqui.",
      });
      return;
    }
    startSession();
    router.push("/inicio");
  }

  return (
    // POST: a click before hydration must never put the password in the URL.
    <form method="post" noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={FIELD}
          {...register("email")}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="password" className="font-medium">
          Senha
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error password-hint" : "password-hint"}
          className={FIELD}
          {...register("password")}
        />
        <FieldError id="password-error" message={errors.password?.message} />
        <p id="password-hint" className="mt-2 text-sm text-ink-muted">
          Senha da demo: <span className="font-medium text-ink">{DEMO_ACCOUNT.password}</span>
        </p>
      </div>

      <div role="alert">
        <FieldError id="form-error" message={errors.root?.message} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-pill bg-ink px-6 py-4 text-lg font-medium text-paper transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
      >
        Entrar como Marina
      </button>
    </form>
  );
}
