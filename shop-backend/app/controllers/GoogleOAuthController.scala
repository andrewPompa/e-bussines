package controllers

import javax.inject._
import models.ProductRepository
import play.api.libs.json._
import play.api.mvc._
import services.GoogleAuthService

import scala.concurrent.{ExecutionContext, Future}

class GoogleOAuthController @Inject()(productRepository: ProductRepository,
                                      googleAuthService: GoogleAuthService,
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
                    googleAuthService.getUser(googleAuthResponse).map { userInfoResponse =>
                        // todo: register or login user
                        Ok(":)")
                    }
                }
            }
        }
    }
}