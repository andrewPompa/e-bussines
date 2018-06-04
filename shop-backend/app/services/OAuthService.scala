package services

import models.OAuthUser
import play.api.libs.ws.WSResponse

import scala.concurrent.Future

trait OAuthService[R] {
    def isRedirectAuthStringValid(params: Map[String, Seq[String]]): Boolean

    def getTokenFromAuthString(params: Map[String, Seq[String]]): Future[WSResponse]

    def isTokenResponseValid(response: WSResponse): Boolean

    def getTokenResponse(response: WSResponse): R

    def getUser(authResponse: R, accessToken: String): Future[OAuthUser]
}
