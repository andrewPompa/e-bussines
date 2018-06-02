package models

import play.api.libs.json._

case class ProductTag(id: Int, productId: Long, text: String)

object ProductTag {
  implicit val opinionFormat: OFormat[ProductTag] = Json.format[ProductTag]
}
