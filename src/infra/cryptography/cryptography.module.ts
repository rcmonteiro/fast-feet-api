import { Encrypter } from '@/domain/auth/application/criptography/encrypter'
import { HashComparator } from '@/domain/auth/application/criptography/hash-comparator'
import { HashGenerator } from '@/domain/auth/application/criptography/hash-generator'
import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashComparator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashGenerator, HashComparator],
})
export class CryptographyModule {}
