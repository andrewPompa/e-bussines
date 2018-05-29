package models

import play.api.libs.json._

case class Opinion(id: Int, productId: Long, text: String)

object Opinion {
  implicit val opinionFormat: OFormat[Opinion] = Json.format[Opinion]
}
