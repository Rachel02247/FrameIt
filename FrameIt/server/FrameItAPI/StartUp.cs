//using FrameItAPI.DataAccess;
//using FrameItAPI.Services.interfaces;
//using FrameItAPI.Services.services;

//namespace FrameItAPI
//{
//    public class Startup
//    {
//        public IConfiguration Configuration { get; }

//        public Startup(IConfiguration configuration)
//        {
//            Configuration = configuration;
//        }

//        public void ConfigureServices(IServiceCollection services)
//        {
//            services.AddDbContext<DataContext>(options =>
//                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

//            services.AddScoped<IUserService, UserService>();
//            // הוסף שירותים נוספים כפי שנדרש
//        }

//        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
//        {
//            // קונפיגורציה של האפליקציה (middleware, routing וכו')
//        }
//    }

//}
