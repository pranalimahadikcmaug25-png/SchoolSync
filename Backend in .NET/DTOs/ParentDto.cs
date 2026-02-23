namespace SmartSchoolAPI.DTOs;

public class ParentDto
{
    public int? ParentId { get; set; }
    public int StudentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Occupation { get; set; }
    public string? Address { get; set; }
    public bool IsPrimaryContact { get; set; }
}

