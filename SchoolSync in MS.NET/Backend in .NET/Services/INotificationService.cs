using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Services;

public interface INotificationService
{
    Task SendAbsenceEmailAsync(Student student, DateTime date);
}

