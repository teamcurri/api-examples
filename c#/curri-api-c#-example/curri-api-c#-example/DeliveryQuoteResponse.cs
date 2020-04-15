using System;

namespace CurriAPI.Example
{
    public class DeliveryQuoteResponse
    {

        public DeliveryQuoteContent DeliveryQuote { get; set; }
        public string Id { get; set; }

        public class DeliveryQuoteContent
        {
            public string Id { get; set; }
        }
    }
}
