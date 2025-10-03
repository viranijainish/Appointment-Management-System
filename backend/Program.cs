using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using AppointmentManagement.API.Data;
using AppointmentManagement.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Entity Framework with In-Memory Database
builder.Services.AddDbContext<AppointmentContext>(options =>
    options.UseInMemoryDatabase("AppointmentDb"));

// Register Repository Pattern
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Appointment Management API",
        Version = "v1",
        Description = "A comprehensive API for managing medical appointments",
        Contact = new OpenApiContact
        {
            Name = "Appointment Management Team",
            Email = "support@appointmentmanagement.com"
        }
    });

    // Set the comments path for the Swagger JSON and UI
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Appointment Management API v1");
        c.RoutePrefix = "swagger";
        c.DocumentTitle = "Appointment Management API Documentation";
    });
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowAngularApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
