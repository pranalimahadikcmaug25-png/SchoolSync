namespace SmartSchoolAPI.DTOs;

public class ResultDto
{
    public int StudentId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public decimal Marks { get; set; }
}

