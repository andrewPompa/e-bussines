package services

import javax.inject.{Inject, Singleton}
import models.github.{GithubAuthResponse, GithubEmailApiResponse}
import models.{BasketItem, OAuthUser}
import play.api.libs.json.{JsPath, Reads}
import play.api.libs.ws.{WSClient, WSResponse}
import play.api.libs.functional.syntax._

import scala.concurrent.{ExecutionContext, Future}

@Singleton()
class GithubAuthService @Inject()(ws: WSClient,
                                  oAuthConfigurationService: OAuthConfigurationService)
                                 (implicit ec: ExecutionContext)
    extends OAuthService[GithubAuthResponse] {

    val GITHUB_AUTH_URL: String = "https://github.com/login/oauth/authorize"
    val GITHUB_TOKEN_AUTHORIZATION_URL: String = "https://github.com/login/oauth/access_token"
    val GITHUB_USER_INFORMATION_API_URL: String = "https://api.github.com/user/emails"
    private val AUTH_URL_CLIENT_ID_KEY = "client_id"
    private val AUTH_URL_REDIRECT_URI_KEY = "redirect_uri"
    private val AUTH_URL_SCOPE_KEY = "scope"
    private val AUTH_URL_STATE_KEY = "state"
    private val REDIRECT_URL_CODE_QUERY_PARAM_KEY = "code"
    private val AUTH_RESPONSE_ACCESS_TOKEN_KEY = "access_token"
    private val AUTH_RESPONSE_SCOPE_KEY = "scope"
    private val AUTH_RESPONSE_TOKEN_TYPE_KEY = "token_type"
    private val GITHUB_EMAIL_API_RESPONSE_KEY = "email"
    private val GITHUB_PRIMARY_API_RESPONSE_KEY = "primary"
    private val GITHUB_VERIFIED_API_RESPONSE_KEY = "verified"
    private val GITHUB_VISIBILITY_API_RESPONSE_KEY = "visibility"
    // http://localhost:9090/login/github

    def buildParamsToAuthUrl: Map[String, Seq[String]] = {
        Map(
            AUTH_URL_CLIENT_ID_KEY -> Seq(oAuthConfigurationService.GITHUB_CLIENT_ID),
            AUTH_URL_REDIRECT_URI_KEY -> Seq(oAuthConfigurationService.GITHUB_REDIRECT_ENDPOINT),
            AUTH_URL_SCOPE_KEY -> Seq(oAuthConfigurationService.GITHUB_ACCESS_SCOPE),
            AUTH_URL_STATE_KEY -> Seq(oAuthConfigurationService.GITHUB_STATE_TOKEN)
        )
    }

    override def isRedirectAuthStringValid(params: Map[String, Seq[String]]): Boolean = {
        if (params.size != 2) {
            return false
        }
        val code = params(REDIRECT_URL_CODE_QUERY_PARAM_KEY)
        if (code == Nil || code.isEmpty) {
            return false
        }
        val state = params(AUTH_URL_STATE_KEY)
        if (state == Nil || state.isEmpty || state.head != oAuthConfigurationService.GITHUB_STATE_TOKEN) {
            return false
        }
        true
    }

    override def getTokenFromAuthString(params: Map[String, Seq[String]]): Future[WSResponse] = {
        val code = params(REDIRECT_URL_CODE_QUERY_PARAM_KEY).head
        ws.url(GITHUB_TOKEN_AUTHORIZATION_URL)
            .addHttpHeaders("Content-Type" -> "application/x-www-form-urlencoded")
            .addHttpHeaders("Accept" -> "application/json")
            .post(getBody(code))
    }

    override def isTokenResponseValid(response: WSResponse): Boolean = {
        if (response.status != 200) {
            return false
        }
        true
    }

    override def getTokenResponse(response: WSResponse): GithubAuthResponse = {
        val json = response.json
        GithubAuthResponse(
            (json \ AUTH_RESPONSE_ACCESS_TOKEN_KEY).as[String],
            (json \ AUTH_RESPONSE_SCOPE_KEY).as[String],
            (json \ AUTH_RESPONSE_TOKEN_TYPE_KEY).as[String]
        )
    }

    override def getUser(authResponse: GithubAuthResponse, accessToken: String): Future[OAuthUser] = {
        ws.url(GITHUB_USER_INFORMATION_API_URL)
            .withHttpHeaders(("Authorization", "token " + authResponse.accessToken))
            .get()
            .map { response =>
                if (response.status != 200) {
                    None
                }
                getOAuthUser(response, accessToken)
            }
    }

    private def getBody(code: String): Map[String, String] = {
        Map(
            "client_id" -> oAuthConfigurationService.GITHUB_CLIENT_ID,
            "client_secret" -> oAuthConfigurationService.GITHUB_CLIENT_SECRET,
            "code" -> code,
            "redirect_uri" -> oAuthConfigurationService.GITHUB_REDIRECT_ENDPOINT,
            "state" -> oAuthConfigurationService.GITHUB_STATE_TOKEN
        )
    }

    private def getOAuthUser(response: WSResponse, accessToken: String) = {
        val json = response.json
        implicit val authUserRead: Reads[GithubEmailApiResponse] = (
            (JsPath \ GITHUB_EMAIL_API_RESPONSE_KEY).read[String] and
                (JsPath \ GITHUB_PRIMARY_API_RESPONSE_KEY).read[Boolean] and
                (JsPath \ GITHUB_VERIFIED_API_RESPONSE_KEY).read[Boolean]
            ) (GithubEmailApiResponse.apply _)

        val githubEmailApiResponses = json.as[Seq[GithubEmailApiResponse]]
        val githubEmailApiResponseOption = githubEmailApiResponses.find(_.primary)
        if (githubEmailApiResponseOption.isEmpty) {
            None
        }
        OAuthUser("", "", githubEmailApiResponseOption.get.email, "", accessToken)
    }
}
