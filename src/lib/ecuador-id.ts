/** Valida cédula ecuatoriana (10 dígitos, módulo 10). Acepta pasaporte alfanumérico de 6+ caracteres. */
export function isValidEcuadorId(value: string): boolean {
  const v = value.trim();
  if (!/^\d{10}$/.test(v)) return /^[A-Za-z0-9]{6,15}$/.test(v); // pasaporte / extranjero

  const province = Number(v.slice(0, 2));
  if (province < 1 || (province > 24 && province !== 30)) return false;
  const third = Number(v[2]);
  if (third > 5) return false;

  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  const sum = coefficients.reduce((acc, c, i) => {
    let n = Number(v[i]) * c;
    if (n > 9) n -= 9;
    return acc + n;
  }, 0);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(v[9]);
}
