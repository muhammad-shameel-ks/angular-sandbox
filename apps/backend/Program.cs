var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi(); // .NET 10 way

var app = builder.Build();

app.UseCors("DevPolicy");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi(); // replaces UseSwagger + UseSwaggerUI
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
