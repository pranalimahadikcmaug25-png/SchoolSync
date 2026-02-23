using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.DTOs;
using SmartSchoolAPI.Models;
using SmartSchoolAPI.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace SmartSchoolAPI.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public AuthService(IUserRepository userRepository, IConfiguration configuration, ApplicationDbContext context)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _context = context;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepository.GetByUsernameAsync(loginDto.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return null;
        }

        var token = GenerateJwtToken(user);
        var response = new AuthResponseDto
        {
            Token = token,
            Role = user.Role,
            UserId = user.UserId,
            Username = user.Username
        };

        if (user.Role == "Student")
        {
            var student = await _userRepository.GetStudentByUserIdAsync(user.UserId);
            response.StudentId = student?.StudentId;
        }
        else if (user.Role == "Teacher")
        {
            var teacher = await _userRepository.GetTeacherByUserIdAsync(user.UserId);
            response.TeacherId = teacher?.TeacherId;
        }

        return response;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await _userRepository.GetByUsernameAsync(registerDto.Username);
        if (existingUser != null)
        {
            return null; // Username already exists
        }

        var user = new User
        {
            Username = registerDto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Role = registerDto.Role,
            Email = registerDto.Email,
            Phone = registerDto.Phone
        };

        var createdUser = await _userRepository.CreateAsync(user);

        // Create role-specific records
        if (registerDto.Role == "Student")
        {
            var student = new Student
            {
                UserId = createdUser.UserId,
                RollNo = registerDto.RollNo ?? "",
                Class = registerDto.Class ?? ""
            };
            _context.Students.Add(student);
            await _context.SaveChangesAsync();
        }
        else if (registerDto.Role == "Teacher")
        {
            var teacher = new Teacher
            {
                UserId = createdUser.UserId,
                Subject = registerDto.Subject ?? ""
            };
            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();
        }

        var token = GenerateJwtToken(createdUser);
        var response = new AuthResponseDto
        {
            Token = token,
            Role = createdUser.Role,
            UserId = createdUser.UserId,
            Username = createdUser.Username
        };

        if (createdUser.Role == "Student")
        {
            var student = await _userRepository.GetStudentByUserIdAsync(createdUser.UserId);
            response.StudentId = student?.StudentId;
        }
        else if (createdUser.Role == "Teacher")
        {
            var teacher = await _userRepository.GetTeacherByUserIdAsync(createdUser.UserId);
            response.TeacherId = teacher?.TeacherId;
        }

        return response;
    }

    private string GenerateJwtToken(User user)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyForJWTTokenGeneration12345");
        var issuer = _configuration["Jwt:Issuer"] ?? "SmartSchoolAPI";
        var audience = _configuration["Jwt:Audience"] ?? "SmartSchoolClient";
        var expiryMinutes = int.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "60");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

