namespace SmartSchoolAPI.Models;

public class Parent
{
    public int ParentId { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty; // Father, Mother, Guardian
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Occupation { get; set; }
    public string? Address { get; set; }
    public bool IsPrimaryContact { get; set; }
}

