using System.ComponentModel.DataAnnotations;

namespace FleetManager.API.Models;

public class Vehicle
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public User? User { get; set; }

    [Required(ErrorMessage = "Araç adı zorunludur")]
    [MinLength(2, ErrorMessage = "Araç adı en az 2 karakter olmalıdır")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Plaka zorunludur")]
    public string PlateNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tür zorunludur")]
    public string Type { get; set; } = string.Empty;

    public bool IsDeleted { get; set; } = false;
    public DateTime? LastMaintenanceDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}