namespace SmartSchoolAPI.Models;

public class Teacher
{
    public int TeacherId { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string Subject { get; set; } = string.Empty;
}

