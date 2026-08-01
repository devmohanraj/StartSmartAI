# ===========================================
# StartSmart AI - Backend Dockerfile
# Multi-stage production build for Render
# ===========================================

# ---------- Stage 1: Build ----------
# Use Maven with Eclipse Temurin JDK 17 to compile and package the application
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven POM file first to leverage Docker layer caching
# This way, dependencies are only re-downloaded when pom.xml changes
COPY pom.xml .

# Download all dependencies without building the project
# This caches the dependencies in a separate Docker layer
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application JAR, skipping test compilation and execution for a faster production build
# (-Dmaven.test.skip=true skips both compiling and running tests)
RUN mvn clean package -Dmaven.test.skip=true

# ---------- Stage 2: Runtime ----------
# Use a minimal JRE image for the runtime stage
FROM eclipse-temurin:17-jre

# Set the working directory
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/risk-analyzer-0.0.1-SNAPSHOT.jar app.jar

# Expose the default port (Render overrides this with the PORT env var)
EXPOSE 8080

# Set the Spring profile to production
ENV SPRING_PROFILES_ACTIVE=prod

# Set a default PORT (Render will override this with its own PORT env var)
ENV PORT=8080

# Run the application
# The server.port is read from application-prod.properties which uses ${PORT:8080}
ENTRYPOINT ["java",
"-Xms128m",
"-Xmx384m",
"-XX:+UseSerialGC",
"-jar",
"app.jar"]