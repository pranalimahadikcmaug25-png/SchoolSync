namespace SmartSchoolAPI.Models;

public class Fee
{
    public int FeeId { get; set; }
    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;
    public string FeeType { get; set; } = string.Empty; // Tuition, Library, Sports, etc.
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? PaidDate { get; set; }
    public string Status { get; set; } = string.Empty; // Pending, Paid, Overdue
    public string? PaymentMethod { get; set; }
    public string? TransactionId { get; set; }
    public string? Remarks { get; set; }
}

