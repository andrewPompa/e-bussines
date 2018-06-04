package services

import javax.inject.Inject
import play.api.Configuration

class OAuthConfigurationService @Inject() (config: Configuration) {
  val GOOGLE_CLIENT_ID: String = config.get[String]("google.client.id")
  val GOOGLE_CLIENT_SECRET: String = config.get[String]("google.client.secret")
  val GOOGLE_REDIRECT_ENDPOINT: String = config.get[String]("google.redirect.url")
  val GITHUB_CLIENT_ID: String = config.get[String]("github.client.id")
  val GITHUB_CLIENT_SECRET: String = config.get[String]("github.client.secret")
  val GITHUB_REDIRECT_ENDPOINT: String = config.get[String]("github.redirect.url")
  val GITHUB_ACCESS_SCOPE: String = config.get[String]("github.access.scope")
  val GITHUB_STATE_TOKEN: String = config.get[String]("github.access.state")
}
