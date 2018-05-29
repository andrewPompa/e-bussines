package models

import javax.inject.{Inject, Singleton}
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

/**
  * A repository for people.
  *
  * @param dbConfigProvider The Play db config provider. Play will inject this for you.
  */
@Singleton
class OpinionRepository @Inject()(dbConfigProvider: DatabaseConfigProvider, productRepository: ProductRepository)(implicit ec: ExecutionContext) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._

  class OpinionTable(tag: Tag) extends Table[Opinion](tag, "opinion") {

    def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

    def productId = column[Long]("product_id")

    def text = column[String]("text")

//    def product_fk = foreignKey("prod_fk", productId, productRepository.product)(_.id)

    def * = (id, productId, text) <> ((Opinion.apply _).tupled, Opinion.unapply)
  }
  val opinion = TableQuery[OpinionTable]


  def list(): Future[Seq[Opinion]] = db.run {
    opinion.result
  }

  def listOpinionOfProduct(productId: Long): Future[Seq[Opinion]] = {
    val query = opinion.filter(_.productId === productId)
    db.run {
      query.result
    }
  }
}
