package models.user

import java.sql.Timestamp
import java.util.Date

case class User(id: Long, email: String, role: Int, googleToken: String, googleTokenExpiryDate: Timestamp, githubToken: String, githubTokenExpiryDate: Timestamp)