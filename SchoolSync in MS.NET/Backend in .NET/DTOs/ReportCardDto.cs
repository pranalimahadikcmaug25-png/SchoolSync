namespace SmartSchoolAPI.DTOs;

public class ReportCardDto
{
    public int? ReportCardId { get; set; }
    public int StudentId { get; set; }
    public string AcademicYear { get; set; } = string.Empty;
    public string Term { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public decimal TotalMarks { get; set; }
    public decimal MarksObtained { get; set; }
    public decimal Percentage { get; set; }
    public string Grade { get; set; } = string.Empty;
    public int Rank { get; set; }
    public string? Remarks { get; set; }
}

