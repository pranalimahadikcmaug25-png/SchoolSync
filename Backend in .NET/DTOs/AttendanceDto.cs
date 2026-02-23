namespace SmartSchoolAPI.DTOs;

public class AttendanceDto
{
    public int StudentId { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty;
}

