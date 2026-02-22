import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import { Send, Bot, User as UserIcon, Sparkles, Search } from 'lucide-react';
import { aiAdvisorService } from '../services/aiAdvisorService.js';

// Helper function to get placeholder response (same as in service)
function getPlaceholderResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('competitor') || lowerMessage.includes('similar') || lowerMessage.includes('research')) {
    return `Here are some similar EaaS applications you can study:

1. **Amplus Solar**: One of India's largest distributed solar companies, offering rooftop solar subscriptions for commercial customers across Delhi, Mumbai, and Bengaluru.

2. **Cleantech Solar**: Operates solar-as-a-service for industrial clients across India and Southeast Asia with zero upfront cost models.

3. **Sunrun (US)**: A major residential solar EaaS provider offering PPA/Lease models — a useful benchmark for the EaaS subscription model.

4. **Octopus Energy (Kraken Tech)**: Known for agile tariffs and software platforms managing distributed energy resources.

5. **Tesla Energy**: Their solar subscription and Powerwall VPP (Virtual Power Plant) programs are excellent examples of integrated energy services.

These platforms demonstrate various approaches to energy-as-a-service models globally and in India.`;
  }

  if (lowerMessage.includes('savings') || lowerMessage.includes('co2') || lowerMessage.includes('carbon') || lowerMessage.includes('hybrid freedom')) {
    return `With the **Hybrid Freedom plan** (5kW Solar + 5kWh Battery at ₹2,499/mo), you can expect:

- **Monthly Savings**: Approximately ₹2,000–₹3,500 on electricity bills vs DISCOM rate of ₹7/kWh
- **Effective Energy Rate**: ₹4.00/kWh — compared to Bengaluru BESCOM rate of ₹7.55/kWh
- **CO₂ Offset**: Around 200–300 kg CO₂ per month
- **Annual Savings**: ₹24,000–₹42,000 per year
- **Lifetime Savings (20 yr)**: Over ₹5,00,000

Remember — ₹0 upfront. All hardware owned and maintained by EaaS. You only pay the monthly subscription.`;
  }

  if (lowerMessage.includes('fault') || lowerMessage.includes('issue') || lowerMessage.includes('problem')) {
    return `I've logged your issue report. Our technical team will review it and contact you within 24 hours.

For urgent issues, please call our support hotline: **+91 1800-123-4567** or visit the Support section to create a priority ticket.

Common inverter issues and quick fixes:
- Check if the inverter display is showing any error codes
- Ensure all connections are secure
- Verify that the system is receiving adequate sunlight

Since EaaS owns all the equipment, **you are never responsible for repair costs**. Our technicians will handle everything at no charge.

Is there anything specific about the fault you'd like to describe?`;
  }

  if (lowerMessage.includes('plan') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return `Here are our current EaaS subscription plans — **₹0 upfront on all plans**:

| Plan | Monthly | Annual (10% off) | Rate | Hardware |
|------|---------|-----------------|------|----------|
| **Solar Starter** | ₹1,799/mo | ₹1,619/mo | ₹4.50/kWh | 3kW Solar |
| **Hybrid Freedom** | ₹2,499/mo | ₹2,249/mo | ₹4.00/kWh | 5kW Solar + 5kWh Battery |
| **Grid Independent** | ₹3,799/mo | ₹3,419/mo | ₹3.50/kWh | 10kW Solar + 13.5kWh Battery |

Grid backup (from DISCOM) is billed separately at ₹7/kWh.

All equipment is **owned and maintained by EaaS** — you never buy or repair anything. Which plan would you like to know more about?`;
  }

  return `Thank you for your message! I'm Lumi, your EaaS AI Advisor. I can help you with:

- **Plan comparison** — Solar Starter ₹1,799/mo, Hybrid Freedom ₹2,499/mo, Grid Independent ₹3,799/mo
- **Savings analysis** — vs your current DISCOM tariff (typically ₹5–₹9/kWh in Indian cities)
- **Market research** — competitors and EaaS industry trends
- **Issue reporting** — technical support for your installation
- **CO₂ impact** — your carbon offset in kg CO₂

How can I assist you today?`;
}

const AiAdvisor = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm Lumi. I can help you understand our plans, analyse your energy savings, or provide market research on the EaaS industry.\n\nOur plans start at ₹1,799/mo — ₹0 upfront, zero hardware cost. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    const userId = user?.userId || user?.user_id;
    if (!inputValue.trim() || !userId) return;

    const userMessage = inputValue.trim();
    const newUserMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({ role: m.role, text: m.text }));
      const responseText = await aiAdvisorService.sendMessage(userId, userMessage, history);

      // Replace any $ with ₹ in AI response as a safety net
      const sanitised = responseText.replace(/\$(\d)/g, '₹$1');

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: sanitised,
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error('AI Advisor error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: getPlaceholderResponse(userMessage),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (text) => {
    setInputValue(text);
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="flex flex-col bg-gray-50" style={{ height: '100dvh' }}>
      <Navbar />

      {/* Chat container fills all remaining height below navbar */}
      <div className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="bg-green-600 p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Lumi AI Advisor</h3>
                <p className="text-xs text-green-100 flex items-center">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                  Online • Powered by Gemini 2.0
                </p>
              </div>
            </div>
          </div>

          {/* ── Messages ────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gray-50 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-gray-800 ml-2.5' : 'bg-green-600 mr-2.5'
                  }`}>
                    {msg.role === 'user'
                      ? <UserIcon className="w-4 h-4 text-white" />
                      : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-gray-800 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.text}
                    <div className={`text-xs mt-2 opacity-60 ${msg.role === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none ml-11 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick Prompts ────────────────────────────────────────────── */}
          <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 overflow-x-auto flex space-x-2 shrink-0">
            <button
              onClick={() => handleQuickPrompt(aiAdvisorService.getQuickActionMessage('research'))}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-green-200 text-green-700 rounded-full text-xs hover:bg-green-50 whitespace-nowrap transition-colors"
            >
              <Search className="w-3 h-3" />
              <span>Research Competitors</span>
            </button>
            <button
              onClick={() => handleQuickPrompt(aiAdvisorService.getQuickActionMessage('savings'))}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs hover:bg-gray-100 whitespace-nowrap transition-colors"
            >
              Calculate Savings
            </button>
            <button
              onClick={() => handleQuickPrompt(aiAdvisorService.getQuickActionMessage('issue'))}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs hover:bg-gray-100 whitespace-nowrap transition-colors"
            >
              Report Issue
            </button>
            <button
              onClick={() => handleQuickPrompt('Compare all EaaS plans and recommend the best one for a home in Bengaluru using 400 kWh/month')}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full text-xs hover:bg-gray-100 whitespace-nowrap transition-colors"
            >
              Compare Plans
            </button>
          </div>

          {/* ── Input ────────────────────────────────────────────────────── */}
          <div className="p-4 bg-white border-t border-gray-200 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about plans, savings, or market trends..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:hover:bg-green-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AiAdvisor;
