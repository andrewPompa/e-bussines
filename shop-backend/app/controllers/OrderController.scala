package controllers

import javax.inject.Inject
import models._
import play.api.libs.json.{JsPath, Json, Reads}
import play.api.libs.functional.syntax._
import play.api.mvc.{Action, AnyContent, MessagesAbstractController, MessagesControllerComponents}

import scala.collection.mutable.ListBuffer
import scala.concurrent.ExecutionContext

class OrderController @Inject()(productRepository: ProductRepository,
                                cc: MessagesControllerComponents)
                               (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def addOrder: Action[AnyContent] = Action { implicit request =>
        val json = request.body.asJson.get
        implicit val productsRead: Reads[BasketItem] = (
            (JsPath \ "id").read[Long] and
                (JsPath \ "quantity").read[Int]
            ) (BasketItem.apply _)
        val products = json.as[Seq[BasketItem]]
        //        productRepository.saveOrder(products)
        Ok(Json.toJson(":("))
    }

    def getOrders() = Action.async { implicit request =>
        productRepository.listAllOrders().map { test =>
            var fullProductsOrdersListBuffer = new ListBuffer[FullProductOrder]
            var order: Order = Order(-1, done = false)
            var sum = 0.0
            test.foreach { resultRow =>
                order = Order(resultRow._1.id, resultRow._1.done)
                val fullProductOrder = FullProductOrder(resultRow._2.id, resultRow._2.orderId, resultRow._3.id, resultRow._3.name, resultRow._2.quantity, resultRow._3.price)
                fullProductsOrdersListBuffer += fullProductOrder
                sum += fullProductOrder.quantity * fullProductOrder.price
            }
            val fullProductOrders = fullProductsOrdersListBuffer.toList
            FullOrder(order.id, order.done, sum, fullProductOrders)

        }.map(fullOrder => Ok(Json.toJson(fullOrder)))
    }
}