package models

import play.api.libs.json.Json

case class BasketItem (productId: Long, quantity: Int)

object BasketItem {
    implicit val basketItemFormat = Json.format[BasketItem]
}