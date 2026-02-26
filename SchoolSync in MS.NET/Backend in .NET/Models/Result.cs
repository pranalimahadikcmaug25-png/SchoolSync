namespace SmartSchoolAPI.Models;

public class Result
{
    public int ResultId { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public string Subject { get; set; } = string.Empty;
    public decimal Marks { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

