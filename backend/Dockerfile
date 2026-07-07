# syntax=docker/dockerfile:1

FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw ./
RUN chmod +x mvnw
RUN ./mvnw -B -DskipTests dependency:go-offline

COPY src ./src
RUN ./mvnw -B -DskipTests clean package

FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

# External volume for user-uploaded files
VOLUME ["/app/uploads"]

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

