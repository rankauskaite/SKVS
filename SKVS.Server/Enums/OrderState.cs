namespace SKVS.Server.Enums
{
    public enum OrderState
    {
        Cancelled,
        Scheduled,
        Formed,
        InProgress,
        Completed
    }

    public static class OrderStateLabels
    {
        public static readonly Dictionary<OrderState, string> StateLabelsLt = new Dictionary<OrderState, string>
        {
            { OrderState.Formed, "Sudarytas" },
            { OrderState.Scheduled, "Suplanuotas" },
            { OrderState.InProgress, "Vykdomas" },
            { OrderState.Completed, "Įvykdytas" },
            { OrderState.Cancelled, "Atšauktas" }
        };
    }

}
