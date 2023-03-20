using DomainLayer;
using Microsoft.EntityFrameworkCore;
using RepositoryLayer;
using ServiceLayer.Implementations;
using ServiceLayer.Interfaces;

namespace TouristPlaceWebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
           
            builder.Services.AddControllers();
            builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("TouristPlaceConnectionString")));
            builder.Services.AddScoped(typeof(IRepository <>), typeof(Repository<>));
            builder.Services.AddScoped<ITouristPlaceServices, TouristPlaceServices>();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(p => p.AddPolicy("GlobalPolicy", build => { build.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod(); }));

            var app = builder.Build();
            
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("GlobalPolicy");
           
            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}