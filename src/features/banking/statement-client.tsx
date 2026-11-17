"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStatement } from "./api";
import { CARD } from "./dashboard-skeleton";
import { Statement } from "./statement";
import { StatementSkeleton } from "./statement-skeleton";

export function StatementClient() {
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["extrato"],
    queryFn: fetchStatement,
  });

  if (isPending) return <StatementSkeleton />;

  if (isError) {
    return (
      <div role="alert" className={`${CARD} max-w-xl`}>
        <h2 className="text-3xl leading-tight font-semibold tracking-tight">
          Não conseguimos carregar o extrato agora.
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-muted">
          Suas transações estão no mesmo lugar. Deve ser a conexão: tente de novo em instantes.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-8 rounded-pill bg-ink px-6 py-3.5 font-medium text-paper transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        >
          {isFetching ? "Tentando…" : "Tentar de novo"}
        </button>
      </div>
    );
  }

  if (data.months.length === 0) {
    return (
      <div className={`${CARD} max-w-xl`}>
        <h2 className="text-2xl font-semibold tracking-tight">Nenhuma transação por aqui ainda.</h2>
        <p className="mt-2 text-ink-muted">
          Quando o dinheiro entrar ou sair, ele aparece aqui, com o nome de quem cobrou.
        </p>
      </div>
    );
  }

  return <Statement data={data} />;
}
