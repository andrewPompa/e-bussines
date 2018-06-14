package controllers

import javax.inject.Inject
import models._
import play.api.libs.json.{JsPath, Json, Reads}
import play.api.libs.functional.syntax._
import play.api.mvc.{Action, AnyContent, MessagesAbstractController, MessagesControllerComponents}
import repositories.{ProductRepository, UserRepository}

import scala.collection.mutable.ListBuffer
import scala.concurrent.{ExecutionContext, Future}

class OrderController @Inject()(productRepository: ProductRepository,
                                userRepository: UserRepository,
                                cc: MessagesControllerComponents)
                               (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def addOrder(): Action[AnyContent] = Action.async { implicit request =>
        val json = request.body.asJson.get
        implicit val productsRead: Reads[BasketItem] = (
            (JsPath \ "id").read[Long] and
                (JsPath \ "quantity").read[Int]
            ) (BasketItem.apply _)
        val products = json.as[Seq[BasketItem]]
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
                val order = Order(-1, userOption.get.id, done = false)
                productRepository.insertOrder(order).flatMap { orderIndex =>
                    val productOrders = products.map { product =>
                        ProductOrder(-1, orderIndex, product.productId, product.quantity)
                    }
                    productRepository.insertProductOrders(productOrders).map { productOrdersIndexes =>
                        Ok(Json.toJson(productOrdersIndexes))
                    }
                }
            }

        }
    }

    def finishOrder(orderId: Long): Action[AnyContent] = Action.async { implicit request =>
        productRepository.listOrder(orderId).flatMap { orderOption =>
            if (orderOption.isEmpty) {
                Future {
                    NoContent
                }
            } else {
                val o = orderOption.get
                val doneOrder = Order(o.id, o.userId, done = true)
                productRepository.updateOrder(doneOrder).map { result =>
                    Ok(Json.toJson(result))
                }
            }
        }
    }

    def getOrders(): Action[AnyContent] = Action.async { implicit request =>
        productRepository.listAllOrders().map { ordersMonad =>
            val fullOrdersListBuffer = new ListBuffer[FullOrder]
            ordersMonad.foreach { orderMonad =>
                if (!fullOrdersListBuffer.exists(_.id == orderMonad._1.id)) {
                    val filteredOrdersMonad = ordersMonad.filter(_._1.id == orderMonad._1.id)
                    var fullProductsOrdersListBuffer = new ListBuffer[FullProductOrder]
                    var sum = 0.0
                    filteredOrdersMonad.foreach { row =>
                        val fullProductOrder = FullProductOrder(row._2.id, row._2.orderId, row._3.id, row._3.name, row._2.quantity, row._3.price)
                        fullProductsOrdersListBuffer += fullProductOrder
                        sum += fullProductOrder.quantity * fullProductOrder.price
                    }
                    fullOrdersListBuffer += FullOrder(orderMonad._1.id, orderMonad._1.userId, orderMonad._1.done, sum, fullProductsOrdersListBuffer.toList)
                }
            }
            Ok(Json.toJson(fullOrdersListBuffer.toList))
        }
    }
}