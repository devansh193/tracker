import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How does real-time monitoring work?",
    answer:
      "Our platform continuously monitors your website's performance metrics, traffic patterns, and user behavior. We collect data every few seconds and use advanced algorithms to detect anomalies instantly, sending you alerts within minutes of any unusual activity.",
  },
  {
    question: "What types of anomalies can WebInsight detect?",
    answer:
      "WebInsight can detect various anomalies including sudden traffic spikes or drops, unusual bounce rates, slow page load times, server errors, suspicious bot activity, security threats, and changes in user behavior patterns.",
  },
  {
    question: "How do I customize my notification settings?",
    answer:
      "You can fully customize your alerts through our dashboard. Set thresholds for different metrics, choose notification channels (email, SMS, Slack, webhook), define alert frequencies, and create custom rules based on your specific business needs.",
  },
  {
    question: "How accurate is the analytics data?",
    answer:
      "Our analytics are highly accurate with 99.9% data integrity. We use multiple data collection methods, real-time processing, and cross-validation to ensure the most reliable insights for your business decisions.",
  },
  {
    question: "Is my website data secure?",
    answer:
      "Yes, security is our top priority. We use enterprise-grade encryption, comply with GDPR and CCPA regulations, and maintain SOC 2 Type II certification. Your data is stored securely and never shared with third parties.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="relative mx-auto max-w-7xl px-4 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="font-geist mb-4 text-3xl font-bold text-gray-200 md:text-4xl">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-gray-400">
            Find answers to common questions about our platform.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-gray-800"
              >
                <AccordionTrigger className="hover:text-gradient text-left text-white hover:cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-400">
            Don&apos;t see your question here?
          </p>
          <Button
            variant="outline"
            className="font-geist border border-[#363636] bg-[#242424] font-medium text-white hover:cursor-pointer hover:border-[#363636] hover:bg-[#242424] hover:text-white"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
