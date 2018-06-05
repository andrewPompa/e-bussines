package models.user

import java.sql.Timestamp
import java.util.Date

case class User(id: Long, email: String, role: Int, googleToken: Option[String], googleTokenExpiryDate: Option[Timestamp], githubToken: Option[String], githubTokenExpiryDate: Option[Timestamp])