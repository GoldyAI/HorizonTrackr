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
        public async Task<IActionResult> PutJob(int id, Job job)
        {
            if (id != job.Id) return BadRequest();
            _context.Entry(job).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

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
