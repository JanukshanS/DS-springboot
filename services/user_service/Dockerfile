FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy the Maven executable and configuration
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy the source code
COPY src src

# Package the application
RUN chmod +x ./mvnw && ./mvnw package -DskipTests

# Copy the JAR file to the root of the container
RUN cp target/*.jar app.jar

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Expose the port the application runs on
EXPOSE 8081
