/**
 * Marina's account: the single demo dataset (it becomes MSW's data in step 4).
 * Every number the landing shows comes out of here through the insight rules:
 * balance R$ 4.218,90 · R$ 2.958,90 scheduled until payday · R$ 54,00/day variable spending
 * (last 60 days) · delivery R$ 380 vs R$ 260 at the same point of last month · streaming up R$ 5.
 * Money in integer cents; dates as "YYYY-MM-DD" in São Paulo time. Merchants are fictional.
 */

export type Category =
  | "salario"
  | "moradia"
  | "educacao"
  | "contas"
  | "assinaturas"
  | "mercado"
  | "delivery"
  | "transporte"
  | "lazer"
  | "saude";

/** Day-to-day spending: the base of the daily average (Rule 1) and of the comparison (Rule 2). */
export const VARIABLE_CATEGORIES: readonly Category[] = [
  "mercado",
  "delivery",
  "transporte",
  "lazer",
  "saude",
];

export type Transaction = {
  id: string;
  date: string;
  /** Raw text as it arrives from the card network, e.g. "RANGO*PEDIDO 4471". */
  description: string;
  /** Readable name for the statement, e.g. "Rango Delivery". */
  merchant: string;
  category: Category;
  /** Cents. Negative = money out, positive = money in. */
  amount: number;
};

export type ScheduledPayment = Omit<Transaction, "id" | "amount"> & { amount: number };

/** "Today" is frozen so "renova amanhã" keeps working after the deploy. */
export const TODAY = "2026-11-23";
export const PAYDAY = "2026-12-05";
export const START = "2026-08-01";

const SALARY = 445000;
/** Balance on July 31, chosen so that today's balance is R$ 4.218,90 (checked in marina.check.mts). */
export const OPENING_BALANCE = 322370;

type Merchant = Pick<Transaction, "description" | "merchant" | "category">;

const M = {
  salary: { description: "TED SALARIO ACME LTDA", merchant: "Salário", category: "salario" },
  rent: { description: "TED ALUGUEL IMOB CENTRO", merchant: "Aluguel", category: "moradia" },
  english: {
    description: "ESCOLA IDIOMAS*MENS",
    merchant: "Curso de inglês",
    category: "educacao",
  },
  streaming: {
    description: "STREAMFLIX*ASSINATURA",
    merchant: "StreamFlix",
    category: "assinaturas",
  },
  internet: { description: "CONECTA FIBRA 0800", merchant: "Internet", category: "contas" },
  phone: { description: "LINHA MOVEL*PLANO", merchant: "Plano de celular", category: "contas" },
  power: { description: "ENERGIA SP CONTA", merchant: "Conta de luz", category: "contas" },
  music: { description: "SOMPLAY*ASSINATURA", merchant: "SomPlay", category: "assinaturas" },
  gym: { description: "ACADEMIA MOVE UNID 3", merchant: "Academia Move", category: "contas" },
  market: {
    description: "MERCADO BOM PRECO 0231",
    merchant: "Mercado Bom Preço",
    category: "mercado",
  },
  bakery: {
    description: "PADARIA STA LUZIA",
    merchant: "Padaria Santa Luzia",
    category: "mercado",
  },
  bulk: { description: "ATACADO POPULAR 12", merchant: "Atacado Popular", category: "mercado" },
  ride: { description: "VAI*CORRIDA", merchant: "Vai Corridas", category: "transporte" },
  food: { description: "RANGO*PEDIDO", merchant: "Rango Delivery", category: "delivery" },
  cinema: { description: "CINE ARTE PAULISTA", merchant: "Cine Arte", category: "lazer" },
  show: { description: "TICKETS*SHOW", merchant: "Ingresso de show", category: "lazer" },
  pharmacy: { description: "DROGARIA VIDA 88", merchant: "Drogaria Vida", category: "saude" },
} satisfies Record<string, Merchant>;

/** Monthly bills: [merchant, day of month, cents by month (Aug, Sep, Oct, Nov)]. */
const BILLS: readonly [Merchant, number, readonly number[]][] = [
  [M.rent, 1, [180000, 180000, 180000, 180000]],
  [M.english, 2, [59000, 59000, 59000, 59000]],
  // The planted price rise: R$ 34,90 → R$ 39,90 in October (Rule 3).
  [M.streaming, 24, [3490, 3490, 3990]],
  [M.internet, 26, [11990, 11990, 11990]],
  [M.phone, 27, [5990, 5990, 5990]],
  [M.power, 28, [21980, 23150, 22740]],
  [M.music, 29, [2190, 2190, 2190]],
  [M.gym, 30, [9990, 9990, 9990]],
];

/** Weekly habits by weekday (0 = Sunday); amounts cycle week by week, 0 means "not this week". */
const WEEKLY: Readonly<Record<number, readonly [Merchant, readonly number[]]>> = {
  0: [M.cinema, [6400, 0, 3850, 0]],
  1: [M.ride, [1870]],
  2: [M.bakery, [1490]],
  4: [M.bakery, [1690]],
  5: [M.ride, [2380, 2650]],
  6: [M.market, [18640, 9230, 15410, 11280]],
};

/** One-off purchases: [merchant, "MM-DD", cents]. Delivery spikes in November (Rule 2). */
const ONE_OFF: readonly [Merchant, string, number][] = [
  [M.food, "08-03", 4290],
  [M.food, "08-10", 3850],
  [M.food, "08-17", 5120],
  [M.food, "08-24", 4680],
  [M.food, "08-29", 3990],
  [M.food, "09-04", 4410],
  [M.food, "09-12", 3780],
  [M.food, "09-19", 5230],
  [M.food, "09-26", 4560],
  [M.food, "10-03", 4890],
  [M.food, "10-09", 5170],
  [M.food, "10-15", 4260],
  [M.food, "10-21", 5040],
  [M.food, "10-22", 6640],
  [M.food, "10-28", 4720],
  [M.food, "11-02", 5480],
  [M.food, "11-06", 4930],
  [M.food, "11-09", 6120],
  [M.food, "11-13", 5870],
  [M.food, "11-16", 7340],
  [M.food, "11-20", 4590],
  [M.food, "11-22", 3670],
  [M.pharmacy, "08-14", 4790],
  [M.pharmacy, "09-11", 3260],
  [M.pharmacy, "10-16", 5810],
  [M.pharmacy, "11-12", 3990],
  [M.show, "09-27", 24000],
  [M.bulk, "10-30", 13300],
];

const DAY_MS = 86_400_000;
const isoDay = (date: Date) => date.toISOString().slice(0, 10);

function buildHistory(): Transaction[] {
  const rows: Omit<Transaction, "id">[] = [];
  const out = (date: string, merchant: Merchant, cents: number) =>
    rows.push({ date, ...merchant, amount: -cents });

  let week = 0;
  for (let t = Date.parse(START); t <= Date.parse(TODAY); t += DAY_MS) {
    const date = new Date(t);
    const iso = isoDay(date);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() - 7; // 0 = August

    if (day === 5) rows.push({ date: iso, ...M.salary, amount: SALARY });
    for (const [merchant, billDay, amounts] of BILLS) {
      const cents = amounts[month];
      if (billDay === day && cents) out(iso, merchant, cents);
    }

    const weekday = date.getUTCDay();
    if (weekday === 6) week++;
    const habit = WEEKLY[weekday];
    if (habit) {
      const [merchant, cycle] = habit;
      const cents = cycle[week % cycle.length];
      if (cents) out(iso, merchant, cents);
    }

    for (const [merchant, monthDay, cents] of ONE_OFF) {
      if (iso.endsWith(monthDay)) out(iso, merchant, cents);
    }
  }

  // Newest first, like a real statement.
  return rows
    .reverse()
    .map((row, index) => ({ id: `t${String(rows.length - index).padStart(3, "0")}`, ...row }));
}

export const TRANSACTIONS: readonly Transaction[] = buildHistory();

/** Bills already scheduled between tomorrow and payday (Rule 1). */
export const SCHEDULED: readonly ScheduledPayment[] = [
  { date: "2026-11-24", ...M.streaming, amount: 3990 },
  { date: "2026-11-26", ...M.internet, amount: 11990 },
  { date: "2026-11-27", ...M.phone, amount: 5990 },
  { date: "2026-11-28", ...M.power, amount: 22740 },
  { date: "2026-11-29", ...M.music, amount: 2190 },
  { date: "2026-11-30", ...M.gym, amount: 9990 },
  { date: "2026-12-01", ...M.rent, amount: 180000 },
  { date: "2026-12-02", ...M.english, amount: 59000 },
];
