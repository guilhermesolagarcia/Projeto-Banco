/** Business numbers, in one place so a price change is one edit. Cents and fractions. */
export const BUSINESS = {
  plusMonthlyPrice: 1490,
  cashback: { mango: 0.03, nexo: 0.05, zod: 0.1, dragos: 0.05 },
  referenceMonthlyInterest: 0.01,
} as const;
