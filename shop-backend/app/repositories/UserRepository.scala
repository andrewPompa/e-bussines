package repositories

import java.sql.Timestamp
import java.util.Date

import javax.inject.Inject
import models.user.User
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

class UserRepository  @Inject()(dbConfigProvider: DatabaseConfigProvider)(implicit ec: ExecutionContext) {


    val dbConfig = dbConfigProvider.get[JdbcProfile]

    import dbConfig._
    import profile.api._

    class UserTable(tag: Tag) extends Table[User](tag, "user") {
        def id = column[Long]("id", O.PrimaryKey, O.AutoInc)
        def email = column[String]("email")
        def role = column[Int]("role")
        def googleToken = column[Option[String]]("google_token")
        def googleTokenExpiryDate = column[Option[Timestamp]]("google_token_expiry_date")
        def githubToken = column[Option[String]]("github_token")
        def githubTokenExpiryDate = column[Option[Timestamp]]("github_token_expiry_date")

        def * = (id, email, role, googleToken, googleTokenExpiryDate, githubToken, githubTokenExpiryDate) <> ((User.apply _).tupled, User.unapply)
    }
    val user = TableQuery[UserTable]


    def listUserByEmail(email: String) = db.run {
        user.filter(_.email === email).result.headOption
    }

    def listUserByEmailAndGoogleToken(email: String, googleToken: String) = db.run {
        user.filter(userToFilter => userToFilter.email === email && userToFilter.googleToken === googleToken ).result.headOption
    }

    def updateUser(updateUser: User) = db.run {
        user.update(updateUser)
    }

    def addNewUser(newUser: User) = db.run {
        user += newUser
    }

}
