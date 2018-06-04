package models

import play.api.libs.json.Json

case class FullOrder (id: Long, done: Boolean, sum: Double, productOrders: Seq[FullProductOrder])

object FullOrder {
    implicit val format = Json.format[FullOrder]
}