namespace SmartSchoolAPI.Models;

public class Attendance
{
    public int AttendanceId { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty; // Present, Absent
    public int MarkedBy { get; set; } // UserId of the teacher
}

