import { prisma } from '@/lib/prisma';
export type SiteSettings={resumeVisible:boolean;resumeUrl:string|null;adminEmail:string};
export const defaultSiteSettings:SiteSettings={resumeVisible:false,resumeUrl:null,adminEmail:'sarthak_tallamraju@mymail.sutd.edu.sg'};
export async function getSiteSettings():Promise<SiteSettings>{if(!process.env.DATABASE_URL)return defaultSiteSettings;try{const row=await prisma.siteSettings.findUnique({where:{id:'singleton'}});return row?{resumeVisible:row.resumeVisible,resumeUrl:row.resumeUrl,adminEmail:row.adminEmail}:defaultSiteSettings}catch{return defaultSiteSettings}}
