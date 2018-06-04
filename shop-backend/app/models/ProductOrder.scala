package models

import play.api.libs.json.{Json, OFormat}

case class ProductOrder(id: Long, orderId: Long, productId: Long, quantity: Int)

object ProductOrder {
    implicit val orderFormat: OFormat[ProductOrder] = Json.format[ProductOrder]
}

