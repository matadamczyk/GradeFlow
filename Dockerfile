FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /workspace

COPY . .

RUN cd apps/server && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /workspace/apps/server/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"] 