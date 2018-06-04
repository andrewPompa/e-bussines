package models

import play.api.libs.json.Json

case class FullProductOrder(id: Long, orderId: Long, productId: Long, productName: String, quantity: Int, price: Double)

object FullProductOrder {
    implicit val format = Json.format[FullProductOrder]
}