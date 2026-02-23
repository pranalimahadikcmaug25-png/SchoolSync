namespace SmartSchoolAPI.Models;

public class StudentAssignment
{
    public int StudentAssignmentId { get; set; }
    public int AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = null!;
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public string? SubmissionText { get; set; }
    public string? SubmissionFileUrl { get; set; }
    public DateTime? SubmittedDate { get; set; }
    public decimal? MarksObtained { get; set; }
    public string Status { get; set; } = string.Empty; // Not Submitted, Submitted, Graded
    public string? Feedback { get; set; }
}

