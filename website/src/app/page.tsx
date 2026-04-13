import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section className="bg-gray-900 text-white py-24 px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Find Your Perfect Car</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto">
          Browse our handpicked inventory of quality pre-owned vehicles.
          Every car inspected and ready to drive.
        </p>
        <Link href="/inventory"
          className="inline-block rounded-xl bg-blue-600 px-8 py-3 text-lg font-semibold hover:bg-blue-700 transition-colors">
          Browse Inventory
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why choose us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Fully inspected', desc: 'Every vehicle goes through our recon process before listing.' },
            { title: 'No pressure', desc: 'Browse at your own pace. Submit an inquiry online anytime.' },
            { title: 'Fair pricing', desc: 'Transparent pricing — no hidden fees, no surprises.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 text-center">
        <p className="text-gray-600 mb-4">Ready to find your next vehicle?</p>
        <Link href="/inventory"
          className="inline-block rounded-xl border border-gray-900 px-6 py-2.5 text-sm font-medium hover:bg-gray-900 hover:text-white transition-colors">
          View all vehicles
        </Link>
      </section>
    </main>
  );
}
