/** Marina's savings boxes ("caixinhas"). Separate from the account: they don't touch the balance. */
export const BOXES: { id: string; name: string; saved: number; goal: number; goalDate: string }[] =
  [
    {
      id: "reserva",
      name: "Reserva de emergência",
      saved: 180000,
      goal: 600000,
      goalDate: "2027-12-31",
    },
    {
      id: "praia",
      name: "Viagem para a praia",
      saved: 45000,
      goal: 200000,
      goalDate: "2027-07-01",
    },
  ];
