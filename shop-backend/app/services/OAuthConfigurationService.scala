package services

import javax.inject.Inject
import play.api.Configuration

class OAuthConfigurationService @Inject() (config: Configuration) {
  val APP_KEY: String = config.get[String]("app.key")
  val APP_TOKEN_VALIDITY_TIME: Int = config.get[Int]("app.token.validity.time")
  //  ---> google
  val GOOGLE_CLIENT_ID: String = config.get[String]("google.client.id")
  val GOOGLE_CLIENT_SECRET: String = config.get[String]("google.client.secret")
  val GOOGLE_REDIRECT_ENDPOINT: String = config.get[String]("google.redirect.url")
  val GOOGLE_ACCESS_SCOPE: String = config.get[String]("google.access.scope")
  //  ---> github
  val GITHUB_CLIENT_ID: String = config.get[String]("github.client.id")
  val GITHUB_CLIENT_SECRET: String = config.get[String]("github.client.secret")
  val GITHUB_REDIRECT_ENDPOINT: String = config.get[String]("github.redirect.url")
  val GITHUB_ACCESS_SCOPE: String = config.get[String]("github.access.scope")
  val GITHUB_STATE_TOKEN: String = config.get[String]("github.access.state")
}
