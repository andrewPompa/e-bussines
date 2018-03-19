#
# Scala and sbt Dockerfile
#
# Based on: https://github.com/hseeberger/scala-sbt
#

# Pull base image
FROM openjdk:8u151

# Env variables
ENV SCALA_VERSION 2.12.4
ENV SBT_VERSION 1.1.1

# Scala expects this file
RUN touch /usr/lib/jvm/java-8-openjdk-amd64/release

EXPOSE 9000

# Install Scala
## Piping curl directly in tar
RUN \
  curl -fsL https://downloads.typesafe.com/scala/$SCALA_VERSION/scala-$SCALA_VERSION.tgz | tar xfz - -C /root/ && \
  echo >> /root/.bashrc && \
  echo "export PATH=~/scala-$SCALA_VERSION/bin:$PATH" >> /root/.bashrc

# Install sbt
RUN \
  curl -L -o sbt-$SBT_VERSION.deb https://dl.bintray.com/sbt/debian/sbt-$SBT_VERSION.deb && \
  dpkg -i sbt-$SBT_VERSION.deb && \
  rm sbt-$SBT_VERSION.deb && \
  apt-get update && \
  apt-get install sbt && \
  sbt sbtVersion

RUN \
    apt-get -y install mysql-server

# Define working directory
WORKDIR /root

# Download sample playframework project
RUN \
curl -o play-example.zip  https://example.lightbend.com/v1/download/play-scala-slick-example && unzip play-example.zip && \
cd play-scala-slick-example/ && \
sbt run
