using Microsoft.EntityFrameworkCore;
using SKVS.Server.Data;
using SKVS.Server.Repository;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 🔧 Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // ⚠️ Kad nebūtų klaidų su ciklais tarp susijusių objektų
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true; 
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔧 MySQL per Pomelo + Docker
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// 🔧 Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAvailableDeliveryTimeRepository, AvailableDeliveryTimeRepository>();
builder.Services.AddScoped<IDriverRepository, DriverRepository>();
builder.Services.AddScoped<ITransportationOrderRepository, TransportationOrderRepository>();
builder.Services.AddScoped<ITruckingCompanyManagerRepository, TruckingCompanyManagerRepository>();
builder.Services.AddScoped<ITruckRepository, TruckRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IWarehouseOrderRepository, WarehouseOrderRepository>();
builder.Services.AddScoped<ISVSRepository, SVSRepository>();

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
