namespace SmartSchoolAPI.DTOs;

public class TeacherDto
{
    public int? TeacherId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Subject { get; set; } = string.Empty;
}

