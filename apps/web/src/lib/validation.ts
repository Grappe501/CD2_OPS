export type FieldError = { field: string; message: string };

export function required(value: string, message: string): string | null {
  return value.trim().length ? null : message;
}

export function maxLen(value: string, n: number, message?: string): string | null {
  return value.length <= n ? null : (message ?? `Must be ${n} characters or less.`);
}

export function asISODateTimeLocal(v: string): string | null {
  // Accepts "YYYY-MM-DDTHH:MM" from datetime-local
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) return v;
  return null;
}

export function collectErrors(errs: Array<FieldError | null | undefined>): FieldError[] {
  return errs.filter(Boolean) as FieldError[];
}

export function firstErrorByField(errors: FieldError[], field: string): string | null {
  return errors.find((e) => e.field === field)?.message ?? null;
}
