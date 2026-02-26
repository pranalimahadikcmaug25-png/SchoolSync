namespace SmartSchoolAPI.Models;

public class Enrollment
{
    public int EnrollmentId { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public string AcademicYear { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public DateTime EnrollmentDate { get; set; }
    public string Status { get; set; } = string.Empty; // Active, Completed, Transferred
    public string? Remarks { get; set; }
}

