export const routes = {
  HOME: "/",
  PATIENTS: "/patients",
  PATIENT_DETAIL: "/patients/:id",
  RECOMMENDATIONS: "/recommendations",
  REPORTS: "/reports",
  DOCUMENTATION: "/documentation",
  API_REFERENCE: "/api-reference",
  RESEARCH_PAPERS: "/research",
  SUPPORT: "/support",
  PRIVACY: "/privacy",
  TERMS: "/terms",
};

export type RouteKey = keyof typeof routes;
