"use client";

export function AdditionalResources() {
  return (
    <section className="w-full bg-black pb-16 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-3 p-4 bg-theme-devil-green/15 border border-theme-kelly-green rounded-xl">
          <h2 className="text-xl font-bold text-white">Additional Resources</h2>

          <div className="text-gray-300 space-y-1 text-sm">
            <p>For more information about cookies and online privacy, visit:</p>

            <ul className="list-disc list-inside ml-4 space-y-1">
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
    </section>
  );
}