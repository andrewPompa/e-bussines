package models

import javax.inject.{ Inject, Singleton }
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile
import models.CategoryRepository
import scala.concurrent.{ Future, ExecutionContext }

/**
 * @param dbConfigProvider The Play db config provider. Play will inject this for you.
 */
@Singleton
class ProductRepository @Inject() (dbConfigProvider: DatabaseConfigProvider, categoryRepository: CategoryRepository)(implicit ec: ExecutionContext) {
  private val dbConfig = dbConfigProvider.get[JdbcProfile]

  import dbConfig._
  import profile.api._


  private class ProductTable(tag: Tag) extends Table[Product](tag, "product") {

    def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

    def name = column[String]("name")

    def price = column[Double]("price")

    def description = column[String]("description")

    def category = column[Int]("category")

    def category_fk = foreignKey("cat_fk", category, categoryRepository.category)(_.id)

//    todo: przeanalizować składnie
    def * = (id, name, description, price, category) <> ((Product.apply _).tupled, Product.unapply)
  }

  private val product = TableQuery[ProductTable]

  def create(name: String, description: String, price: Int, category: Int): Future[Product] = db.run {
    (product.map(p => (p.name, p.description, p.price, p.category))
      returning product.map(_.id)
      into {case ((name, description, price, category),id) => Product(id, name, description, price, category)}
    ) += (name, description, price, category)
  }

  /**
   * List all the people in the database.
   */
  def list(): Future[Seq[Product]] = db.run {
    product.result
  }
}
