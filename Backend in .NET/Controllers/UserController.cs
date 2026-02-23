using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.DTOs;
using SmartSchoolAPI.Models;
using SmartSchoolAPI.Repositories;

namespace SmartSchoolAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Teacher")]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ApplicationDbContext _context;

    public UserController(IUserRepository userRepository, ApplicationDbContext context)
    {
        _userRepository = userRepository;
        _context = context;
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = await _userRepository.GetAllStudentsAsync();
        var result = students.Select(s => new
        {
            studentId = s.StudentId,
            userId = s.UserId,
            username = s.User.Username,
            email = s.User.Email,
            phone = s.User.Phone,
            rollNo = s.RollNo,
            className = s.Class
        });
        return Ok(result);
    }

    [HttpGet("teachers")]
    public async Task<IActionResult> GetAllTeachers()
    {
        var teachers = await _userRepository.GetAllTeachersAsync();
        var result = teachers.Select(t => new
        {
            teacherId = t.TeacherId,
            userId = t.UserId,
            username = t.User.Username,
            email = t.User.Email,
            phone = t.User.Phone,
            subject = t.Subject
        });
        return Ok(result);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userRepository.GetAllUsersAsync();
        var result = users.Select(u => new
        {
            userId = u.UserId,
            username = u.Username,
            role = u.Role,
            email = u.Email,
            phone = u.Phone
        });
        return Ok(result);
    }

    // Student CRUD Operations
    [HttpPost("students")]
    public async Task<IActionResult> CreateStudent([FromBody] StudentDto studentDto)
    {
        var existingUser = await _userRepository.GetByUsernameAsync(studentDto.Username);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Username already exists" });
        }

        var user = new User
        {
            Username = studentDto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(studentDto.Password),
            Role = "Student",
            Email = studentDto.Email,
            Phone = studentDto.Phone
        };

        var createdUser = await _userRepository.CreateAsync(user);

        var student = new Student
        {
            UserId = createdUser.UserId,
            RollNo = studentDto.RollNo,
            Class = studentDto.Class
        };

        var createdStudent = await _userRepository.CreateStudentAsync(student);
        return Ok(new { message = "Student created successfully", studentId = createdStudent.StudentId });
    }

    [HttpGet("students/{id}")]
    public async Task<IActionResult> GetStudent(int id)
    {
        var student = await _userRepository.GetStudentByIdAsync(id);
        if (student == null) return NotFound();

        return Ok(new
        {
            studentId = student.StudentId,
            userId = student.UserId,
            username = student.User.Username,
            email = student.User.Email,
            phone = student.User.Phone,
            rollNo = student.RollNo,
            className = student.Class
        });
    }

    [HttpPut("students/{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] StudentDto studentDto)
    {
        var student = await _userRepository.GetStudentByIdAsync(id);
        if (student == null) return NotFound();

        var user = await _userRepository.GetByIdAsync(student.UserId);
        if (user == null) return NotFound();

        // Check if username is being changed and if it's already taken
        if (user.Username != studentDto.Username)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(studentDto.Username);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Username already exists" });
            }
        }

        user.Username = studentDto.Username;
        if (!string.IsNullOrEmpty(studentDto.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(studentDto.Password);
        }
        user.Email = studentDto.Email;
        user.Phone = studentDto.Phone;

        await _userRepository.UpdateAsync(user);

        student.RollNo = studentDto.RollNo;
        student.Class = studentDto.Class;

        await _userRepository.UpdateStudentAsync(student);

        return Ok(new { message = "Student updated successfully" });
    }

    [HttpDelete("students/{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _userRepository.GetStudentByIdAsync(id);
        if (student == null) return NotFound();

        var deleted = await _userRepository.DeleteStudentAsync(id);
        if (deleted)
        {
            await _userRepository.DeleteAsync(student.UserId);
            return Ok(new { message = "Student deleted successfully" });
        }
        return BadRequest(new { message = "Failed to delete student" });
    }

    // Teacher CRUD Operations
    [HttpPost("teachers")]
    public async Task<IActionResult> CreateTeacher([FromBody] TeacherDto teacherDto)
    {
        var existingUser = await _userRepository.GetByUsernameAsync(teacherDto.Username);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Username already exists" });
        }

        var user = new User
        {
            Username = teacherDto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(teacherDto.Password),
            Role = "Teacher",
            Email = teacherDto.Email,
            Phone = teacherDto.Phone
        };

        var createdUser = await _userRepository.CreateAsync(user);

        var teacher = new Teacher
        {
            UserId = createdUser.UserId,
            Subject = teacherDto.Subject
        };

        var createdTeacher = await _userRepository.CreateTeacherAsync(teacher);
        return Ok(new { message = "Teacher created successfully", teacherId = createdTeacher.TeacherId });
    }

    [HttpGet("teachers/{id}")]
    public async Task<IActionResult> GetTeacher(int id)
    {
        var teacher = await _userRepository.GetTeacherByIdAsync(id);
        if (teacher == null) return NotFound();

        return Ok(new
        {
            teacherId = teacher.TeacherId,
            userId = teacher.UserId,
            username = teacher.User.Username,
            email = teacher.User.Email,
            phone = teacher.User.Phone,
            subject = teacher.Subject
        });
    }

    [HttpPut("teachers/{id}")]
    public async Task<IActionResult> UpdateTeacher(int id, [FromBody] TeacherDto teacherDto)
    {
        var teacher = await _userRepository.GetTeacherByIdAsync(id);
        if (teacher == null) return NotFound();

        var user = await _userRepository.GetByIdAsync(teacher.UserId);
        if (user == null) return NotFound();

        // Check if username is being changed and if it's already taken
        if (user.Username != teacherDto.Username)
        {
            var existingUser = await _userRepository.GetByUsernameAsync(teacherDto.Username);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Username already exists" });
            }
        }

        user.Username = teacherDto.Username;
        if (!string.IsNullOrEmpty(teacherDto.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(teacherDto.Password);
        }
        user.Email = teacherDto.Email;
        user.Phone = teacherDto.Phone;

        await _userRepository.UpdateAsync(user);

        teacher.Subject = teacherDto.Subject;
        await _userRepository.UpdateTeacherAsync(teacher);

        return Ok(new { message = "Teacher updated successfully" });
    }

    [HttpDelete("teachers/{id}")]
    public async Task<IActionResult> DeleteTeacher(int id)
    {
        var teacher = await _userRepository.GetTeacherByIdAsync(id);
        if (teacher == null) return NotFound();

        var deleted = await _userRepository.DeleteTeacherAsync(id);
        if (deleted)
        {
            await _userRepository.DeleteAsync(teacher.UserId);
            return Ok(new { message = "Teacher deleted successfully" });
        }
        return BadRequest(new { message = "Failed to delete teacher" });
    }
}

