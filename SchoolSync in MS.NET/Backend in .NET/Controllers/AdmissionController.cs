using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.DTOs;
using SmartSchoolAPI.Models;
using System.Security.Claims;

namespace SmartSchoolAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdmissionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdmissionController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("apply")]
    [AllowAnonymous]
    public async Task<IActionResult> ApplyForAdmission([FromBody] AdmissionDto dto)
    {
        var admission = new Admission
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            DateOfBirth = dto.DateOfBirth,
            Gender = dto.Gender,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address,
            City = dto.City,
            State = dto.State,
            Pincode = dto.Pincode,
            AppliedClass = dto.AppliedClass,
            AcademicYear = dto.AcademicYear,
            FatherName = dto.FatherName,
            FatherOccupation = dto.FatherOccupation,
            FatherPhone = dto.FatherPhone,
            MotherName = dto.MotherName,
            MotherOccupation = dto.MotherOccupation,
            MotherPhone = dto.MotherPhone,
            GuardianName = dto.GuardianName,
            GuardianRelation = dto.GuardianRelation,
            GuardianPhone = dto.GuardianPhone,
            PreviousSchool = dto.PreviousSchool,
            PreviousClass = dto.PreviousClass,
            PreviousMarks = dto.PreviousMarks,
            Status = "Pending",
            ApplicationDate = DateTime.UtcNow,
            PhotoUrl = dto.PhotoUrl,
            BirthCertificateUrl = dto.BirthCertificateUrl,
            PreviousMarksheetUrl = dto.PreviousMarksheetUrl,
            AddressProofUrl = dto.AddressProofUrl
        };

        _context.Admissions.Add(admission);
        await _context.SaveChangesAsync();

        return Ok(new 
        { 
            message = "Admission application submitted successfully!",
            admissionId = admission.AdmissionId,
            applicationNumber = $"APP{admission.AdmissionId:00000}"
        });
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllAdmissions()
    {
        var admissions = await _context.Admissions
            .OrderByDescending(a => a.ApplicationDate)
            .ToListAsync();

        var result = admissions.Select(a => new
        {
            admissionId = a.AdmissionId,
            applicationNumber = $"APP{a.AdmissionId:00000}",
            fullName = $"{a.FirstName} {a.LastName}",
            email = a.Email,
            phone = a.Phone,
            appliedClass = a.AppliedClass,
            academicYear = a.AcademicYear,
            applicationDate = a.ApplicationDate.ToString("yyyy-MM-dd"),
            status = a.Status,
            reviewedBy = a.ReviewedBy,
            reviewedDate = a.ReviewedDate?.ToString("yyyy-MM-dd")
        });

        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAdmission(int id)
    {
        var admission = await _context.Admissions.FindAsync(id);
        if (admission == null) return NotFound();

        return Ok(new
        {
            admissionId = admission.AdmissionId,
            applicationNumber = $"APP{admission.AdmissionId:00000}",
            firstName = admission.FirstName,
            lastName = admission.LastName,
            dateOfBirth = admission.DateOfBirth.ToString("yyyy-MM-dd"),
            gender = admission.Gender,
            email = admission.Email,
            phone = admission.Phone,
            address = admission.Address,
            city = admission.City,
            state = admission.State,
            pincode = admission.Pincode,
            appliedClass = admission.AppliedClass,
            academicYear = admission.AcademicYear,
            fatherName = admission.FatherName,
            fatherOccupation = admission.FatherOccupation,
            fatherPhone = admission.FatherPhone,
            motherName = admission.MotherName,
            motherOccupation = admission.MotherOccupation,
            motherPhone = admission.MotherPhone,
            guardianName = admission.GuardianName,
            guardianRelation = admission.GuardianRelation,
            guardianPhone = admission.GuardianPhone,
            previousSchool = admission.PreviousSchool,
            previousClass = admission.PreviousClass,
            previousMarks = admission.PreviousMarks,
            applicationDate = admission.ApplicationDate.ToString("yyyy-MM-dd"),
            status = admission.Status,
            remarks = admission.Remarks,
            photoUrl = admission.PhotoUrl,
            birthCertificateUrl = admission.BirthCertificateUrl,
            previousMarksheetUrl = admission.PreviousMarksheetUrl,
            addressProofUrl = admission.AddressProofUrl
        });
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAdmissionStatus(int id, [FromBody] AdmissionStatusDto dto)
    {
        var admission = await _context.Admissions.FindAsync(id);
        if (admission == null) return NotFound();

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        admission.Status = dto.Status;
        admission.Remarks = dto.Remarks;
        admission.ReviewedBy = userId;
        admission.ReviewedDate = DateTime.UtcNow;

        _context.Admissions.Update(admission);
        await _context.SaveChangesAsync();

        // If approved, optionally create student account
        if (dto.Status == "Approved" && dto.CreateStudentAccount == true)
        {
            // This would create a student account - implementation can be added
        }

        return Ok(new { message = "Admission status updated successfully" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAdmission(int id)
    {
        var admission = await _context.Admissions.FindAsync(id);
        if (admission == null) return NotFound();

        _context.Admissions.Remove(admission);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Admission application deleted successfully" });
    }

    [HttpGet("check-status")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckApplicationStatus([FromQuery] string email, [FromQuery] string phone)
    {
        var admission = await _context.Admissions
            .Where(a => a.Email == email || a.Phone == phone)
            .OrderByDescending(a => a.ApplicationDate)
            .FirstOrDefaultAsync();

        if (admission == null)
        {
            return NotFound(new { message = "No application found with the provided details" });
        }

        return Ok(new
        {
            applicationNumber = $"APP{admission.AdmissionId:00000}",
            fullName = $"{admission.FirstName} {admission.LastName}",
            appliedClass = admission.AppliedClass,
            applicationDate = admission.ApplicationDate.ToString("yyyy-MM-dd"),
            status = admission.Status,
            remarks = admission.Remarks
        });
    }
}

public class AdmissionStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string? Remarks { get; set; }
    public bool CreateStudentAccount { get; set; } = false;
}

