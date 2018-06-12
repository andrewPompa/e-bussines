package repositories

import java.sql.Timestamp

import javax.inject.{Inject, Singleton}
import models._
import models.user.User
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}
import scala.language.postfixOps

/**
  * @param dbConfigProvider The Play db config provider. Play will inject this for you.
  */
@Singleton
class ProductRepository @Inject()(dbConfigProvider: DatabaseConfigProvider, userRepository: UserRepository)(implicit ec: ExecutionContext) {
    val dbConfig = dbConfigProvider.get[JdbcProfile]

    import dbConfig._
    import profile.api._

    class CategoryTable(tag: Tag) extends Table[Category](tag, "category") {

        def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

        def name = column[String]("name")

        def * = (id, name) <> ((Category.apply _).tupled, Category.unapply)
    }

    val category = TableQuery[CategoryTable]


    class ProductTable(tag: Tag) extends Table[Product](tag, "product") {

        def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

        def name = column[String]("name")

        def price = column[Double]("price")

        def description = column[String]("description")

        def category = column[Int]("category")

        def category_fk = foreignKey("cat_fk", category, ProductRepository.this.category)(_.id)

        //    todo: przeanalizować składnie
        def * = (id, name, description, price, category) <> ((Product.apply _).tupled, Product.unapply)
    }

    val product = TableQuery[ProductTable]

    class OpinionTable(tag: Tag) extends Table[Opinion](tag, "opinion") {

        def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

        def productId = column[Long]("product_id")

        def text = column[String]("text")

        def product_fk = foreignKey("prod_fk", productId, product)(_.id)

        def * = (id, productId, text) <> ((Opinion.apply _).tupled, Opinion.unapply)
    }

    val opinion = TableQuery[OpinionTable]

    class TagTable(tag: Tag) extends Table[ProductTag](tag, "tag") {

        def id = column[Int]("id", O.PrimaryKey, O.AutoInc)

        def productId = column[Long]("product_id")

        def text = column[String]("text")

        def product_fk = foreignKey("prod_fk", productId, product)(_.id)

        def * = (id, productId, text) <> ((ProductTag.apply _).tupled, ProductTag.unapply)
    }

    val tag = TableQuery[TagTable]

    class OrderTable(tag: Tag) extends Table[Order](tag, "order") {

        def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

        def userId = column[Long]("user_id")

        def done = column[Boolean]("done")

        def user_fk = foreignKey("user_fk", userId, user)(_.id)

        def * = (id, userId, done) <> ((Order.apply _).tupled, Order.unapply)
    }

    val order = TableQuery[OrderTable]


    class ProductOrderTable(tag: Tag) extends Table[ProductOrder](tag, "order_product") {

        def id = column[Long]("id", O.PrimaryKey, O.AutoInc)

        def orderId = column[Long]("order_id")

        def productId = column[Long]("product_id")

        def quantity = column[Int]("quantity")

        def order_fk = foreignKey("order_fk", orderId, order)(_.id)

        def product_fk = foreignKey("prod_fk", productId, product)(_.id)

        def * = (id, orderId, productId, quantity) <> ((ProductOrder.apply _).tupled, ProductOrder.unapply)
    }

    val productOrder = TableQuery[ProductOrderTable]

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

    def create(name: String, description: String, price: Int, category: Int): Future[Product] = db.run {
        (product.map(p => (p.name, p.description, p.price, p.category))
            returning product.map(_.id)
            into { case ((name, description, price, category), id) => Product(id, name, description, price, category) }
            ) += (name, description, price, category)
    }

    /**
      * List all the people in the database.
      */
    def list(): Future[Seq[Product]] = db.run {
        product.result
    }

    def listProduct(productId: Long): Future[Option[Product]] = {
        val query = product.filter(_.id === productId)
        db.run {
            query.result.headOption
        }
    }

    def listOpinionOfProduct(productId: Long): Future[Seq[Opinion]] = {
        val query = opinion.filter(_.productId === productId)
        db.run {
            query.result
        }
    }

    def listTagOfProduct(productId: Long): Future[Seq[ProductTag]] = {
        val query = tag.filter(_.productId === productId)
        db.run {
            query.result
        }
    }

    def addOpinion(productId: Long, text: String): Future[Int] = {
        val opinionId =
            (opinion returning opinion.map(_.id)) += Opinion(-1, productId, text)
        db.run {
            opinionId
        }
    }
    def listOrders(): Future[Seq[Order]] = {
        db.run {
            order.result
        }
    }

    def listOrder(orderId: Long): Future[Option[Order]] =
        db.run {
            order.filter(_.id === orderId).result.headOption
        }

    def listProductOrdersByOrderId(orderId: Long): Future[Seq[ProductOrder]] = db.run {
        productOrder.filter(_.orderId === orderId).result
    }

    def listAllOrders(): Future[Seq[(Order, ProductOrder, Product)]] = {
        db.run {
            order.flatMap { order =>
                productOrder.filter(productOrder => productOrder.orderId === order.id)
                    .flatMap { productOrder =>
                        product.filter(product => product.id === productOrder.productId)
                            .map { product =>

                                (order, productOrder, product)
                            }
                    }
            }.result

        }
    }

    def listProductOrdersByProductId(orderId: Long): Future[Seq[ProductOrder]] = {
        db.run {
            productOrder.filter(_.orderId === orderId).result
        }
    }

    def deleteTagsForProduct(productId: Long): Future[Int] = {
        val deleteTags = tag.filter(_.productId === productId)
        db.run {
            deleteTags.delete
        }

    }

    def deleteOpinionForProduct(productId: Long): Future[Int] = {
        val deleteOpinions = opinion.filter(_.productId === productId)
        db.run {
            deleteOpinions.delete
        }

    }

    def insertTags(tags: Seq[ProductTag], productId: Long): Future[Seq[Int]] = {
        val tagsToInsert = tags.map { tag => this.tag.insertOrUpdate(ProductTag(0, productId, tag.text)) }
        val sequence = DBIO.sequence(tagsToInsert)
        db.run (
            sequence
        )

    }

    def insertOpinions(opinions: Seq[Opinion], productId: Long): Future[Seq[Int]] = {
        val tagsToInsert = opinions.map { opinion => this.opinion.insertOrUpdate(Opinion(0, productId, opinion.text)) }
        val sequence = DBIO.sequence(tagsToInsert)
        db.run (
            sequence
        )

    }

    def insertProduct(fullProduct: FullProduct): Future[Long] = {
        val opinionId =
            (product returning product.map(_.id)) += Product(-1, fullProduct.name, fullProduct.description, fullProduct.price, 0)
        db.run {
            opinionId
        }
    }

    def updateOrder(doneOrder: Order): Future[Int] = {
        db.run {
            order.update(doneOrder)
        }
    }
}
