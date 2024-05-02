import { Courier } from '@/domain/auth/enterprise/entities/courier'

export abstract class CourierPresenter {
  static toHTTP(courier: Courier) {
    return {
      id: courier.id.toString(),
      name: courier.name,
      email: courier.email,
      cpf: courier.cpf,
    }
  }
}
