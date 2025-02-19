using HorizonTrackrAPI.Data;
using HorizonTrackrAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ 1. Configure Database Context (SQLite)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ 2. Configure Identity (Only If Using Authentication)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// ✅ 3. Configure JWT Authentication (Only If Using Authentication)
var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("⚠️ JWT Secret Key is missing! Add it to `appsettings.json` or environment variables.");
}

var key = Encoding.UTF8.GetBytes(jwtKey);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

// ✅ 4. Configure CORS (IMPORTANT: Apply Globally)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // ✅ ALLOW ANGULAR FRONTEND
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // ✅ REQUIRED FOR AUTHENTICATED REQUESTS
    });
});

// ✅ 5. Add Controllers & API Explorer
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ✅ 6. APPLY CORS FIRST IN MIDDLEWARE PIPELINE
app.UseCors("AllowAngularApp");

// ✅ 7. Enable Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// ✅ 8. Configure Middleware (Swagger, HTTPS)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
