package models

import play.api.libs.json.{Json, OFormat}

case class Order(id: Long, userId: Long, done: Boolean)

object Order {
    implicit val orderFormat: OFormat[Order] = Json.format[Order]
}
