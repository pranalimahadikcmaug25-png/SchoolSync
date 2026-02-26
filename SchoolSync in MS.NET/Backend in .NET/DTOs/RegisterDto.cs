namespace SmartSchoolAPI.DTOs;

public class RegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? RollNo { get; set; }
    public string? Class { get; set; }
    public string? Subject { get; set; }
}

