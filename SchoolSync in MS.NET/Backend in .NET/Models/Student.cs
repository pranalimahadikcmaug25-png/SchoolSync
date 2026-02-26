using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartSchoolAPI.Models;

public class Student
{
    [Key]
    public int StudentId { get; set; }

    [Required]
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }

    public User User { get; set; } = null!;

    [Required]
    [MaxLength(20)]
    public string RollNo { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Class { get; set; } = string.Empty;
}