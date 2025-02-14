using System;
using System.ComponentModel.DataAnnotations;

namespace HorizonTrackrAPI.Models
{
    public class Job
    {
        [Key]  // Primary Key
        public int Id { get; set; }

        [Required]
        public string Company { get; set; }

        [Required]
        public string Position { get; set; }

        public string Status { get; set; } = "Applied";  // Default status

        public DateTime DateApplied { get; set; } = DateTime.UtcNow;

        public string Notes { get; set; }  // Additional details
    }
}
