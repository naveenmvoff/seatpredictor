import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Logo and QR Code Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <Link href="/" className="flex items-center">
                <Image
                  className="h-16 w-auto"
                  src="/assets/images/Logo Assets.png"
                  alt="Logo"
                  width={120}
                  height={45}
                  priority
                />
              </Link>
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
          </div>

          <div className="lg:col-span-1">
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-2">Scan to download app</p>

              <Link href="/" className="flex items-center">
                <Image
                  // className="h-44 w-auto"
                  className="w-[135.91px] h-[136.24px]"
                  src="/assets/images/App-QR.png"
                  alt="Logo"
                  width={135.91}
                  height={136.24}
                  priority
                />
              </Link>
            </div>

            <div className="space-y-2">
              <Link href="/" className="flex items-center">
                <Image
                  className="w-[135.91px] h-[40px]"
                  src="/assets/images/App-Store.png"
                  alt="Logo"
                  width={135.91}
                  height={40}
                  priority
                />
              </Link>
              <Link href="/" className="flex items-center">
                <Image
                  className="w-[135.91px] h-[40px]"
                  src="/assets/images/Play-Store.png"
                  alt="Logo"
                  width={135.91}
                  height={40}
                  priority
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                className="w-[32px] h-[32px]"
                src="/assets/images/social/Instagram.png"
                alt="Logo"
                width={32}
                height={32}
                priority
              />
            </Link>
            <Link href="/" className="flex items-center">
              <Image
                className="w-[32px] h-[32px]"
                src="/assets/images/social/Youtube.png"
                alt="Logo"
                width={32}
                height={32}
                priority
              />
            </Link>
            <Link href="/" className="flex items-center">
              <Image
                className="w-[32px] h-[32px]"
                src="/assets/images/social/Telegram.png"
                alt="Logo"
                width={32}
                height={32}
                priority
              />
            </Link>
            <Link href="/" className="flex items-center">
              <Image
                className="w-[32px] h-[32px]"
                src="/assets/images/social/LinkedIn.png"
                alt="Logo"
                width={32}
                height={32}
                priority
              />
            </Link>
            <Link href="/" className="flex items-center">
              <Image
                className="w-[32px] h-[32px]"
                src="/assets/images/social/Facebook.png"
                alt="Logo"
                width={32}
                height={32}
                priority
              />
            </Link>
          </div>
          <p className="text-gray-500 text-sm">© 2025 Doctutorials Edutech</p>
        </div>
      </div>
    </footer>
  );
}
