name := "first_projetcts"
 
version := "1.0" 
      
lazy val `first_projetcts` = (project in file(".")).enablePlugins(PlayScala)

val mysql = "mysql" % "mysql-connector-java" % "5.1.12"

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"
      
resolvers += "Akka Snapshot Repository" at "http://repo.akka.io/snapshots/"
      
scalaVersion := "2.12.2"

libraryDependencies ++= Seq( jdbc , ehcache , ws , specs2 % Test , guice,  mysql)

unmanagedResourceDirectories in Test <+=  baseDirectory ( _ /"target/web/public/test" )  

      