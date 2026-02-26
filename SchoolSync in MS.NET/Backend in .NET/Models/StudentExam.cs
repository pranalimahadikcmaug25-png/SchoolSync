namespace SmartSchoolAPI.Models;

public class StudentExam
{
    public int StudentExamId { get; set; }
    public int ExamId { get; set; }
    public Exam Exam { get; set; } = null!;
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public decimal MarksObtained { get; set; }
    public string Grade { get; set; } = string.Empty;
    public string? Remarks { get; set; }
    public DateTime? ExamTakenDate { get; set; }
}

