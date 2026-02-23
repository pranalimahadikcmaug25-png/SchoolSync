using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.DTOs;
using SmartSchoolAPI.Models;
using SmartSchoolAPI.Repositories;
using System.Security.Claims;

namespace SmartSchoolAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudentManagementController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly IFeeRepository _feeRepository;

    public StudentManagementController(
        ApplicationDbContext context,
        IEnrollmentRepository enrollmentRepository,
        IFeeRepository feeRepository)
    {
        _context = context;
        _enrollmentRepository = enrollmentRepository;
        _feeRepository = feeRepository;
    }

    // Enrollment Endpoints
    [HttpPost("enrollment")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateEnrollment([FromBody] EnrollmentDto dto)
    {
        var enrollment = new Enrollment
        {
            StudentId = dto.StudentId,
            AcademicYear = dto.AcademicYear,
            Class = dto.Class,
            Section = dto.Section,
            EnrollmentDate = dto.EnrollmentDate,
            Status = dto.Status,
            Remarks = dto.Remarks
        };

        var created = await _enrollmentRepository.CreateAsync(enrollment);
        return Ok(new { message = "Enrollment created successfully", enrollmentId = created.EnrollmentId });
    }

    [HttpGet("enrollment/student/{studentId}")]
    public async Task<IActionResult> GetStudentEnrollment(int studentId)
    {
        var enrollment = await _enrollmentRepository.GetByStudentIdAsync(studentId);
        if (enrollment == null) return NotFound();

        return Ok(new
        {
            enrollmentId = enrollment.EnrollmentId,
            studentId = enrollment.StudentId,
            studentName = enrollment.Student.User.Username,
            academicYear = enrollment.AcademicYear,
            className = enrollment.Class,
            section = enrollment.Section,
            enrollmentDate = enrollment.EnrollmentDate.ToString("yyyy-MM-dd"),
            status = enrollment.Status,
            remarks = enrollment.Remarks
        });
    }

    [HttpGet("enrollment/all")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<IActionResult> GetAllEnrollments()
    {
        var enrollments = await _enrollmentRepository.GetAllAsync();
        var result = enrollments.Select(e => new
        {
            enrollmentId = e.EnrollmentId,
            studentId = e.StudentId,
            studentName = e.Student.User.Username,
            rollNo = e.Student.RollNo,
            academicYear = e.AcademicYear,
            className = e.Class,
            section = e.Section,
            enrollmentDate = e.EnrollmentDate.ToString("yyyy-MM-dd"),
            status = e.Status
        });
        return Ok(result);
    }

    [HttpPut("enrollment/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateEnrollment(int id, [FromBody] EnrollmentDto dto)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(id);
        if (enrollment == null) return NotFound();

        enrollment.AcademicYear = dto.AcademicYear;
        enrollment.Class = dto.Class;
        enrollment.Section = dto.Section;
        enrollment.Status = dto.Status;
        enrollment.Remarks = dto.Remarks;

        await _enrollmentRepository.UpdateAsync(enrollment);
        return Ok(new { message = "Enrollment updated successfully" });
    }

    [HttpDelete("enrollment/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteEnrollment(int id)
    {
        var result = await _enrollmentRepository.DeleteAsync(id);
        if (result)
            return Ok(new { message = "Enrollment deleted successfully" });
        return NotFound();
    }

    // Fee Endpoints
    [HttpPost("fee")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateFee([FromBody] FeeDto dto)
    {
        var fee = new Fee
        {
            StudentId = dto.StudentId,
            FeeType = dto.FeeType,
            Amount = dto.Amount,
            DueDate = dto.DueDate,
            PaidDate = dto.PaidDate,
            Status = dto.Status,
            PaymentMethod = dto.PaymentMethod,
            TransactionId = dto.TransactionId,
            Remarks = dto.Remarks
        };

        var created = await _feeRepository.CreateAsync(fee);
        return Ok(new { message = "Fee created successfully", feeId = created.FeeId });
    }

    [HttpGet("fee/student/{studentId}")]
    public async Task<IActionResult> GetStudentFees(int studentId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        // Students can only view their own fees
        if (role == "Student")
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null || student.StudentId != studentId)
                return Forbid();
        }

        var fees = await _feeRepository.GetByStudentIdAsync(studentId);
        var result = fees.Select(f => new
        {
            feeId = f.FeeId,
            feeType = f.FeeType,
            amount = f.Amount,
            dueDate = f.DueDate.ToString("yyyy-MM-dd"),
            paidDate = f.PaidDate?.ToString("yyyy-MM-dd"),
            status = f.Status,
            paymentMethod = f.PaymentMethod,
            transactionId = f.TransactionId
        });
        return Ok(result);
    }

    [HttpGet("fee/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllFees()
    {
        var fees = await _feeRepository.GetAllAsync();
        var result = fees.Select(f => new
        {
            feeId = f.FeeId,
            studentId = f.StudentId,
            studentName = f.Student.User.Username,
            rollNo = f.Student.RollNo,
            feeType = f.FeeType,
            amount = f.Amount,
            dueDate = f.DueDate.ToString("yyyy-MM-dd"),
            paidDate = f.PaidDate?.ToString("yyyy-MM-dd"),
            status = f.Status
        });
        return Ok(result);
    }

    [HttpPut("fee/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateFee(int id, [FromBody] FeeDto dto)
    {
        var fee = await _feeRepository.GetByIdAsync(id);
        if (fee == null) return NotFound();

        fee.FeeType = dto.FeeType;
        fee.Amount = dto.Amount;
        fee.DueDate = dto.DueDate;
        fee.PaidDate = dto.PaidDate;
        fee.Status = dto.Status;
        fee.PaymentMethod = dto.PaymentMethod;
        fee.TransactionId = dto.TransactionId;
        fee.Remarks = dto.Remarks;

        await _feeRepository.UpdateAsync(fee);
        return Ok(new { message = "Fee updated successfully" });
    }

    // Student pays fee endpoint
    [HttpPut("fee/pay/{id}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> PayFee(int id, [FromBody] FeeDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
        if (student == null)
            return Forbid();

        var fee = await _feeRepository.GetByIdAsync(id);
        if (fee == null || fee.StudentId != student.StudentId)
            return Forbid();

        if (fee.Status == "Paid")
            return BadRequest(new { message = "Fee is already paid." });

        fee.Status = "Paid";
        fee.PaidDate = DateTime.UtcNow;
        fee.PaymentMethod = dto.PaymentMethod;
        fee.TransactionId = dto.TransactionId;

        await _feeRepository.UpdateAsync(fee);
        return Ok(new { message = "Fee paid successfully" });
    }

    [HttpDelete("fee/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteFee(int id)
    {
        var result = await _feeRepository.DeleteAsync(id);
        if (result)
            return Ok(new { message = "Fee deleted successfully" });
        return NotFound();
    }

    // Student Profile Summary
    [HttpGet("profile/{studentId}")]
    public async Task<IActionResult> GetStudentProfile(int studentId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        if (role == "Student")
        {
            var currentStudent = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            if (currentStudent == null || currentStudent.StudentId != studentId)
                return Forbid();
        }

        var student = await _context.Students
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.StudentId == studentId);

        //var student = await _context.Students
        //    .Include(s => s.User)
        //    .FirstOrDefaultAsync(s => s.StudentId == studentId);

        if (student == null) return NotFound();

        var enrollment = await _enrollmentRepository.GetByStudentIdAsync(studentId);
        var fees = await _feeRepository.GetByStudentIdAsync(studentId);
        var attendance = await _context.Attendances
            .Where(a => a.StudentId == studentId)
            .ToListAsync();
        var results = await _context.Results
            .Where(r => r.StudentId == studentId)
            .ToListAsync();

        var totalFees = fees.Sum(f => f.Amount);
        var paidFees = fees.Where(f => f.Status == "Paid").Sum(f => f.Amount);
        var pendingFees = totalFees - paidFees;

        var presentDays = attendance.Count(a => a.Status == "Present");
        var totalDays = attendance.Count;
        var attendancePercentage = totalDays > 0 ? (presentDays * 100.0 / totalDays) : 0;

        return Ok(new
        {
            student = new
            {
                studentId = student.StudentId,
                username = student.User.Username,
                email = student.User.Email,
                phone = student.User.Phone,
                rollNo = student.RollNo,
                className = student.Class
            },
            enrollment = enrollment != null ? new
            {
                academicYear = enrollment.AcademicYear,
                className = enrollment.Class,
                section = enrollment.Section,
                status = enrollment.Status
            } : null,
            fees = new
            {
                total = totalFees,
                paid = paidFees,
                pending = pendingFees,
                count = fees.Count
            },
            attendance = new
            {
                presentDays,
                totalDays,
                percentage = Math.Round(attendancePercentage, 2)
            },
            results = new
            {
                count = results.Count,
                averageMarks = results.Count > 0 ? results.Average(r => (double)r.Marks) : 0
            }
        });
    }
}

