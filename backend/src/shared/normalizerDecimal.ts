import { Decimal } from "@prisma/client/runtime/library";

export function normalizerDecimal(value: any, fieldName: string): Decimal {
    if (value === undefined || value === null || value === "") {
        throw new Error(`${fieldName} es requerido`);
    }

    const normalized = String(value).replace(",", ".").trim();

    if (normalized === "" || isNaN(Number(normalized))) {
        throw new Error(`${fieldName} inválido`);
    }

    return new Decimal(normalized);
}