export default function AdditionalResources() {
  return (
    <div className="pt-12 max-w-4xl mx-auto space-y-6">
      <div className="space-y-6 p-6 bg-[#4FD1C5]/5 border border-[#4FD1C5]/20 rounded-xl">
        <h2 className="text-2xl font-bold text-white">Additional Resources</h2>

        <div className="text-gray-300 space-y-3">
          <p>For more information about cookies and online privacy, visit:</p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <a
                href="https://www.allaboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-kelly-green hover:underline"
              >
                All About Cookies
              </a>
            </li>
            <li>
              <a
                href="https://www.youronlinechoices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-kelly-green hover:underline"
              >
                Your Online Choices
              </a>
            </li>
            <li>
              <a
                href="https://ico.org.uk/for-the-public/online/cookies/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-theme-kelly-green hover:underline"
              >
                ICO - Cookies
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}