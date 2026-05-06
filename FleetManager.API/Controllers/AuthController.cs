using FleetManager.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FleetManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] LoginRequest req)
    {
        if (await _context.Users.AnyAsync(u => u.Username == req.Username))
            return BadRequest("Kullanıcı adı zaten mevcut");
        if (!string.IsNullOrEmpty(req.Email) && await _context.Users.AnyAsync(u => u.Email == req.Email))
            return BadRequest("E-posta zaten kayıtlı");

        var user = new User
        {
            Username = req.Username,
            Email = req.Email ?? string.Empty,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = req.Role ?? "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Kayıt başarılı" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == req.Username || u.Email == req.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized("Kullanıcı adı/e-posta veya şifre hatalı");

        var token = GenerateToken(user);
        return Ok(new { token, role = user.Role, username = user.Username });
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Role { get; set; }
}