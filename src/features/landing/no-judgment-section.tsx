import { Sun } from "@/components/logo";
import { Money } from "@/components/money";
import { PAYDAY, addDays, daysBetween, formatDate } from "./example";
import { JudgmentToggle } from "./judgment-toggle";

// A "what if the month got tight" moment, a few days before payday: same scene for both banks.
const PURCHASE = 8990;
const BALANCE = 5170;
const MOMENT = addDays(PAYDAY, -3);
const DAYS_TO_PAYDAY = daysBetween(MOMENT, PAYDAY);
const LOCK_DATE = formatDate(MOMENT, { weekday: "long", day: "numeric", month: "long" });

/*
 * The scene swap is CSS :has() on two native radios (see JudgmentToggle): it works before any
 * script loads. Motion only slides the pill.
 */
const SWAP = "transition-[opacity,transform,filter,visibility] duration-700 ease-calm";

export function NoJudgmentSection() {
  return (
    <section id="nao-julga" aria-labelledby="nao-julga-title" className="overflow-hidden bg-white">
      <div className="shell group py-24 text-center md:py-36">
        <h2
          id="nao-julga-title"
          className="reveal mx-auto max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl"
        >
          Saldo baixo não é bronca.
        </h2>
        <p className="reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
          E se o mês apertar? Uma compra de <Money cents={PURCHASE} /> no mercado, com{" "}
          <Money cents={BALANCE} /> na conta. O mesmo momento, contado de dois jeitos.
        </p>

        <JudgmentToggle />

        {/* Phone */}
        <div className="reveal relative mx-auto mt-12 w-[17.5rem] sm:w-[19rem]">
          {/* Warm halo behind the phone, only for Âmbar */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -inset-24 -z-0 rounded-full bg-[radial-gradient(closest-side,rgb(242_140_40/0.28),transparent)] opacity-0 blur-2xl ${SWAP} group-has-[#nj-ambar:checked]:opacity-100`}
          />
          <div className="relative aspect-[9/19] rounded-[3rem] bg-ink p-2.5 shadow-[0_40px_80px_-30px_rgb(22_18_14/0.55),inset_0_0_0_1px_rgb(255_255_255/0.08)]">
            <div className="relative h-full overflow-hidden rounded-[2.5rem] text-left">
              {/* Wallpapers: cold for the usual bank, amber light for Âmbar */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(170deg,#3b3f46,#23262b_60%,#1a1c20)]"
              />
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_100%,#f28c28,#8a4310_45%,#15100b_80%)] opacity-0 ${SWAP} group-has-[#nj-ambar:checked]:opacity-100`}
              />

              {/* Lock screen */}
              <div
                aria-hidden="true"
                className="relative mx-auto mt-3 h-6 w-20 rounded-pill bg-black"
              />
              <div aria-hidden="true" className="relative mt-8 text-center text-on-dark">
                <p className="text-sm font-medium opacity-80">{LOCK_DATE}</p>
                <p className="text-7xl leading-none font-semibold tracking-[-0.04em] tabular-nums">
                  14:32
                </p>
              </div>

              <div className="relative mt-10 px-3">
                {/* Usual bank: loud, vague, and it sells credit in the same breath */}
                <div
                  className={`${SWAP} group-has-[#nj-ambar:checked]:invisible group-has-[#nj-ambar:checked]:scale-95 group-has-[#nj-ambar:checked]:opacity-0 group-has-[#nj-ambar:checked]:blur-sm`}
                >
                  <div className="rounded-[1.4rem] bg-white/80 p-3.5 backdrop-blur-xl">
                    <p className="flex items-center justify-between text-xs text-[#5c5c5c]">
                      <span className="flex items-center gap-2 font-semibold tracking-wide uppercase">
                        <span aria-hidden="true" className="size-5 rounded-md bg-[#8a8f98]" />
                        Banco
                      </span>
                      agora
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#b3261e] uppercase">
                      Saldo insuficiente
                    </p>
                    <p className="text-sm text-[#2f2f2f]">Transação negada. Cód. 51.</p>
                  </div>
                  <div className="mx-2 -mt-1 rounded-b-[1.2rem] bg-white/55 p-3 pt-4 backdrop-blur-xl">
                    <p className="text-sm text-[#2f2f2f]">
                      <span className="font-semibold">Limite Especial liberado!</span> Contrate
                      agora com 8,9% a.m.
                    </p>
                  </div>
                </div>

                {/* Âmbar: what happened, how much, and the next step */}
                <div
                  className={`absolute inset-x-3 top-0 invisible scale-105 opacity-0 blur-sm ${SWAP} group-has-[#nj-ambar:checked]:visible group-has-[#nj-ambar:checked]:scale-100 group-has-[#nj-ambar:checked]:opacity-100 group-has-[#nj-ambar:checked]:blur-none`}
                >
                  <div className="rounded-[1.4rem] bg-[#fbf6ef]/80 p-3.5 text-ink shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl">
                    <p className="flex items-center justify-between text-xs text-ink-muted">
                      <span className="flex items-center gap-2 font-semibold text-ink">
                        <span className="grid size-5 place-items-center rounded-md bg-resin text-amber">
                          <Sun variant="compact" size={14} />
                        </span>
                        Âmbar
                      </span>
                      agora
                    </p>
                    <p className="mt-2 text-sm leading-snug font-semibold">
                      Faltaram <Money cents={PURCHASE - BALANCE} /> para a compra no mercado.
                    </p>
                    <p className="mt-1 text-sm leading-snug text-ink-muted">
                      Seu salário cai em {DAYS_TO_PAYDAY} dias. Se for urgente, dá para usar a
                      reserva. Sem tarifa, sem juros.
                    </p>
                  </div>
                </div>
              </div>

              {/* Home indicator */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-2 mx-auto h-1 w-24 rounded-pill bg-white/70"
              />
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-md text-lg text-ink-muted">
          <span className={`group-has-[#nj-ambar:checked]:hidden`}>
            Grita, não diz quanto falta e ainda aproveita para vender crédito.
          </span>
          <span className={`hidden group-has-[#nj-ambar:checked]:inline`}>
            Diz quanto falta e qual é o próximo passo.
          </span>
        </p>
      </div>
    </section>
  );
}
