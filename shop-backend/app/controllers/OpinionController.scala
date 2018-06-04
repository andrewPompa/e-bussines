package controllers

import javax.inject.Inject
import play.api.libs.json.Json
import play.api.mvc.{Action, AnyContent, MessagesAbstractController, MessagesControllerComponents}
import repositories.ProductRepository

import scala.concurrent.ExecutionContext

class OpinionController @Inject()(productRepository: ProductRepository,
                                  cc: MessagesControllerComponents)
                                 (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def getOpinionOfProductId(productId: Long): Action[AnyContent] = Action.async { implicit request =>
        productRepository.listOpinionOfProduct(productId).map { opinions =>
            Ok(Json.toJson(opinions))
        }
    }

    def getAll: Action[AnyContent] = Action.async { implicit request =>
        productRepository.list().map { opinions =>
            Ok(Json.toJson(opinions))
        }
    }

    def addOpinion(productId: Long): Action[AnyContent] = Action.async { implicit request =>
        val json = request.body.asJson.get
        val text = json("text").as[String]
        println("adding new opinion: " + text + ", to: " + productId)
        productRepository.addOpinion(productId, text).map { opinions =>
            Ok(Json.toJson(opinions))
        }
    }
}