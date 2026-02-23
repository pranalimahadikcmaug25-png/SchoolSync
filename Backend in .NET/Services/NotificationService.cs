using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using SmartSchoolAPI.Data;
using SmartSchoolAPI.Models;

namespace SmartSchoolAPI.Services;

public class NotificationService : INotificationService
{
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;

    public NotificationService(IConfiguration configuration, ApplicationDbContext context)
    {
        _configuration = configuration;
        _context = context;
    }

    public async Task SendAbsenceEmailAsync(Student student, DateTime date)
    {
        try
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
            var senderEmail = emailSettings["SenderEmail"] ?? "";
            var senderPassword = emailSettings["SenderPassword"] ?? "";
            var senderName = emailSettings["SenderName"] ?? "Smart School System";

            if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
            {
                return;
            }

            var studentUser = await _context.Users.FindAsync(student.UserId);
            var recipientEmail = studentUser?.Email;

            if (string.IsNullOrEmpty(recipientEmail))
            {
                return; 
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress(studentUser!.Username, recipientEmail));
            message.Subject = $"Absence Notification - {date:dd/MM/yyyy}";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; padding: 20px;'>
                        <h2 style='color: #d32f2f;'>📧 Absence Notification</h2>
                        <p>Dear {studentUser.Username},</p>
                        <p>This is to inform you that your child <strong>{studentUser.Username}</strong> was marked as <strong>ABSENT</strong> on <strong>{date:dd/MM/yyyy}</strong>.</p>
                        <p>Please contact the school if you have any questions.</p>
                        <hr>
                        <p style='color: #666; font-size: 12px;'>This is an automated message from Smart School System.</p>
                    </body>
                    </html>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(senderEmail, senderPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            // Save notification to database
            var notification = new Notification
            {
                StudentId = student.StudentId,
                Message = $"Absence notification sent for {date:dd/MM/yyyy}",
                Type = "EMAIL",
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
        }
    }
}

