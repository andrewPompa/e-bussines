package services

import javax.inject.Inject
import play.api.Configuration

class OAuthConfigurationService @Inject() (config: Configuration) {
  val GOOGLE_CLIENT_ID: String = config.get[String]("client.id")
  val GOOGLE_CLIENT_SECRET: String = config.get[String]("client.secret")
  val GOOGLE_REDIRECT_ENDPOINT: String = config.get[String]("redirect.url")

}
