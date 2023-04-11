using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using WorldCitiesAPI.Data;
using WorldCitiesAPI.Data.GraphQL;
using WorldCitiesAPI.Data.Models;

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
		var connectionString = "server=82.223.101.36;database=WorldCities;user=wc; password=worldcities";
		options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
    });
#endregion


#region ASP NET Core Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
	options.SignIn.RequireConfirmedAccount = true;
	options.Password.RequireDigit = true;
	options.Password.RequireLowercase = true;
	options.Password.RequireUppercase = true;
	options.Password.RequireNonAlphanumeric = true;
	options.Password.RequiredLength = 8;
})
	.AddEntityFrameworkStores<ApplicationDbContext>();
#endregion

#region Authentication services and middlewares
builder.Services.AddAuthentication(opt =>
{
	opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		RequireExpirationTime = true,
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
		ValidAudience = builder.Configuration["JwtSettings:Audience"],
		IssuerSigningKey = new SymmetricSecurityKey(
			System.Text.Encoding.UTF8.GetBytes(
				builder.Configuration["JwtSettings:SecurityKey"]))
	};
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

builder.Services.AddScoped<JwtHandler>();

builder.Services.AddGraphQLServer()
	.AddAuthorization()
	.AddQueryType<Query>()
	.AddMutationType<Mutation>()
	.AddFiltering()
	.AddSorting();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGraphQL("/api/graphql");

app.Run();
