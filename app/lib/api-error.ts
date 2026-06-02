import { NextResponse } from "next/server"
import { ZodError } from "zod"

export function apiError(status: number, code: string, message: string, details?: unknown) {
  return NextResponse.json(
    { error: { code, message, ...(details !== undefined ? { details } : {}) } },
    { status },
  )
}

export function validationError(err: ZodError) {
  return apiError(422, "VALIDATION_ERROR", "Données invalides.", err.issues.map(issue => ({
    field:   issue.path.join("."),
    message: issue.message,
  })))
}
