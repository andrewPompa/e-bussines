package models.user

import scala.language.implicitConversions

class UserRole extends Enumeration {
    protected case class Val(roleId: Int) extends super.Val {
    }
    implicit def valueToPlanetVal(x: Value): Val = x.asInstanceOf[Val]

    val User = Val(1)
    val Admin   = Val(2)
}
