import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'How do I report a power outage or backup failure?',
    answer: 'Create a support ticket with category "Power Outage" for fastest response. Our team aims to resolve power-related issues within 4 hours. For emergencies, call our 24/7 helpline at +91 1800-123-4567.',
  },
  {
    id: 'faq-2',
    question: 'Why is my solar generation lower than expected?',
    answer: 'Solar output varies with weather, season, and panel orientation. Check the Dashboard for real-time readings. If generation drops significantly for 3+ consecutive sunny days, create a ticket under "Solar Performance". We typically resolve within 24 hours.',
  },
  {
    id: 'faq-3',
    question: 'How are my monthly bills calculated?',
    answer: 'Your bill includes the fixed plan fee (Solar Starter ₹1,799/mo, Hybrid Freedom ₹2,499/mo, or Grid Independent ₹3,799/mo) plus energy charges at the plan rate. Grid backup is billed separately at ₹7/kWh. Net metering credits reduce your bill when you export surplus solar.',
  },
  {
    id: 'faq-4',
    question: 'When will my installation be scheduled?',
    answer: 'After DISCOM approval, we schedule installation within 2–3 weeks. You will receive SMS and email with the date. For date changes or queries, create a ticket under "Installation". We respond within 3 business days.',
  },
  {
    id: 'faq-5',
    question: 'Does EaaS include hardware maintenance?',
    answer: 'Yes. All equipment is owned and maintained by us. There is no upfront cost—you subscribe to the energy service only. We handle solar panels, inverters, batteries, and meters. Report issues via support tickets.',
  },
  {
    id: 'faq-6',
    question: 'How do I upgrade or change my plan?',
    answer: 'Visit Services & Plans to compare options. Plan changes take effect from the next billing cycle. Contact support for custom requirements or to discuss Hybrid Freedom or Grid Independent upgrades.',
  },
  {
    id: 'faq-7',
    question: 'What if my battery is not holding charge?',
    answer: 'Create a ticket under "Battery Issue" with details of backup duration and usage. Our technicians will diagnose remotely or schedule a visit. Most battery issues are resolved within 24 hours.',
  },
  {
    id: 'faq-8',
    question: 'How do I track my support ticket status?',
    answer: 'All tickets appear on this Support page. Click any ticket to view details and conversation. You will receive email updates when we reply. Filter by Open, In Progress, or Resolved to find tickets quickly.',
  },
];

const SupportFAQ = () => {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(id);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className="w-full flex items-center justify-between gap-4 py-4 px-4 text-left hover:bg-gray-50/50 transition-colors"
                aria-expanded={isOpen}
                aria-controls={`${item.id}-answer`}
                id={`${item.id}-question`}
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                <span className="flex-shrink-0 text-gray-500">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5" aria-hidden />
                  ) : (
                    <ChevronDown className="w-5 h-5" aria-hidden />
                  )}
                </span>
              </button>
              <div
                id={`${item.id}-answer`}
                role="region"
                aria-labelledby={`${item.id}-question`}
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-4 pt-0 text-gray-600 text-sm border-t border-gray-100">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SupportFAQ;
