using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models; 
using FrameItAPI.Services.interfaces;
using FrameItAPI.Services.services;
using FrameItAPI.DataAccess;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ====== add DbContext =========
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

     
// =========== add services ===========

//builder.Services.AddDbContext<DataContext>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IFolderService, FolderService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<ICollageService, CollageService>();
builder.Services.AddScoped<IUserService, UserService>();

// ========== add Swagger =============
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FrameIt API", Version = "v1" });
});

var app = builder.Build();

// =========== run Swagger ============
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FrameIt API V1");
    c.RoutePrefix = string.Empty;
});

// =========== endpoints injection ===========
app.MapFileEndpoints();
app.MapFolderEndpoints();
app.MapTagEndpoints();
app.MapCollageEndpoints();
app.MapUserEndpoints();

// ========== run app ============
app.Run();
