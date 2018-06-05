package security

import akka.stream.Materializer
import controllers.routes
import javax.inject.Inject
import play.api.mvc
import play.api.mvc._
import play.api.mvc.Results._
import play.api.routing.Router

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{ExecutionContext, Future}

class AuthorizationInterceptor @Inject()(val mat: Materializer, ec: ExecutionContext, router: Router) extends Filter {
    private val LOGIN_PATHS = Map(
        "google" -> router.documentation.find(_._2 == "/login/google").map(_._2).get,
        "github" -> router.documentation.find(_._2 == "/login/github").map(_._2).get,
        "test" -> "/"
    )

    override def apply(next: RequestHeader => Future[mvc.Result])(request: RequestHeader): Future[Result] = {
        if (!authorizationRequired(request)) {
            return next(request)
        }
        if (isAuthorized(request)) {
            return next(request)
        }
        Future {
            Unauthorized("user unauthorized!")
        }
    }

    private def authorizationRequired(request: mvc.RequestHeader) = {
        !LOGIN_PATHS.exists(_._2 == request.path)
    }
    private def isAuthorized(header: RequestHeader): Boolean = {
        // todo: dokończyć ten szajs
//        header.session("user")
        true
    }
}