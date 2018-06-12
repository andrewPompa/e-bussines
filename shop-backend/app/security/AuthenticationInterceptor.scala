package security

import akka.stream.Materializer
import controllers.routes
import javax.inject.Inject
import models.user.User
import play.api.mvc
import play.api.mvc._
import play.api.mvc.Results._
import play.api.routing.Router

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{ExecutionContext, Future}

class AuthenticationInterceptor @Inject()(val mat: Materializer, router: Router, authenticationService: AuthenticationService)(ec: ExecutionContext) extends Filter {
    private val LOGIN_PATHS = Map(
        "google" -> router.documentation.find(_._2 == "/login/google").map(_._2).get,
        "google_auth" -> router.documentation.find(_._2 == "/auth/google").map(_._2).get,
        "github" -> router.documentation.find(_._2 == "/login/github").map(_._2).get,
        "github_auth" -> router.documentation.find(_._2 == "/auth/github").map(_._2).get,
        "test" -> "/"
    )

    override def apply(next: RequestHeader => Future[mvc.Result])(request: RequestHeader): Future[mvc.Result] = {
        if (!authorizationRequired(request)) {
            next(request)
        } else {
            val getUserResponse = getUser(request)
            getUserResponse.flatMap { userOption =>
                if (userOption.isEmpty) {
                    Future {
                        Unauthorized("user unauthorized!")
                    }
                } else {
                    next(request)
                }
            }
        }
    }

    private def authorizationRequired(request: mvc.RequestHeader) = {
        !LOGIN_PATHS.exists(_._2 == request.path)
    }

    private def getUser(header: RequestHeader): Future[Option[User]] = {
        val userEmailOption = header.session.get("user")
        val googleTokenOption = header.session.get("googleToken")
        val githubTokenOption = header.session.get("githubToken")
        if (userEmailOption.isEmpty) {
            Future {
                Option.empty
            }
        } else {
            if (googleTokenOption.isDefined) {
                authenticationService.checkGoogleUser(userEmailOption.get.toString, googleTokenOption.get.toString)
            } else if (githubTokenOption.isDefined) {
                authenticationService.checkGithubUser(userEmailOption.get.toString, githubTokenOption.get.toString)
            } else {
                Future {
                    Option.empty
                }
            }
        }
    }
}