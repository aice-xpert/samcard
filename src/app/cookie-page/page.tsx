import AdditionalResources from "@/components/cookie-page/AdditionalResources";
import CookieContact from "@/components/cookie-page/CookieContact";
import CookieManagement from "@/components/cookie-page/CookieManagement";
import CookieUsage from "@/components/cookie-page/CookieUsage";
import OtherTracking from "@/components/cookie-page/OtherTracking";
import ThirdPartyCookies from "@/components/cookie-page/ThirdPartyCookie";

export default function CookiePage() {
  return (
    <div className="bg-black pb-20">
      <CookieUsage />
      <ThirdPartyCookies />
      <CookieManagement />
      <OtherTracking />
      <CookieContact />
      <AdditionalResources />
    </div>
  );
}