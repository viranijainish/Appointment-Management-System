# Use the official .NET runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["AppointmentManagement.API.csproj", "."]
RUN dotnet restore "./AppointmentManagement.API.csproj"

# Copy the rest of the application code
COPY . .
WORKDIR "/src/."

# Build the application
RUN dotnet build "AppointmentManagement.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "AppointmentManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "AppointmentManagement.API.dll"]
