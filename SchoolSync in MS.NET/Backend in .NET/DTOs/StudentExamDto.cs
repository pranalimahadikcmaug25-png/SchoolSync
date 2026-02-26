namespace SmartSchoolAPI.DTOs;

public class StudentExamDto
{
    public int? StudentExamId { get; set; }
    public int ExamId { get; set; }
    public int StudentId { get; set; }
    public decimal MarksObtained { get; set; }
    public string Grade { get; set; } = string.Empty;
    public string? Remarks { get; set; }
    public DateTime? ExamTakenDate { get; set; }
}

