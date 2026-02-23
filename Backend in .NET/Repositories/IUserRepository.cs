using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Repositories;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User?> GetByIdAsync(int userId);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(int userId);
    Task<Student?> GetStudentByUserIdAsync(int userId);
    Task<Student?> GetStudentByIdAsync(int studentId);
    Task<Student> CreateStudentAsync(Student student);
    Task<Student> UpdateStudentAsync(Student student);
    Task<bool> DeleteStudentAsync(int studentId);
    Task<Teacher?> GetTeacherByUserIdAsync(int userId);
    Task<Teacher?> GetTeacherByIdAsync(int teacherId);
    Task<Teacher> CreateTeacherAsync(Teacher teacher);
    Task<Teacher> UpdateTeacherAsync(Teacher teacher);
    Task<bool> DeleteTeacherAsync(int teacherId);
    Task<List<User>> GetAllUsersAsync();
    Task<List<Student>> GetAllStudentsAsync();
    Task<List<Teacher>> GetAllTeachersAsync();
}

