package controllers

import java.sql.Timestamp
import java.util.Date

import javax.inject.Inject
import models._
import play.api.libs.json.{JsPath, JsString, Json, Reads}
import play.api.mvc.{Action, AnyContent, MessagesAbstractController, MessagesControllerComponents}
import repositories.{ProductRepository, UserRepository}
import play.api.libs.functional.syntax._

import scala.collection.mutable.ListBuffer
import scala.concurrent.{ExecutionContext, Future}

class ProductsController @Inject()(productsRepository: ProductRepository,
                                   userRepository: UserRepository,
                                   cc: MessagesControllerComponents)
                                  (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def getProducts: Action[AnyContent] = Action.async {
        println("executing request")
        productsRepository.list().map { products =>
            Ok(Json.toJson(products))
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

    def getProductByPhrase(phrase: String): Action[AnyContent] = Action.async { request =>
        println("searching product: " + phrase)
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
                productsRepository.listAllTags().map { productTagsMonad =>
                    val productListBuffer = new ListBuffer[Product]
                    val products = productTagsMonad.filter(_._1.name.contains(phrase)).map(_._1)
                    productListBuffer ++= products
                    val tags = productTagsMonad
                        .filter(_._2.text.contains(phrase))
                        .filter(productTagMonad =>
                            !products.exists(product => product.id == productTagMonad._1.id))
                        .map(_._1)
                    productListBuffer ++= tags
                    productsRepository.insertLastSearch(LastSearch(0, userOption.get.id, phrase))
                    Ok(Json.toJson(productListBuffer.distinct))
                }
            }
        }
    }

    def addProduct: Action[AnyContent] = Action.async { implicit request =>
        val json = request.body.asJson.get
        implicit val tagReads: Reads[ProductTag] = (
            (JsPath \ "id").read[Int] and
                (JsPath \ "text").read[String]
            ) (ProductTag.map _)

        implicit val opinionReads: Reads[Opinion] = (
            (JsPath \ "id").read[Int] and
                (JsPath \ "text").read[String]
            ) (Opinion.map _)

        implicit val fullProductReads: Reads[FullProduct] = (
            (JsPath \ "name").read[String] and
                (JsPath \ "description").read[String] and
                (JsPath \ "price").read[Double] and
                (JsPath \ "opinions").read[Seq[Opinion]] and
                (JsPath \ "tags").read[Seq[ProductTag]]
            ) (FullProduct.map _)

        val fullProduct = json.as[FullProduct]
        productsRepository.insertProduct(fullProduct).flatMap { productId =>
            productsRepository.insertTags(fullProduct.tags, productId).flatMap { tagInsertionResult =>
                productsRepository.insertOpinions(fullProduct.opinions, productId).map { opinionInsertionResult =>
                    Ok(Json.toJson(productId))
                }
            }
        }
    }

    def updateProduct: Action[AnyContent] = Action.async { implicit request =>
        val json = request.body.asJson.get
        implicit val tagReads: Reads[ProductTag] = (
            (JsPath \ "id").read[Int] and
                (JsPath \ "text").read[String]
            ) (ProductTag.map _)

        implicit val opinionReads: Reads[Opinion] = (
            (JsPath \ "id").read[Int] and
                (JsPath \ "text").read[String]
            ) (Opinion.map _)

        implicit val fullProductReads: Reads[FullProduct] = (
            (JsPath \ "name").read[String] and
                (JsPath \ "description").read[String] and
                (JsPath \ "price").read[Double] and
                (JsPath \ "opinions").read[Seq[Opinion]] and
                (JsPath \ "tags").read[Seq[ProductTag]]
            ) (FullProduct.map _)

        val fullProduct = json.as[FullProduct]
        productsRepository.insertProduct(fullProduct).flatMap { productId =>
            productsRepository.deleteTagsForProduct(productId).flatMap { tagDeletionResult =>
                productsRepository.deleteOpinionForProduct(productId).flatMap { opinionDeletionResult =>
                    productsRepository.insertTags(fullProduct.tags, productId).flatMap { tagInsertionResult =>
                        productsRepository.insertOpinions(fullProduct.opinions, productId).flatMap { opinionInsertionResult =>
                            productsRepository.listProduct(productId).map { productOption =>
                                if (productOption.isDefined) {
                                    Ok(Json.toJson(productOption.get))
                                } else {
                                    NoContent
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

//