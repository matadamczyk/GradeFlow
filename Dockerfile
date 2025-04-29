FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy full pom.xml
COPY apps/server/pom.xml ./pom.xml
# Copy source files as a separate step to be more explicit
COPY apps/server/src ./src

# Build the application
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENV SPRING_DATASOURCE_URL=jdbc:postgresql://cursorily-becoming-peacock.data-1.use1.tembo.io:5432/postgres
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=iZWjoHVeipK6Zazi
ENV SERVER_PORT=8080

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"] 