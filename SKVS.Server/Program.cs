using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
//using SKVS.Server.Repository;

var builder = WebApplication.CreateBuilder(args);

// 🔧 Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔧 MySQL per Pomelo + Docker
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// 🔧 Register repository
builder.Services.AddScoped<IUserRepository, UserRepository>();

var app = builder.Build();

// 🔧 Serve React or other SPA (optional)
app.UseDefaultFiles();
app.UseStaticFiles();

// 🔧 Swagger (on in development)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// 🔧 Fallback to index.html (for SPA routing like React Router)
app.MapFallbackToFile("/index.html");

app.Run();
