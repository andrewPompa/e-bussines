package controllers

import javax.inject.Inject
import models._
import play.api.libs.json.Json
import play.api.mvc.{Action, AnyContent, MessagesAbstractController, MessagesControllerComponents}

import scala.concurrent.{ExecutionContext, Future}

class ProductsController @Inject()(productsRepository: ProductRepository,
                                   opinionRepository: OpinionRepository,
                                   cc: MessagesControllerComponents)
                                  (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def getProducts: Action[AnyContent] = Action.async {
        println("executing request")
        productsRepository.list().map { products =>
            Ok("test")
        }
    }

    def getProduct(productId: Long): Action[AnyContent] = Action.async {
        println("getting full product: " + productId)
        productsRepository
            .listProduct(productId)
            .zip(productsRepository.listOpinionOfProduct(productId))
            .zip(productsRepository.listTagOfProduct(productId))
            .map { result =>
                if (result._1._1.isEmpty) {
                    NoContent
                } else {
                    val product = result._1._1.get
                    val fullProduct = FullProduct(product.id, product.name, product.description, product.price, product.category, result._1._2, result._2)
                    Ok(Json.toJson(fullProduct))
                }
        }
    }

    def addProduct: Action[AnyContent] = Action { implicit request =>
        val json = request.body.asJson.get
        println(json)
        Ok("Jim")
    }
}

//