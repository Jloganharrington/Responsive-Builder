import { useState, useRef } from "react";
import { Home, CheckCircle, Star, Trophy, Shield, ChevronRight, AlertTriangle } from "lucide-react";

type ProductTier = "ovation" | "carvedwood" | "quest" | null;

interface ColorSwatch {
  name: string;
  hex: string;
  hoaMatch?: "primary" | "possible";
}

const PRODUCTS: Record<string, {
  id: ProductTier;
  badge: string;
  badgeBg: string;
  badgeText: string;
  name: string;
  sub: string;
  thickness: string;
  upgradeLine: string;
  outOfPocket: string;
  totalRCV: string;
  upgradeCost: string;
  features: string[];
  insulationBenefits?: string[];
  link: string;
  badgeIcon: React.ReactNode;
}> = {
  ovation: {
    id: "ovation",
    badge: "COVERED BY INSURANCE — No Upgrade Cost",
    badgeBg: "#6DB33F",
    badgeText: "#FFFFFF",
    name: "Mastic Ovation",
    sub: 'Double 4" | .042" Thickness',
    thickness: '.042"',
    upgradeLine: "Upgrade cost: $0 — fully covered by your State Farm approval",
    outOfPocket: "$0.00",
    totalRCV: "$15,834.14",
    upgradeCost: "$0.00",
    features: [
      "Wind rated: 129 MPH",
      "SNAP+LOCK+HOLD™ Panel Locking System",
      "Hang-Tough™ Technology",
      "SolarDefense Reflective Technology (select colors)",
      '9/16" panel projection',
      "VIP Limited Lifetime Warranty",
    ],
    link: "https://www.plygem.com/mastic/siding/ovation/?varid=double-4",
    badgeIcon: <CheckCircle size={14} />,
  },
  carvedwood: {
    id: "carvedwood",
    badge: "POPULAR UPGRADE — Superior Thickness + Insulation",
    badgeBg: "#E8A020",
    badgeText: "#2A2A2A",
    name: "Mastic Carvedwood•44",
    sub: 'Double 4" | .044" Thickness | Full Back Insulation',
    thickness: '.044"',
    upgradeLine: "+$168.99/sq × 14 sq",
    outOfPocket: "+$2,365.86",
    totalRCV: "$18,200.00",
    upgradeCost: "+$2,365.86",
    features: [
      "Wind rated: 153 MPH",
      '5/8" panel projection — deeper shadow lines than Ovation',
      "T2 Locking System",
      "Hang-Tough™ Technology",
      "VIP Limited Lifetime Warranty",
    ],
    insulationBenefits: [
      "Added R-Value — The continuous foam backing adds meaningful thermal resistance to your exterior wall assembly, reducing heat transfer and improving year-round energy efficiency.",
      "Impact Resistance — The rigid foam backer absorbs impact energy, making the panel significantly more resistant to dents, dings, and hail strikes compared to hollow-back vinyl siding.",
      "Reduced Exterior Noise — The insulation layer dampens sound transmission from wind, rain, and street noise, noticeably quieting the interior of the home.",
    ],
    link: "https://www.plygem.com/mastic/siding/carvedwood-44/?varid=double-4",
    badgeIcon: <Star size={14} />,
  },
  quest: {
    id: "quest",
    badge: "PREMIUM — Maximum Durability & Wind Protection",
    badgeBg: "#2A2A2A",
    badgeText: "#6DB33F",
    name: "Mastic Quest",
    sub: 'Double 4" | .046" Thickness | Full Back Insulation',
    thickness: '.046"',
    upgradeLine: "+$318.99/sq × 14 sq",
    outOfPocket: "+$4,465.86",
    totalRCV: "$20,300.00",
    upgradeCost: "+$4,465.86",
    features: [
      "Wind rated: 163 MPH — highest in the Mastic lineup",
      '3/4" panel projection — deepest shadow line available',
      "Patented T3-Lok® panel system — tightens under pressure",
      "Double-thick nail hem",
      "Hang-Tough™ Technology",
      "VIP Limited Lifetime Warranty",
    ],
    insulationBenefits: [
      "Added R-Value — The continuous foam backing adds meaningful thermal resistance to your exterior wall assembly, reducing heat transfer and improving year-round energy efficiency.",
      "Impact Resistance — The rigid foam backer absorbs impact energy, making the panel significantly more resistant to dents, dings, and hail strikes compared to hollow-back vinyl siding.",
      "Reduced Exterior Noise — The insulation layer dampens sound transmission from wind, rain, and street noise, noticeably quieting the interior of the home.",
    ],
    link: "https://www.plygem.com/mastic/siding/quest/?varid=double-4",
    badgeIcon: <Trophy size={14} />,
  },
};

const ALL_COLORS: Record<string, ColorSwatch[]> = {
  light: [
    { name: "White", hex: "#F5F5F0" },
    { name: "Almond", hex: "#EFDFCC" },
    { name: "Cameo", hex: "#E8D5B7" },
    { name: "Classic Cream", hex: "#F2E6C9" },
    { name: "Colonial Yellow", hex: "#E8D08A" },
    { name: "Desert Sand", hex: "#C9B99A", hoaMatch: "primary" },
    { name: "Linen", hex: "#E8DCC8" },
    { name: "Sage", hex: "#B8C4A8" },
    { name: "Sandtone", hex: "#C4B49A", hoaMatch: "primary" },
    { name: "Silver Grey", hex: "#B8BDB8" },
    { name: "Tuscan Olive", hex: "#8B9068" },
    { name: "Victorian Grey", hex: "#A8A898", hoaMatch: "possible" },
    { name: "Wicker", hex: "#C8B888" },
  ],
  classic: [
    { name: "Corn Silk", hex: "#DDD4A0" },
    { name: "Everest", hex: "#D4CCB8" },
    { name: "Harbor Grey", hex: "#909890" },
    { name: "Pebblestone Clay", hex: "#C0AA8A", hoaMatch: "primary" },
    { name: "Scottish Thistle", hex: "#B8A8C0" },
  ],
  deep: [
    { name: "Deep Granite", hex: "#484840" },
    { name: "English Wedgewood", hex: "#6878A0" },
    { name: "Misty Shadow", hex: "#8898A8" },
    { name: "Montana Suede", hex: "#907860" },
    { name: "Quiet Willow", hex: "#687860" },
    { name: "Rugged Canyon", hex: "#906848" },
    { name: "Vintage Dublin", hex: "#587048" },
    { name: "Autumn Harvest", hex: "#B87830" },
    { name: "Bayou", hex: "#485848" },
    { name: "Brunswick", hex: "#385040" },
    { name: "Lakeshore Fern", hex: "#506858" },
    { name: "Modern Iron", hex: "#586068" },
    { name: "Portsmouth Blue", hex: "#405870" },
    { name: "Russet Red", hex: "#884030" },
  ],
  solar: [
    { name: "Natural Slate", hex: "#787870" },
    { name: "Newport Bay", hex: "#485870" },
    { name: "Brandy Wood", hex: "#784830" },
    { name: "Red Brick", hex: "#883028" },
    { name: "Alpine Forest", hex: "#304830" },
    { name: "Deep Cavern", hex: "#383028" },
    { name: "Rock Harbor", hex: "#484038" },
    { name: "Whispering Timber", hex: "#786848" },
    { name: "Woodland Retreat", hex: "#485038" },
  ],
  cedar: [
    { name: "Cape Grey", hex: "#909888" },
    { name: "Walnut", hex: "#705040" },
    { name: "Cedar", hex: "#906848" },
    { name: "Timber", hex: "#806040" },
    { name: "Glacier Blue", hex: "#788898" },
    { name: "Woodland Green", hex: "#506048" },
  ],
};

const PRODUCT_COLORS: Record<string, Record<string, string[]>> = {
  ovation: {
    light: ["White", "Almond", "Cameo", "Classic Cream", "Desert Sand", "Linen", "Sage", "Sandtone", "Silver Grey", "Tuscan Olive", "Victorian Grey", "Wicker"],
    classic: ["Corn Silk", "Everest", "Harbor Grey", "Pebblestone Clay", "Scottish Thistle"],
    deep: ["Deep Granite", "English Wedgewood", "Misty Shadow", "Montana Suede", "Quiet Willow", "Rugged Canyon", "Vintage Dublin"],
    solar: ["Brandy Wood", "Natural Slate", "Newport Bay", "Red Brick"],
  },
  carvedwood: {
    light: ["White", "Almond", "Cameo", "Classic Cream", "Colonial Yellow", "Desert Sand", "Linen", "Sage", "Sandtone", "Silver Grey", "Tuscan Olive", "Victorian Grey", "Wicker"],
    classic: ["Corn Silk", "Everest", "Harbor Grey", "Pebblestone Clay", "Scottish Thistle"],
    deep: ["Autumn Harvest", "Bayou", "Brunswick", "Deep Granite", "English Wedgewood", "Lakeshore Fern", "Misty Shadow", "Modern Iron", "Montana Suede", "Quiet Willow", "Rugged Canyon", "Russet Red", "Vintage Dublin"],
    solar: ["Alpine Forest", "Brandy Wood", "Deep Cavern", "Natural Slate", "Newport Bay", "Red Brick", "Rock Harbor", "Whispering Timber", "Woodland Retreat"],
  },
  quest: {
    light: ["White", "Almond", "Cameo", "Classic Cream", "Colonial Yellow", "Desert Sand", "Linen", "Sage", "Sandtone", "Silver Grey", "Tuscan Olive", "Victorian Grey", "Wicker"],
    classic: ["Corn Silk", "Everest", "Harbor Grey", "Pebblestone Clay", "Scottish Thistle"],
    deep: ["Autumn Harvest", "Deep Granite", "English Wedgewood", "Lakeshore Fern", "Misty Shadow", "Montana Suede", "Portsmouth Blue", "Quiet Willow", "Rugged Canyon", "Russet Red"],
    cedar: ["Cape Grey", "Walnut", "Cedar", "Timber", "Glacier Blue", "Woodland Green"],
  },
};

function getFilteredColors(product: ProductTier): Record<string, ColorSwatch[]> {
  if (!product) return {};
  const allowed = PRODUCT_COLORS[product];
  const result: Record<string, ColorSwatch[]> = {};
  for (const [group, names] of Object.entries(allowed)) {
    const groupColors = ALL_COLORS[group] ?? [];
    result[group] = groupColors.filter(c => names.includes(c.name));
  }
  return result;
}

const GROUP_LABELS: Record<string, string> = {
  light: "Light",
  classic: "Classic",
  deep: "Deep",
  solar: "Solar Defense",
  cedar: "Cedar Colors",
};

function isDarkHex(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export default function Portal() {
  const [selectedProduct, setSelectedProduct] = useState<ProductTier>(null);
  const [selectedColor, setSelectedColor] = useState<ColorSwatch | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const colorSectionRef = useRef<HTMLDivElement>(null);

  const product = selectedProduct ? PRODUCTS[selectedProduct] : null;
  const filteredColors = getFilteredColors(selectedProduct);

  function handleSelectProduct(tier: ProductTier) {
    setSelectedProduct(tier);
    setSelectedColor(null);
    setTimeout(() => {
      colorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = {
      name: "Daniel Gunn",
      property: "8505 Enochs Dr, Lorton, VA 22079",
      claim: "4695G528D",
      product: product ? `${product.name} — ${product.sub}` : "—",
      color: selectedColor?.name ?? "—",
      notes,
    };
    console.log("NuHome Selection Submission:", formData);
    setSubmitted(true);
  }

  return (
    <div style={{ backgroundColor: "#F7F8F5", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* HEADER */}
      <header style={{ backgroundColor: "#6DB33F", padding: "16px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <Home size={22} color="#fff" />
              <span style={{ color: "#fff", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>
                NuHome Exteriors
              </span>
            </div>
          </div>
          <span style={{ color: "rgba(255,255,255,0.80)", fontSize: 12, fontWeight: 400, marginLeft: 4 }}>
            Licensed · Bonded · Insured | VA #2705-064938A
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px 60px" }}>
        {/* HERO */}
        <section style={{ paddingTop: 36, paddingBottom: 32 }}>
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #D4E8C2",
            borderLeft: "5px solid #6DB33F",
            borderRadius: 10,
            padding: "28px 32px",
            marginBottom: 24,
            boxShadow: "0 2px 8px rgba(109,179,63,0.08)",
          }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#2A2A2A", marginBottom: 10, fontFamily: "'Playfair Display', serif" }} data-testid="heading-welcome">
              Welcome, Daniel. Your siding replacement has been fully approved.
            </h1>
            <p style={{ color: "#3D3D3D", lineHeight: 1.7, fontSize: 15, marginBottom: 0 }}>
              Your claim with <strong>State Farm (Claim #4695G528D)</strong> has been approved. Below are your product and color selections — your base option is <strong>fully covered by insurance</strong>, with premium upgrades available at your cost.
            </p>
          </div>

          {/* Financial Summary Bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}>
            {[
              { label: "Insurance-Approved RCV", value: "$15,834.14" },
              { label: "Deductible", value: "$2,000.00" },
              { label: "ACV Payment Issued", value: "$9,522.38" },
              { label: "Recoverable Depreciation", value: "$1,022.14" },
              { label: "Project Size", value: "14 Squares (1,400 SF) — All 4 Elevations" },
            ].map((item) => (
              <div key={item.label} style={{
                backgroundColor: "#fff",
                border: "1px solid #D4E8C2",
                borderRadius: 8,
                padding: "16px 18px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }} data-testid={`stat-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#2A2A2A" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Property Card */}
          <div style={{
            backgroundColor: "#EEEEEE",
            border: "1px solid #D4D4D4",
            borderRadius: 10,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}>
            <div style={{
              width: 56,
              height: 56,
              backgroundColor: "#D4E8C2",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <Home size={28} color="#6DB33F" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6B6B6B", marginBottom: 2 }}>Your Home</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#2A2A2A" }}>8505 Enochs Dr, Lorton VA</div>
              <div style={{ fontSize: 13, color: "#6B6B6B" }}>Project: Full Siding Replacement — 14 Squares, All 4 Elevations</div>
            </div>
          </div>
        </section>

        {/* PRODUCT TIER SELECTION */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2A2A2A", marginBottom: 6, fontFamily: "'Playfair Display', serif" }}>
            Select Your Siding Product
          </h2>
          <p style={{ color: "#6B6B6B", fontSize: 14, marginBottom: 24 }}>
            Choose from three tiers below. Your base option (Card 1) is fully covered — upgrades are at your out-of-pocket cost.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}>
            {(["ovation", "carvedwood", "quest"] as ProductTier[]).map((tierId) => {
              const tier = PRODUCTS[tierId!];
              const isSelected = selectedProduct === tierId;
              return (
                <div
                  key={tierId}
                  data-testid={`card-product-${tierId}`}
                  style={{
                    backgroundColor: "#fff",
                    border: `2px solid ${isSelected ? "#6DB33F" : "#D4E8C2"}`,
                    borderRadius: 12,
                    padding: "24px",
                    boxShadow: isSelected
                      ? "0 4px 16px rgba(109,179,63,0.18)"
                      : "0 2px 8px rgba(0,0,0,0.05)",
                    position: "relative",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    cursor: "default",
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: "absolute",
                      top: -12,
                      right: -12,
                      backgroundColor: "#6DB33F",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(109,179,63,0.4)",
                    }}>
                      <CheckCircle size={18} color="#fff" />
                    </div>
                  )}

                  {/* Badge */}
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: tier.badgeBg,
                    color: tier.badgeText,
                    borderRadius: 6,
                    padding: "5px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    marginBottom: 16,
                  }} data-testid={`badge-${tierId}`}>
                    {tier.badgeIcon}
                    {tier.badge}
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2A2A2A", marginBottom: 4 }}>{tier.name}</h3>
                  <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 16 }}>{tier.sub}</p>

                  {/* Pricing */}
                  <div style={{
                    backgroundColor: "#F7F8F5",
                    borderRadius: 8,
                    padding: "14px 16px",
                    marginBottom: 18,
                    borderLeft: "3px solid #6DB33F",
                  }}>
                    <div style={{ fontSize: 13, color: "#3D3D3D", marginBottom: 4 }}>
                      {tierId === "ovation" ? (
                        <>Upgrade cost: <strong style={{ color: "#6DB33F" }}>$0 — fully covered by your State Farm approval</strong></>
                      ) : (
                        <>Upgrade: <strong>{tier.upgradeLine}</strong></>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "#3D3D3D", marginBottom: 4 }}>
                      Your out-of-pocket upgrade: <strong>{tier.outOfPocket}</strong>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2A2A" }}>
                      Total Project RCV: {tier.totalRCV}
                    </div>
                  </div>

                  {/* Features */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                    {tier.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#3D3D3D", marginBottom: 6 }}>
                        <ChevronRight size={14} color="#6DB33F" style={{ flexShrink: 0, marginTop: 2 }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Insulation Benefits */}
                  {tier.insulationBenefits && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#6DB33F",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        paddingTop: 12,
                        paddingBottom: 8,
                        borderTop: "1px solid #D4E8C2",
                        marginBottom: 10,
                      }}>
                        Full Back Insulation Benefits
                      </div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {tier.insulationBenefits.map((b) => (
                          <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#3D3D3D", marginBottom: 8, lineHeight: 1.5 }}>
                            <ChevronRight size={14} color="#6DB33F" style={{ flexShrink: 0, marginTop: 2 }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <a
                    href={tier.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: 12, color: "#6DB33F", fontWeight: 600, display: "block", marginBottom: 16, textDecoration: "none" }}
                    data-testid={`link-product-${tierId}`}
                  >
                    View Product on Mastic.com ↗
                  </a>

                  <button
                    onClick={() => handleSelectProduct(tierId)}
                    data-testid={`button-select-${tierId}`}
                    style={{
                      width: "100%",
                      backgroundColor: isSelected ? "#4E8C2A" : "#6DB33F",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "12px 20px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#4E8C2A")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = isSelected ? "#4E8C2A" : "#6DB33F")}
                  >
                    {isSelected ? <><CheckCircle size={16} /> Selected</> : "Select This Option"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* COLOR SELECTION */}
        <section ref={colorSectionRef} style={{ marginBottom: 40 }} data-testid="section-color">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2A2A2A", marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>
            Choose Your Color
          </h2>
          {selectedProduct ? (
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 20 }}>
              Showing colors available for: <strong style={{ color: "#3D3D3D" }}>{product?.name}</strong>
            </p>
          ) : (
            <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 20 }}>
              Select a product above to view available colors.
            </p>
          )}

          {/* HOA Advisory Banner */}
          <div style={{
            backgroundColor: "#E8A020",
            border: "1px solid #D4880A",
            borderLeft: "4px solid #2A2A2A",
            borderRadius: 8,
            padding: "16px 20px",
            marginBottom: 28,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
          }} data-testid="banner-hoa">
            <AlertTriangle size={20} color="#2A2A2A" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2A2A", marginBottom: 6 }}>
                HOA COLOR MATCH ADVISORY
              </div>
              <div style={{ fontSize: 13, color: "#2A2A2A", lineHeight: 1.6 }}>
                Your existing siding is aluminum in a warm beige/greige tone. To maintain HOA compliance, we strongly recommend selecting a color close to your current exterior. Colors marked <strong>★ HOA Match</strong> below are the closest available matches across all product lines.
              </div>
            </div>
          </div>

          {!selectedProduct && (
            <div style={{
              backgroundColor: "#fff",
              border: "2px dashed #D4E8C2",
              borderRadius: 10,
              padding: "40px 24px",
              textAlign: "center",
              color: "#6B6B6B",
              fontSize: 15,
            }}>
              <Home size={36} color="#D4E8C2" style={{ margin: "0 auto 12px" }} />
              Select a product above to load its available color palette.
            </div>
          )}

          {selectedProduct && (
            <div>
              {Object.entries(filteredColors).map(([group, swatches]) => (
                swatches.length > 0 && (
                  <div key={group} style={{ marginBottom: 32 }}>
                    <div style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#6B6B6B",
                      marginBottom: 14,
                      paddingBottom: 8,
                      borderBottom: "1px solid #D4E8C2",
                    }}>
                      {GROUP_LABELS[group] ?? group}
                      {group === "cedar" && (
                        <span style={{ fontSize: 10, color: "#E8A020", marginLeft: 8, fontWeight: 600 }}>Quest Only</span>
                      )}
                    </div>
                    <div className="swatch-grid">
                      {swatches.map((swatch) => {
                        const isSelected = selectedColor?.name === swatch.name;
                        const isDark = isDarkHex(swatch.hex);
                        return (
                          <div
                            key={swatch.name}
                            onClick={() => setSelectedColor(swatch)}
                            data-testid={`swatch-${swatch.name.toLowerCase().replace(/\s+/g, '-')}`}
                            style={{
                              position: "relative",
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                          >
                            <div style={{
                              width: "100%",
                              aspectRatio: "1",
                              backgroundColor: swatch.hex,
                              borderRadius: 8,
                              border: isSelected ? "3px solid #6DB33F" : "2px solid #D4D4D4",
                              boxShadow: isSelected ? "0 0 0 2px #6DB33F33" : "none",
                              transition: "border-color 0.15s",
                              position: "relative",
                              overflow: "visible",
                            }}>
                              {isSelected && (
                                <div style={{
                                  position: "absolute",
                                  bottom: -8,
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  backgroundColor: "#6DB33F",
                                  borderRadius: "50%",
                                  width: 18,
                                  height: 18,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  zIndex: 2,
                                }}>
                                  <CheckCircle size={12} color="#fff" />
                                </div>
                              )}
                              {swatch.hoaMatch && (
                                <div style={{
                                  position: "absolute",
                                  top: -6,
                                  right: -6,
                                  backgroundColor: "#E8A020",
                                  borderRadius: "50%",
                                  width: 18,
                                  height: 18,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#fff",
                                  zIndex: 3,
                                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                }}>
                                  ★
                                </div>
                              )}
                            </div>
                            <div style={{ fontSize: 10, color: "#3D3D3D", marginTop: 10, fontWeight: 500, lineHeight: 1.3 }}>
                              {swatch.name}
                            </div>
                            {swatch.hoaMatch === "primary" && (
                              <div style={{ fontSize: 9, color: "#E8A020", fontWeight: 700, marginTop: 1 }}>★ HOA Match</div>
                            )}
                            {swatch.hoaMatch === "possible" && (
                              <div style={{ fontSize: 9, color: "#E8A020", fontWeight: 700, marginTop: 1 }}>★ Possible Match</div>
                            )}
                            {swatch.hoaMatch === "possible" && (
                              <div style={{ fontSize: 9, color: "#6B6B6B", marginTop: 1 }}>Cooler tone</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </section>

        {/* LIVE SUMMARY + SUBMISSION */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#2A2A2A", marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>
            Your Current Selection
          </h2>

          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #D4E8C2",
            borderLeft: "5px solid #6DB33F",
            borderRadius: 10,
            padding: "24px 28px",
            marginBottom: 28,
            boxShadow: "0 2px 8px rgba(109,179,63,0.08)",
          }} data-testid="summary-card">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "12px 24px",
            }}>
              {[
                { label: "Property", value: "8505 Enochs Dr, Lorton, VA 22079" },
                { label: "Claim #", value: "4695G528D" },
                { label: "Product", value: product ? product.name : "—", testId: "summary-product" },
                { label: "Thickness", value: product ? product.thickness : "—", testId: "summary-thickness" },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#2A2A2A" }} data-testid={item.testId ?? undefined}>
                    {item.value}
                  </div>
                </div>
              ))}

              {/* Color row */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Color</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {selectedColor && (
                    <div style={{
                      width: 30,
                      height: 30,
                      backgroundColor: selectedColor.hex,
                      borderRadius: 4,
                      border: "1px solid #D4D4D4",
                      flexShrink: 0,
                    }} data-testid="summary-color-preview" />
                  )}
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#2A2A2A" }} data-testid="summary-color-name">
                    {selectedColor?.name ?? "—"}
                  </span>
                </div>
              </div>

              {/* Financial summary */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                  Insurance Covers
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#6DB33F" }}>$15,834.14</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                  Your Upgrade Cost
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#2A2A2A" }} data-testid="summary-upgrade-cost">
                  {product ? product.upgradeCost : "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
                  Total Project RCV
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#2A2A2A" }} data-testid="summary-total-rcv">
                  {product ? product.totalRCV : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} style={{
              backgroundColor: "#fff",
              border: "1px solid #D4E8C2",
              borderRadius: 10,
              padding: "28px 32px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#2A2A2A", marginBottom: 20, fontFamily: "'Playfair Display', serif" }}>
                Submit Your Selection to NuHome
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px 24px", marginBottom: 20 }}>
                {[
                  { label: "Name", value: "Daniel Gunn", id: "name" },
                  { label: "Property", value: "8505 Enochs Dr, Lorton, VA 22079", id: "property" },
                  { label: "Claim #", value: "4695G528D", id: "claim" },
                  { label: "Selected Product", value: product ? `${product.name} — ${product.sub}` : "—", id: "product" },
                  { label: "Selected Color", value: selectedColor?.name ?? "—", id: "color" },
                ].map(field => (
                  <div key={field.id}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6B6B", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {field.label}
                    </label>
                    <input
                      readOnly
                      value={field.value}
                      data-testid={`input-${field.id}`}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        backgroundColor: "#F7F8F5",
                        border: "1px solid #D4E8C2",
                        borderRadius: 6,
                        fontSize: 14,
                        color: "#3D3D3D",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B6B6B", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Notes / Questions
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any questions or notes for your NuHome coordinator..."
                  rows={4}
                  data-testid="input-notes"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #D4E8C2",
                    borderRadius: 6,
                    fontSize: 14,
                    color: "#3D3D3D",
                    resize: "vertical",
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                data-testid="button-submit"
                style={{
                  backgroundColor: "#6DB33F",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "14px 32px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#4E8C2A")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#6DB33F")}
              >
                <Shield size={18} />
                Send My Selection to NuHome
              </button>
            </form>
          ) : (
            <div style={{
              backgroundColor: "#F0F9E8",
              border: "2px solid #6DB33F",
              borderRadius: 10,
              padding: "28px 32px",
              textAlign: "center",
            }} data-testid="confirmation-message">
              <CheckCircle size={40} color="#6DB33F" style={{ margin: "0 auto 14px" }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: "#2A2A2A", marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>
                Your selection has been received.
              </div>
              <p style={{ fontSize: 14, color: "#3D3D3D" }}>
                ✓ The NuHome team will confirm your choices on your next call.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: "#2A2A2A",
        padding: "32px 24px",
        color: "#fff",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#6DB33F", marginBottom: 8 }}>NuHome Exteriors, Inc.</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.8 }}>
                VA Lic. #2705-064938A | MD MHIC #05-122697<br />
                (866) 684-6631 | www.nuhomeonline.com
              </div>
            </div>
            <div style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.75)",
              maxWidth: 340,
              lineHeight: 1.7,
            }}>
              Questions about your claim or selections? Contact your NuHome project coordinator.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
