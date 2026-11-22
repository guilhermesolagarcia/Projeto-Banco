"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDemo } from "./api";
import { NavIcon } from "./nav-icons";

/*
 * Puts Marina's account back where it started. The screens that read the account
 * (painel, extrato) are marked stale, so they fetch the fresh numbers next time they show.
 */
export function ResetDemoButton({ className }: { className: string }) {
  const queryClient = useQueryClient();
  const reset = useMutation({
    mutationFn: () => postDemo("/api/demo/recomecar"),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["painel"] }),
        queryClient.invalidateQueries({ queryKey: ["extrato"] }),
      ]),
  });

  return (
    <>
      <button
        type="button"
        onClick={() => reset.mutate()}
        disabled={reset.isPending}
        className={className}
      >
        <NavIcon name="reset" className="size-6 text-ink-muted" />
        <span className="min-w-0 flex-1">
          <span className="block font-medium">Recomeçar a demo</span>
          <span className="mt-0.5 block text-sm text-ink-muted">
            A conta da Marina volta ao começo
          </span>
        </span>
      </button>
      {/* Read aloud by screen readers; seen by everyone. */}
      <p role="status" className="-mt-1 pb-4 pl-[38px] text-sm text-ink-muted empty:hidden">
        {reset.isSuccess && "A demo voltou ao começo."}
        {reset.isError && "Não deu para recomeçar agora. Tente de novo."}
      </p>
    </>
  );
}
