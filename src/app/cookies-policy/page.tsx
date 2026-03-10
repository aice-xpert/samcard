import { Hero } from "../../components/cookies-policy/Hero";
import { CookiePolicyIntro } from "../../components/cookies-policy/Intro";
import { CookiePolicyNav } from "../../components/cookies-policy/NavBar";
import { TypesOfCookies } from "../../components/cookies-policy/Types";

export default function CookiesPolicyPage() 
    {
        return (
            <>
            <Hero />
            <CookiePolicyNav />
            <CookiePolicyIntro />
            <TypesOfCookies />
            </>
        )
    }
