import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SutTypes {
  sut: DbAddAccount,
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStup {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  const encrypterStub = new EncrypterStup()
  const sut = new DbAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', () => {    
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'

    }

    sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})