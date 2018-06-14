package controllers

import java.sql.Timestamp
import java.util.Date

import javax.inject.Inject
import models.{LastSearch, Product}
import play.api.libs.json.Json
import play.api.mvc.{Action, AnyContent, MessagesAbstractController, MessagesControllerComponents}
import repositories.{ProductRepository, UserRepository}

import scala.collection.mutable.ListBuffer
import scala.concurrent.{ExecutionContext, Future}

class PhrasesController  @Inject()(productsRepository: ProductRepository,
                                   userRepository: UserRepository,
                                   cc: MessagesControllerComponents)
                                  (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def getSearchedPhrases: Action[AnyContent] = Action.async { request =>
        println("searching phrases: ")
        val userEmailOption = request.session.get("user")
        var userEmail = "konto.do.testow123@gmail.com"
        if (userEmailOption.isDefined) {
            userEmail = userEmailOption.get
        }
        userRepository.listUserByEmail(userEmail).flatMap { userOption =>
            if (userOption.isEmpty) {
                Future {
                    NoContent
                }
            } else {
                productsRepository.listPhrasesForUser(userOption.get.id).map { phrases =>
                    Ok(Json.toJson(phrases))
                }
            }
        }
    }
}
