import { AppError } from '../lib/errors.js'
import type {
  CreateReservaInput,
  ReservaRepository,
  UpdateReservaInput,
} from '../repositories/reserva.repository.js'
import type { ReservaFilters } from '../types/domain.js'

export class ReservaService {
  constructor(private readonly reservas: ReservaRepository) {}

  create(input: CreateReservaInput) {
    return this.reservas.create(input)
  }

  async update(id: number, input: UpdateReservaInput) {
    const updated = await this.reservas.update(id, input)
    if (!updated) {
      throw new AppError('RESERVA_NOT_FOUND', 'La reserva no existe', 404)
    }
    return updated
  }

  list(filters: ReservaFilters) {
    return this.reservas.list(filters)
  }

  listAvailable(fechaReserva: string, cantidadPersonas: number) {
    return this.reservas.listAvailable(fechaReserva, cantidadPersonas)
  }
}
