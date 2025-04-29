FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the POM file to download dependencies
COPY apps/server/pom.xml .
# Copy the source code
COPY apps/server/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Create a smaller image for running the application
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variables with default values that can be overridden
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://cursorily-becoming-peacock.data-1.use1.tembo.io:5432/postgres
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=iZWjoHVeipK6Zazi
ENV SERVER_PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 