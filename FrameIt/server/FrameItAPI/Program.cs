using FrameItAPI.DataAccess;
using FrameItAPI.Endpoints;
using FrameItAPI.Services.interfaces;
using FrameItAPI.Services.services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System.Text;
using Amazon.Extensions.NETCore.Setup;
using Amazon.S3;
using DotNetEnv;
using Amazon;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using static FrameItAPI.Entities.mapping.Auth;




var builder = WebApplication.CreateBuilder(args);

// ====== add DbContext =========

//---local---
//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//---clever cloud---
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("FrameItDB"),
        new MySqlServerVersion(new Version(9, 0, 0))));


//========= add env var ============
builder.Configuration.AddEnvironmentVariables();


// ========= load env var ==========
Env.Load();


// ========= AWS options ===========
var awsOptions = new AWSOptions
{
    Region = RegionEndpoint.GetBySystemName(Environment.GetEnvironmentVariable("AWS_REGION")),
    Credentials = new Amazon.Runtime.BasicAWSCredentials(
        Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID"),
        Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY")
    )
};


// ======== AWS S3 srvices ==========
builder.Services.AddDefaultAWSOptions(awsOptions);
builder.Services.AddAWSService<IAmazonS3>();


// =========== add services ===========

//builder.Services.AddDbContext<DataContext>();
//builder.Services.AddAWSService<IAmazonS3>();

builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IFolderService, FolderService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<ICollageService, CollageService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddLogging();


//=========  google login===========
builder.Services.Configure<GoogleAuthSettings>(builder.Configuration.GetSection("Google"));


// ========== add Swagger =============

builder.Services.AddEndpointsApiExplorer();
//?
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "FrameIt API", Version = "v1" });
    //?
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter your Bearer token",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

});

// ========= JWT ===========

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});


//=========== add cors ===========

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});




// ========== add cors based roles =============

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("EditorOrAdmin", policy => policy.RequireRole("Editor", "Admin"));
    options.AddPolicy("ViewerOnly", policy => policy.RequireRole("Viewer"));
    options.AddPolicy("all", policy => policy.RequireRole("Admin", "Editor", "Viewer"));
});


// ============ JSON srializer =============
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});


var app = builder.Build();





//// ========== Enable HTTPS redirection ================
//app.Use(async (context, next) =>
//{
//    if (context.Request.Method == HttpMethods.Options)
//    {
//        context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
//        context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//        context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
//        context.Response.StatusCode = 200;
//        await context.Response.CompleteAsync();
//        return;
//    }

//    await next();
//});


// =========== run Swagger ============

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FrameIt API V1");
    c.RoutePrefix = string.Empty;

});



// =========== Authentication and Authorization Middleware ============

app.UseRouting();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();


// =========== endpoints injection ===========

app.MapFileEndpoints();
app.MapFolderEndpoints();
app.MapTagEndpoints();
app.MapCollageEndpoints();
app.MapUserEndpoints();
app.MapAnalyticsEndpoints();
AuthEndpoints.MapAuthEndpoints(app);


//// ========== database migration ============

//using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
//    db.Database.Migrate(); 
//}


// ========== run app ============
app.Run();
