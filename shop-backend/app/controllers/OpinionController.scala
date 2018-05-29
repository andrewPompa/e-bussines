package controllers

import javax.inject.Inject
import models.{OpinionRepository, ProductRepository}
import play.api.libs.json.Json
import play.api.mvc.{Action, AnyContent, MessagesAbstractController, MessagesControllerComponents}

import scala.concurrent.ExecutionContext

class OpinionController @Inject()(opinionRepository: OpinionRepository,
                                  cc: MessagesControllerComponents)
                                 (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
  def getOpinionOfProductId(productId: Long): Action[AnyContent] = Action.async { implicit request =>
    opinionRepository.listOpinionOfProduct(productId).map { opinions =>
      Ok(Json.toJson(opinions))
    }
  }
  def getAll:  Action[AnyContent] = Action.async { implicit request =>
    opinionRepository.list().map { opinions =>
      Ok(Json.toJson(opinions))
    }
  }
}