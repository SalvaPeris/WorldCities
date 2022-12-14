using Microsoft.EntityFrameworkCore;
using System.Configuration;
using WorldCitiesAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions( options =>
     {
         //options.JsonSerializerOptions.WriteIndented = true;
         //options.JsonSerializerOptions.PropertyNamingPolicy = null;
     });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#region "BASE DE DATOS - MSSQL"
//BASE DE DATOS MS SQL
/*builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnectionMSSQL")
        )
    );
*/
#endregion

#region "BASE DE DATOS - MYSQL"
builder.Services.AddEntityFrameworkMySql().AddDbContext<ApplicationDbContext>(options =>
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnectionMYSQL");
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    });
#endregion

builder.Services.AddCors(
   options =>
   {
       options.AddPolicy(
          "Any",
          cors =>
          {
              cors.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
          });

       options.AddPolicy(
          "OnlyMyServer",
          cors =>
          {
              cors.WithOrigins("http://localhost:4200/").SetIsOriginAllowed((host) => true).AllowAnyHeader().AllowAnyMethod();
          });
   });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("Any");
}
else
{
    app.UseCors("OnlyMyServer");
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
