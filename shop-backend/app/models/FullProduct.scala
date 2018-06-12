package models

import play.api.libs.json.Json

case class FullProduct (id: Long, name: String, description: String, price: Double, category: Int, opinions: Seq[Opinion], tags: Seq[ProductTag]) {
  def toProduct = {
    Product(id, name, description, price, category)
  }
}
object FullProduct {
  implicit val format = Json.format[FullProduct]

  def map(name: String, description: String, price: Double, opinions: Seq[Opinion], tags: Seq[ProductTag]): FullProduct =
    new FullProduct(0, name, description, price, 0, opinions, tags)
}