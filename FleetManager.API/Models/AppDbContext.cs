using Microsoft.EntityFrameworkCore;
using FleetManager.API.Models;

namespace FleetManager.API.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
}