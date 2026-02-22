// AI Advisor Service — Lumi (Gemini 2.0)
// All currency in ₹. All references to Indian context.

const SYSTEM_PROMPT = `You are Lumi, an expert AI energy advisor for EaaS (Energy-as-a-Service), an Indian solar energy subscription platform.

CRITICAL RULES — follow these in every response without exception:
- Always use ₹ (Indian Rupees) for all currency. NEVER use $ or USD.
- Reference Indian electricity tariffs: ₹5–₹9/kWh depending on state and slab.
- Use Indian cities as examples: Bengaluru, Mumbai, Pune, Hyderabad, Chennai, Delhi.
- Reference Indian DISCOMs: BESCOM (Bengaluru), MSEDCL (Maharashtra), TSSPDCL (Hyderabad), TANGEDCO (Chennai), BSES/BYPL (Delhi).
- Dates in DD MMM YYYY format (e.g. 22 Feb 2026).
- Units: kW, kWh, kg CO₂.

OUR PLANS (use these exact figures always):
| Plan | Monthly | Annual (10% off) | Rate | Hardware |
|------|---------|-----------------|------|----------|
| Solar Starter | ₹1,799/mo | ₹1,619/mo | ₹4.50/kWh | 3kW Solar |
| Hybrid Freedom | ₹2,499/mo | ₹2,249/mo | ₹4.00/kWh | 5kW Solar + 5kWh Battery |
| Grid Independent | ₹3,799/mo | ₹3,419/mo | ₹3.50/kWh | 10kW Solar + 13.5kWh Battery |

CORE VALUE PROPOSITION — mention in every plan discussion:
- ₹0 upfront. Zero hardware cost. Equipment owned and maintained by EaaS.
- Customer NEVER buys hardware. They subscribe to the energy service only.
- Grid backup billed separately at ₹7/kWh (DISCOM rate).

CONTEXT:
- Average Indian home consumes 250–500 kWh/month.
- DISCOM tariffs: BESCOM ₹7.55/kWh (above 200 units), MSEDCL ₹9.95/kWh (above 500 units), TSSPDCL ₹9.50/kWh.
- Net metering available in most Indian states — excess solar exported to grid earns credits.
- Indian solar irradiation: 4.5–6.5 kWh/m²/day (excellent resource).
- PM Surya Ghar Muft Bijli Yojana — government scheme providing subsidies for rooftop solar.

YOUR CAPABILITIES:
1. Plan comparison and recommendation based on user's monthly consumption (kWh) and city.
2. Savings calculation: compare EaaS rate vs local DISCOM tariff.
3. CO₂ offset calculation: 0.82 kg CO₂ per kWh (India grid emission factor).
4. Competitor research: Indian and global EaaS/solar players.
5. Technical issue triage and support ticket guidance.
6. Market research on Indian rooftop solar and EaaS industry trends.

TONE: Professional, warm, helpful. Use markdown formatting for tables and lists. Keep responses concise but complete. Always end with a follow-up question or offer to help further.`;

const QUICK_ACTIONS = {
  research: 'Research and compare EaaS competitors in India and globally. Include companies like Amplus Solar, Cleantech Solar, and any other relevant players.',
  savings: 'Calculate my potential savings with the Hybrid Freedom plan (₹2,499/mo) compared to paying DISCOM tariff in Bengaluru. Assume 400 kWh/month usage.',
  issue: 'I want to report a technical issue with my solar installation. The inverter is showing a fault light.',
};

class AiAdvisorService {
  constructor() {
    this.sessions = new Map(); // userId -> chat history for context
  }

  getQuickActionMessage(action) {
    return QUICK_ACTIONS[action] || '';
  }

  async sendMessage(userId, message, history = []) {
    try {
      // Build conversation history in Gemini format
      const formattedHistory = history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: [
              ...formattedHistory,
              { role: 'user', parts: [{ text: message }] },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Safety net: replace any $ followed by digit with ₹
      text = text.replace(/\$(\d)/g, '₹$1');

      return text || this._fallback(message);
    } catch (error) {
      console.error('AiAdvisorService.sendMessage error:', error);
      return this._fallback(message);
    }
  }

  _fallback(message) {
    const lower = message.toLowerCase();

    if (lower.includes('plan') || lower.includes('price') || lower.includes('cost')) {
      return `Here are our EaaS plans — **₹0 upfront on all plans**:

**Solar Starter** — ₹1,799/mo (₹1,619/mo annual)
- 3kW Solar · ₹4.50/kWh · Basic Support

**Hybrid Freedom** — ₹2,499/mo (₹2,249/mo annual)
- 5kW Solar + 5kWh Battery · ₹4.00/kWh · 24/7 Backup · Priority Support

**Grid Independent** — ₹3,799/mo (₹3,419/mo annual)
- 10kW Solar + 13.5kWh Battery · ₹3.50/kWh · Full grid independence

Grid backup billed at ₹7/kWh (DISCOM rate). All hardware owned and maintained by EaaS — you pay zero upfront and never handle repairs.

Which plan suits your home best?`;
    }

    if (lower.includes('savings') || lower.includes('saving')) {
      return `With the **Hybrid Freedom plan** at ₹4.00/kWh vs Bengaluru BESCOM at ₹7.55/kWh:

- **Saving per kWh**: ₹3.55
- **At 400 kWh/month**: ₹1,420 saved on energy + battery backup value
- **Annual savings**: ~₹17,000–₹24,000
- **CO₂ offset**: ~197 kg CO₂/month (at India grid factor 0.82 kg/kWh)

All this with ₹0 upfront investment. EaaS owns and maintains all equipment.

Want me to calculate for your specific city and usage?`;
    }

    if (lower.includes('competitor') || lower.includes('research')) {
      return `Key EaaS/Solar-as-a-Service players in India and globally:

**India:**
- **Amplus Solar** — largest distributed solar in India, commercial rooftop subscriptions
- **Cleantech Solar** — industrial solar-as-a-service across India & SE Asia
- **Fourth Partner Energy** — rooftop solar PPA for C&I customers

**Global benchmarks:**
- **Sunrun (US)** — residential solar PPA/lease, no upfront cost model
- **Octopus Energy (UK)** — agile tariffs, Kraken platform for distributed energy
- **Tesla Energy** — Powerwall + solar subscription, VPP programs

EaaS differentiates through the full-stack subscription model: solar + battery + monitoring + maintenance in one monthly fee.`;
    }

    return `I'm Lumi, your EaaS AI energy advisor. I can help with:

- **Plan comparison**: Solar Starter ₹1,799/mo · Hybrid Freedom ₹2,499/mo · Grid Independent ₹3,799/mo
- **Savings calculator**: Compare your DISCOM tariff (₹5–₹9/kWh) vs EaaS rates
- **Market research**: Indian and global EaaS competitors
- **Technical support**: Issue reporting and triage
- **CO₂ impact**: Your carbon offset in kg CO₂

All plans — ₹0 upfront, zero hardware cost. What would you like to explore?`;
  }
}

export const aiAdvisorService = new AiAdvisorService();
