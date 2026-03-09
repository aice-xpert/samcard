import PrivacyPolicyPage from "@/components/privacy-policy/Content";
import  {Hero}  from "@/components/privacy-policy/Hero";
import { PrivacyNav } from "@/components/privacy-policy/PrivacyNav";

export default function PrivacyPolicy()
{
  return (
    <>
        <Hero />
        <PrivacyNav />
        <PrivacyPolicyPage />

    </>
  );
}