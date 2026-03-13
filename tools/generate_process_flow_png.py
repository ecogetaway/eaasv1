from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


def load_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_wrapped_text(draw, text, box, font, fill, line_gap=4):
    x1, y1, x2, y2 = box
    max_width = x2 - x1 - 20
    words = text.split()
    lines = []
    current = []
    for word in words:
        trial = " ".join(current + [word])
        width = draw.textlength(trial, font=font)
        if width <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))

    y = y1 + 12
    for line in lines:
        if y > y2 - 20:
            break
        draw.text((x1 + 10, y), line, font=font, fill=fill)
        y += font.size + line_gap


def draw_box(draw, box, title, body, title_font, body_font, fill, outline, title_fill="#0b1220"):
    draw.rounded_rectangle(box, radius=16, fill=fill, outline=outline, width=3)
    x1, y1, x2, y2 = box
    draw.text((x1 + 12, y1 + 10), title, font=title_font, fill=title_fill)
    draw.line((x1 + 10, y1 + 44, x2 - 10, y1 + 44), fill=outline, width=2)
    draw_wrapped_text(draw, body, (x1 + 2, y1 + 48, x2 - 4, y2 - 6), body_font, fill="#1f2937")


def draw_arrow(draw, start, end, color="#334155", width=4):
    sx, sy = start
    ex, ey = end
    draw.line((sx, sy, ex, ey), fill=color, width=width)
    dx, dy = ex - sx, ey - sy
    length = max((dx * dx + dy * dy) ** 0.5, 1)
    ux, uy = dx / length, dy / length
    px, py = -uy, ux
    arrow_size = 12
    p1 = (ex, ey)
    p2 = (ex - ux * arrow_size - px * 6, ey - uy * arrow_size - py * 6)
    p3 = (ex - ux * arrow_size + px * 6, ey - uy * arrow_size + py * 6)
    draw.polygon([p1, p2, p3], fill=color)


def main():
    width, height = 2400, 1600
    image = Image.new("RGB", (width, height), "#f8fafc")
    draw = ImageDraw.Draw(image)

    title_font = load_font(52, bold=True)
    section_font = load_font(34, bold=True)
    box_title_font = load_font(24, bold=True)
    body_font = load_font(20)
    small_font = load_font(18)

    draw.text((60, 40), "EaaS Plus v1 — Process Flow / Use Case Diagram", font=title_font, fill="#0f172a")
    draw.text(
        (60, 105),
        "Separate deployments: Consumer App (eaasv1.netlify.app) and Operator Portal (intellismart-admin.netlify.app)",
        font=small_font,
        fill="#334155",
    )

    # Consumer section background
    consumer_bg = (40, 160, 1160, 1520)
    admin_bg = (1240, 160, 2360, 1520)
    draw.rounded_rectangle(consumer_bg, radius=24, fill="#ecfeff", outline="#06b6d4", width=3)
    draw.rounded_rectangle(admin_bg, radius=24, fill="#ecfdf5", outline="#22c55e", width=3)
    draw.text((70, 185), "Consumer App Flow", font=section_font, fill="#0e7490")
    draw.text((1270, 185), "Operator Portal Flow", font=section_font, fill="#15803d")

    # Consumer boxes
    c1 = (80, 250, 1120, 390)
    c2 = (80, 440, 1120, 600)
    c3 = (80, 650, 1120, 810)
    c4 = (80, 860, 1120, 1110)
    c5 = (80, 1160, 1120, 1450)

    draw_box(
        draw,
        c1,
        "1) Discover & Explore",
        "User visits eaasv1.netlify.app, reviews 'How It Works', compares plan cards "
        "(Solar Starter / Hybrid Freedom / Grid Independent), and sees ₹0 upfront value proposition.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#67e8f9",
    )
    draw_box(
        draw,
        c2,
        "2) Subscribe + Onboard",
        "Click 'Subscribe Now' -> 3-step flow: (a) confirm selected plan + ₹0 upfront summary, "
        "(b) enter customer details (name/address/city/phone/consumer number), "
        "(c) success with order confirmation.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#67e8f9",
    )
    draw_box(
        draw,
        c3,
        "3) Login + Energy Dashboard",
        "Login (demo@eaas.com / demo123). Dashboard shows live energy tiles "
        "(solar generation, battery status, grid import/export, net metering) + real-time trend updates and savings.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#67e8f9",
    )
    draw_box(
        draw,
        c4,
        "4) Ongoing Engagement",
        "Core modules: Billing (history + Pay Now), Lumi AI (usage Q&A), Services (upgrade + savings calculator), "
        "DISCOM (net-metering credits), Support (tickets/FAQ), Subscription (pause/upgrade/cancel), Settings.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#67e8f9",
    )
    draw_box(
        draw,
        c5,
        "Consumer Outcome",
        "Lower electricity cost, predictable subscription experience, transparent energy visibility, "
        "and continuous digital engagement that improves retention and plan adoption.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#67e8f9",
    )

    # Admin boxes
    a1 = (1280, 250, 2320, 390)
    a2 = (1280, 440, 2320, 600)
    a3 = (1280, 650, 2320, 810)
    a4 = (1280, 860, 2320, 1110)
    a5 = (1280, 1160, 2320, 1450)

    draw_box(
        draw,
        a1,
        "1) Secure Access",
        "Representative opens intellismart-admin.netlify.app and signs in "
        "(admin@intellismart.in / admin123 prototype auth).",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#86efac",
    )
    draw_box(
        draw,
        a2,
        "2) National Overview",
        "Overview tab surfaces KPI snapshot: meter base, active meters, EaaS-eligible users, "
        "and state-level operational health.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#86efac",
    )
    draw_box(
        draw,
        a3,
        "3) Intelligence Tabs",
        "Anomaly Alerts, CBQoS & AMI 2.0, Revenue Opportunity, Deployment Readiness, "
        "Demand & Response — built for operational decisions.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#86efac",
    )
    draw_box(
        draw,
        a4,
        "4) Action Loop",
        "Prioritize rollout zones, flag high-risk meters, plan demand-response events, "
        "and tune consumer conversion strategy using observed behavior and network data.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#86efac",
    )
    draw_box(
        draw,
        a5,
        "Operator Outcome",
        "Data-backed rollout execution, improved grid reliability and loss control, "
        "and measurable revenue opportunity from targeted EaaS adoption.",
        box_title_font,
        body_font,
        fill="#ffffff",
        outline="#86efac",
    )

    # Vertical arrows
    for top, bottom in [(c1, c2), (c2, c3), (c3, c4), (c4, c5)]:
        draw_arrow(draw, ((top[0] + top[2]) // 2, top[3] + 10), ((bottom[0] + bottom[2]) // 2, bottom[1] - 10), color="#0891b2")
    for top, bottom in [(a1, a2), (a2, a3), (a3, a4), (a4, a5)]:
        draw_arrow(draw, ((top[0] + top[2]) // 2, top[3] + 10), ((bottom[0] + bottom[2]) // 2, bottom[1] - 10), color="#16a34a")

    # Cross-flow connectors
    draw_arrow(draw, (1120, 730), (1280, 730), color="#7c3aed", width=5)
    draw_arrow(draw, (1280, 980), (1120, 980), color="#7c3aed", width=5)
    draw.text((1138, 680), "Consumer usage telemetry", font=small_font, fill="#6d28d9")
    draw.text((1140, 1000), "Operator actions -> better consumer outcomes", font=small_font, fill="#6d28d9")

    # Footer note
    draw.rounded_rectangle((60, 1490, 2340, 1560), radius=12, fill="#e2e8f0", outline="#94a3b8", width=2)
    draw.text(
        (80, 1512),
        "Architecture: Separate frontend deployments for consumer and operator portals; shared data domain behind secured service/proxy layers.",
        font=small_font,
        fill="#0f172a",
    )

    output = Path("/Users/sanjay/eaasv1/EAAS-Process-Flow-Diagram.png")
    image.save(output, format="PNG")
    print(str(output))


if __name__ == "__main__":
    main()
