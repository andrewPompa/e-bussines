package models.user

import play.api.libs.json.{Json, OFormat}

case class UserState(email: String, isAdmin: Boolean) {}

object UserState {
    implicit val categoryFormat: OFormat[UserState] = Json.format[UserState]
}