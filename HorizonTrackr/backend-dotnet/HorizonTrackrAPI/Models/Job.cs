namespace HorizonTrackrAPI.Models  // ✅ Ensure correct namespace
{
    public class Job
    {
        public int Id { get; set; }
        public string Company { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Status { get; set; } = "Applied";
        public DateTime DateApplied { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}

