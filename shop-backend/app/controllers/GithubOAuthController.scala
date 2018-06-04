package controllers

import javax.inject._
import models.ProductRepository
import play.api.libs.json._
import play.api.mvc._
import services.{GithubAuthService, GoogleAuthService}

import scala.concurrent.{ExecutionContext, Future}

class GithubOAuthController @Inject()(productRepository: ProductRepository,
                                      googleAuthService: GoogleAuthService,
                                      githubAuthService: GithubAuthService,
                                      cc: MessagesControllerComponents)
                                     (implicit ec: ExecutionContext) extends MessagesAbstractController(cc) {
    def onAuthResponse: Action[AnyContent] = Action.async { implicit request =>
        if (!githubAuthService.isRedirectAuthStringValid(request.queryString)) {
            Future {
                Ok(Json.toJson(":("))
            }
        } else {
            githubAuthService.getTokenFromAuthString(request.queryString).flatMap { response =>
                if (!githubAuthService.isTokenResponseValid(response)) {
                    Future {
                        Unauthorized("Bad credentials")
                    }
                } else {
                    val githubTokenResponse = githubAuthService.getTokenResponse(response)
                    githubAuthService.getUser(githubTokenResponse, githubTokenResponse.accessToken).map { userInfoResponse =>
                        Ok(":)")
                    }
                }
            }
        }
    }
    def onGithubLogin: Action[AnyContent] = Action { implicit request =>
        Redirect(githubAuthService.GITHUB_AUTH_URL, githubAuthService.buildParamsToAuthUrl)
    }
}