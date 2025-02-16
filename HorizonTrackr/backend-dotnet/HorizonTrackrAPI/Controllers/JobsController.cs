using HorizonTrackrAPI.Data;
using HorizonTrackrAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HorizonTrackrAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/jobs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Job>>> GetJobs()
        {
            return await _context.Jobs.ToListAsync();
        }

        // GET: api/jobs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Job>> GetJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return NotFound();
            return job;
        }

        // POST: api/jobs
        [HttpPost]
        public async Task<ActionResult<Job>> PostJob(Job job)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // ✅ Returns validation errors
            }

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        // PUT: api/jobs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutJob(int id, Job updatedJob)
        {
            if (id != updatedJob.Id)
            {
                return BadRequest("Job ID mismatch");
            }

            var existingJob = await _context.Jobs.FindAsync(id);
            if (existingJob == null)
            {
                return NotFound();
            }

            // ✅ Update only the necessary fields
            existingJob.Company = updatedJob.Company;
            existingJob.Position = updatedJob.Position;
            existingJob.Status = updatedJob.Status;
            existingJob.DateApplied = updatedJob.DateApplied;
            existingJob.Notes = updatedJob.Notes;

            await _context.SaveChangesAsync();

            return Ok(existingJob); // ✅ Return the updated job instead of NoContent()
        }

        // DELETE: api/jobs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
            {
                return NotFound();
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
