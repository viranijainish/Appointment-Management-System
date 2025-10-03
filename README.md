<<<<<<< HEAD
# Appointment-Management-System
Appointment-Management-System
=======
# Appointment Management System

A mini appointment booking system for a healthcare clinic built with .NET Core Web API backend and HTML/JavaScript frontend.

## 🏗️ Architecture

- **Backend**: .NET Core 9.0 Web API with Repository Pattern + Entity Framework Core (In-Memory Database)
- **Frontend**: Angular 18 with Angular Material + Bootstrap 5
- **Database**: In-Memory Database (for simplicity)
- **Design Patterns**: Repository Pattern, Dependency Injection, SOLID Principles

## 📋 Features

### Backend API Endpoints
- `GET /api/appointments` - Get all appointments (sorted by start time)
- `GET /api/appointments/{id}` - Get specific appointment by ID
- `POST /api/appointments` - Book a new appointment with validation
- `PUT /api/appointments/{id}` - Update an existing appointment
- `DELETE /api/appointments/{id}` - Cancel an appointment

### Backend Architecture Features
- **Repository Pattern**: Clean separation between data access and business logic
- **Dependency Injection**: Loose coupling and better testability
- **Async/Await**: Non-blocking operations for better performance
- **Comprehensive Logging**: Detailed logging at repository and controller levels
- **Error Handling**: Consistent error responses and exception management
- **Business Logic Validation**: Centralized appointment overlap detection

### Frontend Features
- 📅 Book new appointments with reactive forms and validation
- 📋 View all appointments in a responsive card-based layout
- ✏️ Edit existing appointments with pre-filled forms
- 🗑️ Cancel appointments with confirmation dialogs
- 🎨 Modern Material Design UI with Angular Material
- ⚡ Real-time form validation and error handling
- 📱 Fully responsive mobile-friendly design
- 🔄 Loading states and smooth animations
- 🎯 Type-safe TypeScript implementation

### Validation Rules
- ✅ Required fields validation (Patient Name, Doctor Name, Start/End Time)
- ✅ No overlapping appointments per doctor
- ✅ Start time must be before end time
- ✅ Cannot book appointments in the past
- ✅ Maximum 100 characters for names

## 🚀 Setup Instructions

### Prerequisites
- .NET 9.0 SDK or later
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Restore NuGet packages:**
   ```bash
   dotnet restore
   ```

3. **Build the project:**
   ```bash
   dotnet build
   ```

4. **Run the API:**
   ```bash
   dotnet run
   ```

   The API will be available at:
   - HTTPS: `https://localhost:7041`
   - HTTP: `http://localhost:5041`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   ng serve
   ```

   The Angular app will be available at `http://localhost:4200`

4. **Build for production (optional):**
   ```bash
   npm run build
   # or
   ng build --configuration production
   ```

## 🎯 Usage

1. **Start the backend API** (it will run on `https://localhost:7041`)
2. **Start the Angular frontend** (it will run on `http://localhost:4200`)
3. **Navigate through the app:**
   - View all appointments on the main page
   - Click "New Appointment" to book an appointment
   - Use "Edit" button to modify existing appointments
   - Use "Cancel" button to delete appointments (with confirmation)

## 📁 Project Structure

```
Appointment Management/
├── backend/                          # .NET Core Web API
│   ├── Controllers/
│   │   └── AppointmentsController.cs # API endpoints (uses Repository Pattern)
│   ├── Data/
│   │   └── AppointmentContext.cs     # Entity Framework context
│   ├── Models/
│   │   └── Appointment.cs            # Appointment model with validation
│   ├── Repositories/                 # Repository Pattern Implementation
│   │   ├── IRepository.cs            # Generic repository interface
│   │   ├── IAppointmentRepository.cs # Appointment-specific interface
│   │   └── AppointmentRepository.cs  # Repository implementation
│   ├── Program.cs                    # Application configuration + DI setup
│   ├── Dockerfile                    # Docker configuration
│   └── AppointmentManagement.API.csproj
├── frontend/                         # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/           # Angular components
│   │   │   │   ├── appointment-list/
│   │   │   │   ├── appointment-form/
│   │   │   │   └── confirm-dialog/
│   │   │   ├── models/               # TypeScript interfaces
│   │   │   ├── services/             # Angular services
│   │   │   ├── app.component.ts      # Root component
│   │   │   ├── app.config.ts         # App configuration
│   │   │   └── app.routes.ts         # Routing configuration
│   │   ├── index.html                # Main HTML page
│   │   ├── main.ts                   # Angular bootstrap
│   │   └── styles.scss               # Global styles
│   ├── angular.json                  # Angular CLI configuration
│   ├── package.json                  # npm dependencies
│   └── tsconfig.json                 # TypeScript configuration
├── docker-compose.yml                # Docker Compose configuration
├── nginx.conf                        # Nginx configuration for Docker
└── README.md                         # This file
```

## 🏛️ Repository Pattern Implementation

### Architecture Overview
The backend implements the Repository Pattern to achieve clean separation of concerns and improve testability:

```
Controller Layer    →    Repository Layer    →    Data Access Layer
AppointmentsController → IAppointmentRepository → AppointmentRepository → DbContext
```

### Key Components

#### 1. **IRepository<T>** - Generic Repository Interface
```csharp
public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task<T> CreateAsync(T entity);
    Task<T?> UpdateAsync(int id, T entity);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
```

#### 2. **IAppointmentRepository** - Business-Specific Interface
```csharp
public interface IAppointmentRepository
{
    // Standard CRUD operations
    Task<IEnumerable<Appointment>> GetAllAsync();
    Task<Appointment?> GetByIdAsync(int id);
    Task<Appointment> CreateAsync(Appointment appointment);
    Task<Appointment?> UpdateAsync(int id, Appointment appointment);
    Task<bool> DeleteAsync(int id);
    
    // Business-specific operations
    Task<bool> HasOverlappingAppointmentAsync(string doctorName, DateTime startTime, DateTime endTime, int? excludeId = null);
    Task<bool> ExistsAsync(int id);
}
```

#### 3. **AppointmentRepository** - Concrete Implementation
- Implements all CRUD operations
- Contains business logic for appointment overlap validation
- Provides comprehensive logging and error handling
- Uses async/await patterns for better performance

### Benefits Achieved

1. **🔄 Separation of Concerns**
   - Controllers handle HTTP requests/responses only
   - Repositories handle data access and business logic
   - Clear boundaries between layers

2. **🧪 Improved Testability**
   - Easy to mock `IAppointmentRepository` for unit tests
   - Controllers can be tested independently of data layer
   - Repository logic can be tested with in-memory database

3. **🔧 Better Maintainability**
   - Data access logic centralized in repositories
   - Easy to switch between different data storage implementations
   - Clear interfaces define contracts

4. **📊 Enterprise Patterns**
   - Follows SOLID principles
   - Implements Dependency Inversion Principle
   - Supports future extensibility

### Dependency Injection Setup
```csharp
// In Program.cs
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
```

## 🔧 Configuration

### Backend Configuration
- **Database**: In-Memory database (data is lost when application stops)
- **CORS**: Configured to allow requests from `http://localhost:4200` and `http://localhost:8000`
- **Logging**: Console logging enabled for development with repository-level logging
- **Dependency Injection**: Repository Pattern registered as scoped services
- **Architecture**: Clean Architecture with Repository Pattern implementation

### Frontend Configuration
- **API URL**: Configured in `appointment.service.ts` (defaults to `https://localhost:7041/api`)
- **Styling**: Angular Material + Bootstrap 5 + custom SCSS
- **Routing**: Angular Router with lazy-loaded components
- **Forms**: Reactive Forms with comprehensive validation

## 🧪 Testing the API

### Repository Pattern Testing

The Repository Pattern implementation can be tested at multiple levels:

#### 1. **API Endpoint Testing**
You can test the API endpoints using:

**Browser** (for GET requests):
- `https://localhost:7041/api/appointments`

**curl** examples:
```bash
# Get all appointments (Repository: GetAllAsync)
curl -X GET http://localhost:5041/api/appointments

# Create appointment (Repository: CreateAsync + HasOverlappingAppointmentAsync)
curl -X POST http://localhost:5041/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "startTime": "2025-01-15T10:00:00",
    "endTime": "2025-01-15T11:00:00"
  }'

# Test overlap validation (Repository: HasOverlappingAppointmentAsync)
curl -X POST http://localhost:5041/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Jane Doe",
    "doctorName": "Dr. Smith",
    "startTime": "2025-01-15T10:30:00",
    "endTime": "2025-01-15T11:30:00"
  }'
# Expected: 400 Bad Request with overlap error

# Update appointment (Repository: UpdateAsync + HasOverlappingAppointmentAsync)
curl -X PUT http://localhost:5041/api/appointments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "patientName": "John Doe Updated",
    "doctorName": "Dr. Smith",
    "startTime": "2025-01-15T14:00:00",
    "endTime": "2025-01-15T15:00:00"
  }'

# Delete appointment (Repository: DeleteAsync)
curl -X DELETE http://localhost:5041/api/appointments/1
```

#### 2. **Repository Layer Testing**
The repository methods can be tested independently:

- **GetAllAsync()**: Returns all appointments sorted by start time
- **GetByIdAsync(id)**: Returns specific appointment or null
- **CreateAsync(appointment)**: Creates and returns new appointment
- **UpdateAsync(id, appointment)**: Updates existing appointment
- **DeleteAsync(id)**: Deletes appointment, returns success boolean
- **HasOverlappingAppointmentAsync()**: Business logic validation
- **ExistsAsync(id)**: Checks if appointment exists

#### 3. **Logging Verification**
Check console output for repository-level logging:
```
info: AppointmentManagement.API.Repositories.AppointmentRepository[0]
      Retrieving all appointments
info: AppointmentManagement.API.Repositories.AppointmentRepository[0]
      Creating new appointment for patient: John Doe
info: AppointmentManagement.API.Repositories.AppointmentRepository[0]
      Successfully created appointment with ID: 1
```

## 🚀 Deployment Notes

### Staging/Production Deployment

For production deployment, consider:

1. **Database**: Replace in-memory database with SQL Server, PostgreSQL, or SQLite
2. **Authentication**: Add JWT authentication and authorization
3. **HTTPS**: Configure proper SSL certificates
4. **Environment Variables**: Use configuration for connection strings and URLs
5. **Docker**: See Dockerfile section below

### Docker Deployment

Create a `Dockerfile` in the backend directory:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["AppointmentManagement.API.csproj", "."]
RUN dotnet restore "./AppointmentManagement.API.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "AppointmentManagement.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AppointmentManagement.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AppointmentManagement.API.dll"]
```

Build and run with Docker:
```bash
docker build -t appointment-api .
docker run -p 8080:80 appointment-api
```

## 🔍 Assumptions Made

1. **In-Memory Database**: Used for simplicity; data doesn't persist between application restarts
2. **No Authentication**: Simplified for demo purposes; production would need user authentication
3. **Repository Pattern**: Implemented for clean architecture; ready for unit testing and different data sources
4. **Business Logic**: Centralized in repository layer; overlap validation and data access logic separated
5. **Fixed Doctor List**: Hardcoded doctor names in frontend; production would fetch from API via repository
6. **Time Zones**: Uses local browser time; production should handle time zones properly
7. **Error Handling**: Comprehensive error handling with repository-level logging implemented
8. **Dependency Injection**: Repository registered as scoped service for proper lifecycle management

## 🛠️ Future Enhancements

### Architecture & Patterns
- [ ] Unit of Work pattern implementation
- [ ] CQRS (Command Query Responsibility Segregation)
- [ ] Domain-Driven Design (DDD) implementation
- [ ] Specification pattern for complex queries

### Features
- [ ] User authentication and authorization
- [ ] Persistent database (SQL Server/PostgreSQL)
- [ ] Email notifications for appointments
- [ ] Calendar integration
- [ ] Advanced scheduling features (recurring appointments)
- [ ] Patient and doctor management
- [ ] Reporting and analytics
- [ ] Mobile app (React Native/Flutter)

### Technical Improvements
- [ ] Unit tests for repository layer
- [ ] Integration tests for API endpoints
- [ ] Performance monitoring and metrics
- [ ] API versioning
- [ ] Swagger/OpenAPI documentation enhancement

## 📝 License

This project is created for educational/demonstration purposes.

## 👥 Contributing

This is a demo project. For production use, please implement proper security, testing, and deployment practices.
>>>>>>> d06e148 (Added local project files)
