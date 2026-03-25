import CookieUsage from "@/components/cookies-policy/CookieUsage";
import { Hero } from "../../components/cookies-policy/Hero";
import { CookiePolicyIntro } from "../../components/cookies-policy/Intro";
import { CookiePolicyNav } from "../../components/cookies-policy/NavBar";
import { TypesOfCookies } from "../../components/cookies-policy/Types";
import ThirdPartyCookies from "@/components/cookies-policy/ThirdPartyCookie";
import CookieManagement from "@/components/cookies-policy/CookieManagement";
import OtherTracking from "@/components/cookies-policy/OtherTracking";
import { CookieContact } from "@/components/cookies-policy/CookieContact";
import { AdditionalResources } from "@/components/cookies-policy/AdditionalResources";

export default function CookiesPolicyPage() 
    {
        return (
            <>
            <Hero />
            <CookiePolicyNav />
            <CookiePolicyIntro />
            <TypesOfCookies />
            <CookieUsage />
            <ThirdPartyCookies />
            <CookieManagement />
            <OtherTracking />
            <CookieContact />
            <AdditionalResources />
            </>
        )
    }
