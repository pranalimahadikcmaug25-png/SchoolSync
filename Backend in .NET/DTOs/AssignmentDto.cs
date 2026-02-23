namespace SmartSchoolAPI.DTOs;

public class AssignmentDto
{
    public int? AssignmentId { get; set; }
    public int TeacherId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public DateTime AssignedDate { get; set; }
    public DateTime DueDate { get; set; }
    public int TotalMarks { get; set; }
    public string? AttachmentUrl { get; set; }
}

