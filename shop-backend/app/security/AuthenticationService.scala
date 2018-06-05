package security

import javax.inject.Inject
import models.user.{User, UserRole}
import repositories.UserRepository

import scala.concurrent.ExecutionContext

class AuthenticationService  @Inject()(userRepository: UserRepository)
                                      (implicit ec: ExecutionContext)  {

    def addGoogleUser(email: String, token: String, role: UserRole): Unit = {
//        Encryption.encrypt()

    }

}
