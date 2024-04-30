import { UseCaseError } from '@/core/error/use-case-error'

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`User "${identifier}" already exists`)
  }
}
