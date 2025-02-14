using System;
using System.ComponentModel.DataAnnotations;

namespace HorizonTrackrAPI.Models
{
    public class Job
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Company is required")]
        public string Company { get; set; } = string.Empty;

        [Required(ErrorMessage = "Position is required")]
        public string Position { get; set; } = string.Empty;

        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; } = "Applied";

        [Required(ErrorMessage = "DateApplied is required")]
        public DateTime DateApplied { get; set; } = DateTime.UtcNow;

        public string? Notes { get; set; }
    }
}
