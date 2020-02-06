import { HttpRequest, HttpResponse, EmailValidator, Controller } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { BadRequest, serverError } from '../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConformation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return BadRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
