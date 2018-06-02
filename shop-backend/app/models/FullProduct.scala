package models

import play.api.libs.json.Json

case class FullProduct (id: Long, name: String, description: String, price: Double, category: Int, opinions: Seq[Opinion], tags: Seq[ProductTag])
object FullProduct {
  implicit val fullProductFormat = Json.format[FullProduct]
}