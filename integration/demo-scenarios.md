# Demo Scenarios

Three prepared scenarios to show off FixIt Bot's capabilities during the demo.

---

## Scenario 1: Simple Text Query (Leaky Faucet)

**Purpose:** Shows basic text conversation and structured diagnosis.

**Prompt:**
> My kitchen faucet won't stop dripping. It's a single-handle type and it drips about once per second. I've had it for about 5 years.

**Expected response covers:**
- Identifies as plumbing / minor severity
- Suggests worn cartridge or O-ring
- Step-by-step DIY fix
- Cost: ~$8-15 DIY, $75-150 pro

**Follow-up:**
> What tools do I need? I'm a total beginner.

---

## Scenario 2: Photo Upload (Water Damage)

**Purpose:** Shows Claude's vision capability analyzing a photo.

**Setup:** Have a photo ready of water-stained ceiling, cracked tile, or similar visible damage.

**Prompt:**
> [Upload photo] I noticed this today — is this serious?

**Expected response covers:**
- Describes what it sees in the photo
- Identifies the type of damage
- Assesses severity
- Immediate steps to take
- Whether a pro is needed

---

## Scenario 3: Safety Warning (Electrical)

**Purpose:** Shows the safety-first behavior — bot recommends a professional.

**Prompt:**
> I see sparks and hear a buzzing sound when I plug things into my kitchen outlet. Sometimes the lights flicker too. Can I fix this myself?

**Expected response covers:**
- Identifies as electrical / high or critical severity
- Strong safety warning
- Tells user NOT to use the outlet
- Recommends licensed electrician
- Explains potential dangers (fire risk, shock)

---

## Demo Flow

1. Start with **Scenario 1** — shows the basic chat working
2. Do the **follow-up question** — shows conversation memory
3. Switch to **Scenario 2** — shows photo upload and vision
4. End with **Scenario 3** — shows responsible safety advice

Total demo time: ~3-5 minutes
