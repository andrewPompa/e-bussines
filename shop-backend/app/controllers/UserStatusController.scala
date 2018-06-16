package controllers

import javax.inject._
import models.user.{User, UserRole, UserState}
import play.api.libs.json._
import play.api.mvc._
import repositories.UserRepository

import scala.concurrent.ExecutionContext

class UserStatusController @Inject()(userRepository: UserRepository,
                                     cc: MessagesControllerComponents)
                                    (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def getStatus: Action[AnyContent] = Action.async { implicit request =>
        println("getting user status")
        val userEmailOption = request.session.get("user")
        var userEmail = "konto.do.testow123@gmail.com"
        if (userEmailOption.isDefined) {
            userEmail = userEmailOption.get
        }
        userRepository.listUserByEmail(userEmail).map { userOption =>
            if (userOption.isEmpty) {
                NoContent
            } else {
                val userState = UserState(userEmail, userOption.get.role == UserRole.Admin)
                Ok(Json.toJson(userState))
            }
        }
    }

    def logoutUser: Action[AnyContent] = Action.async { implicit request =>
        println("logging out user")
        val userEmailOption = request.session.get("user")
        var userEmail = "konto.do.testow123@gmail.com"
        if (userEmailOption.isDefined) {
            userEmail = userEmailOption.get
        }
        userRepository.listUserByEmail(userEmail).map { userOption =>
            if (userOption.isEmpty) {
                NoContent
            } else {
                val user = userOption.get
                val userToUpdate = User(user.id, user.email, user.role, None, None, None, None)
                userRepository.updateUser(userToUpdate)
                Ok(Json.toJson("user logged out"))
            }
        }
    }
}