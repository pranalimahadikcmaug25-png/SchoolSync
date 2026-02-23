namespace SmartSchoolAPI.Models;

public class Exam
{
    public int ExamId { get; set; }
    public string ExamName { get; set; } = string.Empty;
    public string ExamType { get; set; } = string.Empty; // Mid-Term, Final, Quiz, etc.
    public string Subject { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public DateTime ExamDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int TotalMarks { get; set; }
    public string? Instructions { get; set; }
    public int CreatedBy { get; set; } // UserId
}

