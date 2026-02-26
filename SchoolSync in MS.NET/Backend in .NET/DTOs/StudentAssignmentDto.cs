namespace SmartSchoolAPI.DTOs;

public class StudentAssignmentDto
{
    public int? StudentAssignmentId { get; set; }
    public int AssignmentId { get; set; }
    public int StudentId { get; set; }
    public string? SubmissionText { get; set; }
    public string? SubmissionFileUrl { get; set; }
    public DateTime? SubmittedDate { get; set; }
    public decimal? MarksObtained { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Feedback { get; set; }
}

