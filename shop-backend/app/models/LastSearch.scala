package models

import play.api.libs.json._

case class LastSearch(id: Long, userId: Long, text: String)




object LastSearch {
    implicit val categoryFormat: OFormat[LastSearch] = Json.format[LastSearch]
}