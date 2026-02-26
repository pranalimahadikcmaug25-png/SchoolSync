namespace SmartSchoolAPI.DTOs;

public class StudentDto
{
    public int? StudentId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string RollNo { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
}

