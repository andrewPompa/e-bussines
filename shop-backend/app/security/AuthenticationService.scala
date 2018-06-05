package security

import java.sql.Timestamp
import java.util.{Calendar, Date}

import javax.inject.Inject
import models.user.{User, UserRole}
import org.joda.time.DateTime
import repositories.UserRepository
import services.OAuthConfigurationService

import scala.concurrent.{ExecutionContext, Future}

class AuthenticationService @Inject()(userRepository: UserRepository,
                                      oAuthConfigurationService: OAuthConfigurationService)
                                     (implicit ec: ExecutionContext) {

    def addGoogleUser(email: String, token: String, role: Int): Future[User] = {
        val googleToken = Encryption.encrypt(oAuthConfigurationService.APP_KEY, token)
        userRepository.listUserByEmail(email).flatMap { userOption =>
            if (userOption.isDefined) {
                val user = userOption.get
                val userToUpdate = User(user.id, user.email, user.role, Option(googleToken), Option(getTokenExpiry), user.githubToken, user.githubTokenExpiryDate)
                userRepository.updateUser(userToUpdate)
                Future {
                    userToUpdate
                }
            } else {
                val newUser = User(-1, email, UserRole.User, Option(googleToken), Option(getTokenExpiry), Option.empty, Option.empty)
                userRepository.addNewUser(newUser)
                Future {
                    newUser
                }
            }
        }
    }
    def addGithubUser(email: String, token: String, role: Int): Future[User] = {
        val githubToken = Encryption.encrypt(oAuthConfigurationService.APP_KEY, token)
        userRepository.listUserByEmail(email).flatMap { userOption =>
            if (userOption.isDefined) {
                val user = userOption.get
                val userToUpdate = User(user.id, user.email, user.role, user.googleToken, user.googleTokenExpiryDate, Option(githubToken), Option(getTokenExpiry))
                userRepository.updateUser(userToUpdate)
                Future {
                    userToUpdate
                }
            } else {
                val newUser = User(-1, email, UserRole.User, Option.empty, Option.empty, Option(githubToken), Option(getTokenExpiry))
                userRepository.addNewUser(newUser)
                Future {
                    newUser
                }
            }
        }
    }

    def checkGoogleUser(user: String, googleToken: String): Future[Option[User]] = {
        userRepository.listUserByEmailAndGoogleToken(user, googleToken).map { userOption =>
            if (userOption.isEmpty) {
                Option.empty[User]
            } else {
                val user = userOption.get

                if (isTokenExpired(user.googleTokenExpiryDate.get)) {
                    Option.empty[User]
                } else {
                    val userToUpdate = User(user.id, user.email, user.role, user.googleToken, Option(getTokenExpiry), user.githubToken, user.githubTokenExpiryDate)
                    userRepository.updateUser(userToUpdate)
                    Option(userToUpdate)
                }
            }
        }
    }

    def checkGithubUser(user: String, githubToken: String): Future[Option[User]] = {
        userRepository.listUserByEmailAndGithubToken(user, githubToken).map { userOption =>
            if (userOption.isEmpty) {
                Option.empty[User]
            } else {
                val user = userOption.get

                if (isTokenExpired(user.githubTokenExpiryDate.get)) {
                    Option.empty[User]
                } else {
                    val userToUpdate = User(user.id, user.email, user.role, user.googleToken, user.googleTokenExpiryDate, Option(githubToken), Option(getTokenExpiry))
                    userRepository.updateUser(userToUpdate)
                    Option(userToUpdate)
                }
            }
        }
    }

    private def isTokenExpired(expiry: Timestamp): Boolean = {
        val whenTokenExpiring = Calendar.getInstance()
        whenTokenExpiring.setTime(new Date(expiry.getTime))
        whenTokenExpiring.add(Calendar.SECOND, oAuthConfigurationService.APP_TOKEN_VALIDITY_TIME)
        val now = Calendar.getInstance()
        whenTokenExpiring.before(now)
    }

    private def getTokenExpiry = {
        new Timestamp(Calendar.getInstance().getTimeInMillis)
    }

}
