namespace SmartSchoolAPI.Models;

public class Admission
{
    public int AdmissionId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public string AppliedClass { get; set; } = string.Empty;
    public string AcademicYear { get; set; } = string.Empty;
    
    // Parent/Guardian Information
    public string FatherName { get; set; } = string.Empty;
    public string FatherOccupation { get; set; } = string.Empty;
    public string FatherPhone { get; set; } = string.Empty;
    public string MotherName { get; set; } = string.Empty;
    public string MotherOccupation { get; set; } = string.Empty;
    public string MotherPhone { get; set; } = string.Empty;
    public string GuardianName { get; set; } = string.Empty;
    public string GuardianRelation { get; set; } = string.Empty;
    public string GuardianPhone { get; set; } = string.Empty;
    
    // Previous School Information
    public string? PreviousSchool { get; set; }
    public string? PreviousClass { get; set; }
    public decimal? PreviousMarks { get; set; }
    
    // Application Details
    public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Under Review
    public string? Remarks { get; set; }
    public int? ReviewedBy { get; set; } // UserId
    public DateTime? ReviewedDate { get; set; }

    // Documents (URLs or file paths)
    public string? PhotoUrl { get; set; }
    public string? BirthCertificateUrl { get; set; }
    public string? PreviousMarksheetUrl { get; set; }
    public string? AddressProofUrl { get; set; }
}

