package services

import javax.inject.Inject
import models.google.{GoogleAuthResponse, GoogleUser}
import play.api.libs.ws._

import scala.concurrent.{ExecutionContext, Future}

class GoogleAuthService @Inject()(ws: WSClient,
                                  oAuthConfigurationService: OAuthConfigurationService)
                                 (implicit ec: ExecutionContext) {
    val GOOGLE_AUTH_URL: String = "https://accounts.google.com/o/oauth2/v2/auth"
    private val AUTH_URL_SCOPE_KEY = "scope"
    private val AUTH_URL_ACCESS_TYPE_KEY = "access_type"
    private val AUTH_URL_INCLUDE_GRANTED_SCOPES_KEY = "include_granted_scopes"
    private val AUTH_URL_STATE_KEY = "state"
    private val AUTH_URL_REDIRECT_URI_KEY = "redirect_uri"
    private val AUTH_URL_RESPONSE_TYPE_KEY = "response_type"
    private val AUTH_URL_CLIENT_ID_KEY = "client_id"

    private val STATE_QUERY_PARAMS_KEY = "state"
    private val CODE_QUERY_PARAMS_KEY = "code"
    private val STATE_QUERY_PARAMS_VALID_VALUE = "state_parameter_passthrough_value"
    private val TOKEN_AUTHORIZATION_URL = "https://www.googleapis.com/oauth2/v4/token"
    private val USER_INFORMATION_API_URL = "https://www.googleapis.com/userinfo/v2/me"
    private val ACCESS_TOKEN_KEY = "access_token"
    private val ID_TOKEN_KEY = "id_token"
    private val TOKEN_TYPE_KEY = "token_type"
    private val EXPIRES_IN_KEY = "expires_in"
    private val USER_FAMILY_NAME_KEY = "family_name"
    private val USER_NAME_KEY = "name"
    private val USER_LOCALE_KEY = "locale"
    private val USER_EMAIL_KEY = "email"

//http://localhost:9090/login/google

    def buildParamsToAuthUrl: Map[String, Seq[String]] = {
        Map(
            AUTH_URL_SCOPE_KEY -> Seq(oAuthConfigurationService.GOOGLE_ACCESS_SCOPE),
            AUTH_URL_ACCESS_TYPE_KEY -> Seq("online"),
            AUTH_URL_INCLUDE_GRANTED_SCOPES_KEY -> Seq("true"),
            AUTH_URL_STATE_KEY -> Seq("state_parameter_passthrough_value"),
            AUTH_URL_REDIRECT_URI_KEY -> Seq(oAuthConfigurationService.GOOGLE_REDIRECT_ENDPOINT),
            AUTH_URL_RESPONSE_TYPE_KEY -> Seq("code"),
            AUTH_URL_CLIENT_ID_KEY -> Seq(oAuthConfigurationService.GOOGLE_CLIENT_ID)
        )
    }

    def isRedirectAuthStringValid(params: Map[String, Seq[String]]): Boolean = {
        if (params.size != 3) {
            return false
        }
        val state = params(STATE_QUERY_PARAMS_KEY)
        if (state == Nil || state.isEmpty || state.head != STATE_QUERY_PARAMS_VALID_VALUE) {
            return false
        }

        val code = params(CODE_QUERY_PARAMS_KEY)
        if (code == Nil || code.size != 1) {
            return false
        }
        true
    }


    def getTokenFromAuthString(params: Map[String, Seq[String]]): Future[WSResponse] = {
        val code = params(CODE_QUERY_PARAMS_KEY).head
        ws.url(TOKEN_AUTHORIZATION_URL)
            .addHttpHeaders("Content-Type" -> "application/x-www-form-urlencoded")
            .post(getBody(code))
    }

    def validateTokenResponse(response: WSResponse): Boolean = {
        if (response.status != 200) {
            return false
        }
        true
    }

    def getTokenResponse(response: WSResponse): GoogleAuthResponse = {
        val json = response.json
        GoogleAuthResponse(
            (json \ ACCESS_TOKEN_KEY).as[String],
            (json \ ID_TOKEN_KEY).as[String],
            (json \ TOKEN_TYPE_KEY).as[String],
            (json \ EXPIRES_IN_KEY).as[Long]
        )
    }

    def getUser(googleAuthResponse: GoogleAuthResponse): Future[GoogleUser] = {
        ws.url(USER_INFORMATION_API_URL)
            .withHttpHeaders(("Authorization", "Bearer " + googleAuthResponse.accessToken))
            .get()
            .map { response =>
                if (response.status != 200) {
                    None
                }
                getOAuthUser(response)
            }
    }

    private def getBody(code: String) = {
        Map(
            "code" -> code,
            "client_id" -> oAuthConfigurationService.GOOGLE_CLIENT_ID,
            "client_secret" -> oAuthConfigurationService.GOOGLE_CLIENT_SECRET,
            "redirect_uri" -> oAuthConfigurationService.GOOGLE_REDIRECT_ENDPOINT,
            "grant_type" -> "authorization_code")
    }

    private def getOAuthUser(response: WSResponse) = {
        val json = response.json
        GoogleUser(
            (json \ USER_NAME_KEY).as[String],
            (json \ USER_FAMILY_NAME_KEY).as[String],
            (json \ USER_EMAIL_KEY).as[String],
            (json \ USER_LOCALE_KEY).as[String]
        )
    }
}
