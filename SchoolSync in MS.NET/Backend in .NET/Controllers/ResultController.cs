using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartSchoolAPI.DTOs;
using SmartSchoolAPI.Services;

namespace SmartSchoolAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ResultController : ControllerBase
{
    private readonly IResultService _resultService;

    public ResultController(IResultService resultService)
    {
        _resultService = resultService;
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> UploadResult([FromBody] ResultDto resultDto)
    {
        var result = await _resultService.UploadResultAsync(resultDto);
        if (result)
        {
            return Ok(new { message = "Result uploaded successfully" });
        }
        return BadRequest(new { message = "Failed to upload result" });
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetStudentResults(int studentId)
    {
        var results = await _resultService.GetStudentResultsAsync(studentId);
        return Ok(results);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin,Teacher")]
    public async Task<IActionResult> GetAllResults()
    {
        var results = await _resultService.GetAllResultsAsync();
        return Ok(results);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetResult(int id)
    {
        var result = await _resultService.GetResultByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateResult(int id, [FromBody] ResultDto resultDto)
    {
        var result = await _resultService.UpdateResultAsync(id, resultDto);
        if (result)
        {
            return Ok(new { message = "Result updated successfully" });
        }
        return BadRequest(new { message = "Failed to update result" });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteResult(int id)
    {
        var result = await _resultService.DeleteResultAsync(id);
        if (result)
        {
            return Ok(new { message = "Result deleted successfully" });
        }
        return BadRequest(new { message = "Failed to delete result" });
    }
}

