export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and QR Code Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-slate-800 text-white px-2 py-1 rounded text-sm font-bold mr-2">DOC</div>
              <span className="text-gray-600 text-sm">TUTORIALS</span>
            </div>
          </div>

          {/* Our Courses */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-600 font-medium mb-4">Our Courses</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>MBBS Curriculum</li>
              <li>NEET PG</li>
              <li>FMGE</li>
              <li>PG Residency</li>
              <li>NEET SS</li>
              <li>Fellowship</li>
            </ul>
          </div>

          {/* Offline Centers */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-600 font-medium mb-4">Offline Centers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Hyderabad</li>
              <li>Calicut</li>
              <li>Trivandrum</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-600 font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>About Us</li>
              <li>Terms</li>
              <li>Privacy</li>
              <li>Blogs</li>
            </ul>
          </div>

          {/* Contact Us and App Download */}
          <div className="lg:col-span-1">
            <h3 className="text-gray-600 font-medium mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p>help@doctutorials</p>
              <p>+91 7097434567 / +91 7097634567 (10 am - 7 pm)</p>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-2">Scan to download app</p>
              <div className="w-16 h-16 bg-black rounded">
                {/* QR Code placeholder */}
                <div className="w-full h-full bg-black rounded flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-white rounded-sm"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-black text-white px-3 py-1 rounded text-xs flex items-center">
                <span className="mr-2">📱</span>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </div>
              <div className="bg-black text-white px-3 py-1 rounded text-xs flex items-center">
                <span className="mr-2">▶️</span>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">📷</span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">📺</span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">✈️</span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">💼</span>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">👥</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">© 2025 Doctutorials Edutech</p>
        </div>
      </div>
    </footer>
  )
}
