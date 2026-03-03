# Stage 1: Compile the ANSI C health score library
FROM gcc:12 AS c-builder
WORKDIR /native
COPY native/health-score/ .
RUN make

# Stage 2: Build the .NET application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY GLAT.sln .
COPY src/GLAT.Domain/GLAT.Domain.csproj src/GLAT.Domain/
COPY src/GLAT.Application/GLAT.Application.csproj src/GLAT.Application/
COPY src/GLAT.Infrastructure/GLAT.Infrastructure.csproj src/GLAT.Infrastructure/
COPY src/GLAT.API/GLAT.API.csproj src/GLAT.API/
RUN dotnet restore

COPY src/ src/
RUN dotnet publish src/GLAT.API/GLAT.API.csproj -c Release -o /app/publish --no-restore

COPY --from=c-builder /native/libhealth_score.so /app/publish/

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
COPY --from=build /app/publish/libhealth_score.so /usr/local/lib/
RUN ldconfig

EXPOSE 8080
ENTRYPOINT ["dotnet", "GLAT.API.dll"]
