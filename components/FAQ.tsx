export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-b from-black via-[#0a0d2d] to-[#090c34]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-[#808080]">
            Everything you need to know about DigiCard
          </p>
        </div>

        {/* Questions */}
        <div>
            
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center p-8 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl border border-blue-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            Still have questions
          </h3>
          <p className="text-[#808080] mb-6">
            Our support team is here to help you get the most out of DigiCard.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
