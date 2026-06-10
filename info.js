// ─── Project / Brand Info ─────────────────────────────────────────────────────
// Edit this file for each project. Everything here is project-specific.

export const info = {
  legalName: "SGAIJE",
  companyName: "SGAIJE",
  description: "Accesorios deportivos de alta calidad",

  email: {
    sender: "",
    recipients: [""],
    subject: "Nuevo prospecto",
  },

  phoneNumber: "+523312307883",

  whatsapp: {
    value: "+523312307883",
    message: "Hola, me interesa conocer más información",
  },

  social: {
    facebook: "",
    instagram: "",
  },

  address: {
    address: "",
    col: "",
    cp: "",
    city: "",
    state: "",
  },

  // n8n or any POST webhook that receives the lead
  optInWebhook: process.env.NODE_ENV === 'dev' ? "https://n8n.notoriovs.com/webhook-test/b9267850-69b1-4d6f-92a8-1c4b68acc51f" : "https://n8n.notoriovs.com/webhook/b9267850-69b1-4d6f-92a8-1c4b68acc51f",
  surveyWebhook: "",

  // Where to redirect after survey completion (leave empty to use /thankyou)
  surveyRedirect: "",

  privacyNotice: "/aviso-privacidad",
  termsConditions: "/aviso-privacidad",

  // Optional: promo bar text shown at the top of each page (set null to hide)
  promoBar: null,
};
