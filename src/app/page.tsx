export default function Home() {
  return (
    <div className="pt-16 lg:pt-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Tishya Foods
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Premium natural foods, protein-rich products, and wholesome nutrition for a healthier lifestyle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">100% Natural</h3>
              <p className="text-gray-300">No artificial colors, dyes, or white sugars. Just pure, wholesome ingredients.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Protein Rich</h3>
              <p className="text-gray-300">High-quality protein sources to support your active lifestyle and fitness goals.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Sustainably Sourced</h3>
              <p className="text-gray-300">Ethically sourced ingredients from trusted farmers and suppliers worldwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
