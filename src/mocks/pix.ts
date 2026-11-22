/** Pix contacts and Marina's own keys. Every person, e-mail and number here is fictional. */
type KeyType = "email" | "telefone" | "cpf" | "aleatoria";

export const PIX_CONTACTS: { id: string; name: string; key: string; keyType: KeyType }[] = [
  { id: "c1", name: "Lucas Andrade", key: "lucas.andrade@ambar.demo", keyType: "email" },
  { id: "c2", name: "Bia Moreira", key: "+55 11 98888-0142", keyType: "telefone" },
  { id: "c3", name: "Rafa Tanaka", key: "123.456.789-09", keyType: "cpf" },
  {
    id: "c4",
    name: "Dona Célia (aluguel)",
    key: "7f3c2a90-5e1b-4c8d-9a26-1b0e8f4d6c71",
    keyType: "aleatoria",
  },
];

export const PIX_KEYS: { key: string; keyType: KeyType }[] = [
  { key: "marina@ambar.demo", keyType: "email" },
  { key: "+55 11 97777-0199", keyType: "telefone" },
];
