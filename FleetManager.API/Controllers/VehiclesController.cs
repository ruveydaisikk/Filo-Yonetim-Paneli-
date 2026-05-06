using FleetManager.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FleetManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehiclesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VehiclesController(AppDbContext context)
    {
        _context = context;
    }

    private int? GetUserId()
    {
        var idValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(idValue, out var id) ? id : null;
    }

    private bool IsAdmin() => User.IsInRole("Admin");

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var query = _context.Vehicles.Where(v => !v.IsDeleted);
        if (!IsAdmin()) query = query.Where(v => v.UserId == GetUserId());
        return Ok(await query.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Vehicle vehicle)
    {
        var userId = GetUserId();
        if (!userId.HasValue) return Unauthorized();

        vehicle.CreatedAt = DateTime.UtcNow;
        vehicle.UserId = userId.Value;
        if (vehicle.LastMaintenanceDate.HasValue)
            vehicle.LastMaintenanceDate = DateTime.SpecifyKind(vehicle.LastMaintenanceDate.Value, DateTimeKind.Utc);

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync();
        return Ok(vehicle);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Vehicle updated)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null || vehicle.IsDeleted) return NotFound();
        if (!IsAdmin() && vehicle.UserId != GetUserId()) return Forbid();

        vehicle.Name = updated.Name;
        vehicle.PlateNumber = updated.PlateNumber;
        vehicle.Type = updated.Type;
        vehicle.LastMaintenanceDate = updated.LastMaintenanceDate.HasValue
            ? DateTime.SpecifyKind(updated.LastMaintenanceDate.Value, DateTimeKind.Utc)
            : null;

        await _context.SaveChangesAsync();
        return Ok(vehicle);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null || vehicle.IsDeleted) return NotFound();
        if (!IsAdmin() && vehicle.UserId != GetUserId()) return Forbid();

        vehicle.IsDeleted = true;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpGet("deleted")]
    public async Task<IActionResult> GetDeleted()
    {
        var query = _context.Vehicles.Where(v => v.IsDeleted);
        if (!IsAdmin()) query = query.Where(v => v.UserId == GetUserId());
        return Ok(await query.ToListAsync());
    }

    [HttpPatch("{id}/restore")]
    public async Task<IActionResult> Restore(int id)
    {
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle == null || !vehicle.IsDeleted) return NotFound();
        if (!IsAdmin() && vehicle.UserId != GetUserId()) return Forbid();

        vehicle.IsDeleted = false;
        await _context.SaveChangesAsync();
        return Ok(vehicle);
    }

    [HttpGet("report")]
    public async Task<IActionResult> GetMaintenanceReport(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] string? sortBy)
    {
        var query = _context.Vehicles.Where(v => !v.IsDeleted && v.LastMaintenanceDate != null);
        if (!IsAdmin()) query = query.Where(v => v.UserId == GetUserId());

        if (startDate.HasValue)
            query = query.Where(v => v.LastMaintenanceDate >= DateTime.SpecifyKind(startDate.Value, DateTimeKind.Utc));
        else
            query = query.Where(v => v.LastMaintenanceDate >= DateTime.UtcNow.AddDays(-30));

        if (endDate.HasValue)
            query = query.Where(v => v.LastMaintenanceDate <= DateTime.SpecifyKind(endDate.Value, DateTimeKind.Utc));

        query = sortBy switch
        {
            "name" => query.OrderBy(v => v.Name),
            "plate" => query.OrderBy(v => v.PlateNumber),
            "type" => query.OrderBy(v => v.Type),
            _ => query.OrderBy(v => v.LastMaintenanceDate)
        };

        return Ok(await query.ToListAsync());
    }
}