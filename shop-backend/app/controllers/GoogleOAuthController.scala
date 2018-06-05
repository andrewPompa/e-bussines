package controllers

import javax.inject._
import play.api.libs.json._
import play.api.mvc._
import repositories.ProductRepository
import models.user.UserRole
import security.AuthenticationService
import services.GoogleAuthService

import scala.concurrent.{ExecutionContext, Future}

class GoogleOAuthController @Inject()(productRepository: ProductRepository,
                                      googleAuthService: GoogleAuthService,
                                      authenticationService: AuthenticationService,
                                      cc: MessagesControllerComponents)
                                     (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def onAuthResponse: Action[AnyContent] = Action.async { implicit request =>
        if (!googleAuthService.isRedirectAuthStringValid(request.queryString)) {
            Future {
                Ok(Json.toJson(":("))
            }
        } else {
            googleAuthService.getTokenFromAuthString(request.queryString).flatMap { response =>
                if (!googleAuthService.validateTokenResponse(response)) {
                    Future {
                        Unauthorized("Bad credentials")
                    }
                } else {
                    val googleAuthResponse = googleAuthService.getTokenResponse(response)
                    googleAuthService.getUser(googleAuthResponse).flatMap { userInfoResponse =>
                        authenticationService.addGoogleUser(userInfoResponse.email, googleAuthResponse.accessToken, UserRole.User).map{user =>
                            Redirect(routes.ProductsController.getProducts()).withSession(("user", user.email), ("googleToken", user.googleToken.get))
                        }
                    }
                }
            }
        }
    }

    def onGoogleLogin: Action[AnyContent] = Action { implicit request =>
        Redirect(googleAuthService.GOOGLE_AUTH_URL, googleAuthService.buildParamsToAuthUrl)
    }
}