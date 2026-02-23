namespace SmartSchoolAPI.DTOs;

public class ExamDto
{
    public int? ExamId { get; set; }
    public string ExamName { get; set; } = string.Empty;
    public string ExamType { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int TotalMarks { get; set; }
    public string? Instructions { get; set; }
}

