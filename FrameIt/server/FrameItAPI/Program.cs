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




var builder = WebApplication.CreateBuilder(args);

// ====== add DbContext =========
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


//========= add env var ============
builder.Configuration.AddEnvironmentVariables();

// ========= load env var ==========
Env.Load();

// הוספת אפשרויות AWS
var awsOptions = new AWSOptions
{
    Region = RegionEndpoint.GetBySystemName(Environment.GetEnvironmentVariable("AWS_REGION")),
    Credentials = new Amazon.Runtime.BasicAWSCredentials(
        Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID"),
        Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY")
    )
};

// הוספת AWS S3 לשירותים
builder.Services.AddDefaultAWSOptions(awsOptions);
builder.Services.AddAWSService<IAmazonS3>();


// =========== add services ===========

//builder.Services.AddDbContext<DataContext>();
//builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IFolderService, FolderService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<ICollageService, CollageService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<AuthService>();


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

var app = builder.Build();


// =========== run Swagger ============

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FrameIt API V1");
    c.RoutePrefix = string.Empty;

});


// ========== Enable CORS ================
app.UseCors("AllowAll");


// =========== Authentication and Authorization Middleware ============

app.UseRouting();
app.UseAuthentication(); // הוספת Middleware לאימות
app.UseAuthorization();  // הוספת Middleware להרשאות


// =========== endpoints injection ===========

app.MapFileEndpoints();
app.MapFolderEndpoints();
app.MapTagEndpoints();
app.MapCollageEndpoints();
app.MapUserEndpoints();
AuthEndpoints.MapAuthEndpoints(app); // Update this line


// ========== run app ============
app.Run();
