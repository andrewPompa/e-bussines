package controllers

import javax.inject.Inject
import models.ProductRepository
import play.api.libs.json.Json
import play.api.mvc.{MessagesAbstractController, MessagesControllerComponents}

import scala.concurrent.ExecutionContext

class ProductsController @Inject()(productsRepository: ProductRepository,
                                   cc: MessagesControllerComponents)
                                  (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
  def getProducts = Action.async {
    productsRepository.list().map { products =>
      Ok(Json.toJson(products))
    }
  }
}