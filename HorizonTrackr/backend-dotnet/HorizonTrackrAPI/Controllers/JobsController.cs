using HorizonTrackrAPI.Data;
using HorizonTrackrAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HorizonTrackrAPI.Controllers
{

    
        [ApiController]
        [Route("api/[controller]")]
        public class JobsController : ControllerBase
        {
            private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/jobs (Fetch all jobs)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
        {
            var jobs = await _context.Jobs.ToListAsync();
            if (jobs == null || jobs.Count == 0)
            {
                return NotFound(new { message = "No jobs found" });
            }
            return Ok(jobs);
        }

        // ✅ GET: api/jobs/{id} (Fetch a single job)
        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) 
                return NotFound(new { message = $"Job with ID {id} not found" });

            return Ok(job);
        }

        // ✅ POST: api/jobs (Add a new job)
        [HttpPost]
        public async Task<ActionResult<Job>> PostJob([FromBody] Job job)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        // ✅ PUT: api/jobs/{id} (Update an existing job)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJob(int id, [FromBody] Job updatedJob)
        {
            if (id != updatedJob.Id)
            {
                return BadRequest(new { message = "Job ID mismatch" });
            }

            var existingJob = await _context.Jobs.FindAsync(id);
            if (existingJob == null)
            {
                return NotFound(new { message = $"Job with ID {id} not found" });
            }

            // 🔹 Update only changed fields
            existingJob.Company = updatedJob.Company;
            existingJob.Position = updatedJob.Position;
            existingJob.Status = updatedJob.Status;
            existingJob.DateApplied = updatedJob.DateApplied;
            existingJob.Notes = updatedJob.Notes;

            await _context.SaveChangesAsync();
            return Ok(existingJob);
        }

        // ✅ DELETE: api/jobs/{id} (Delete a job)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound(new { message = $"Job with ID {id} not found" });
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Job with ID {id} deleted successfully" });
        }
    }
}
