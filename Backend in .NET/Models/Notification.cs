namespace SmartSchoolAPI.Models;

public class Notification
{
    public int NotificationId { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // EMAIL, SMS
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

