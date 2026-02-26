namespace SmartSchoolAPI.Models;

public class ReportCard
{
    public int ReportCardId { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public string AcademicYear { get; set; } = string.Empty;
    public string Term { get; set; } = string.Empty; // First Term, Second Term, Annual
    public string Class { get; set; } = string.Empty;
    public decimal TotalMarks { get; set; }
    public decimal MarksObtained { get; set; }
    public decimal Percentage { get; set; }
    public string Grade { get; set; } = string.Empty;
    public int Rank { get; set; }
    public string? Remarks { get; set; }
    public DateTime GeneratedDate { get; set; }
    public int GeneratedBy { get; set; } // UserId
}

