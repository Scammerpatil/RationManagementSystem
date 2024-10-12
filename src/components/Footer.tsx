import Link from "next/link";

const districts = [
  "Mumbai",
  "Pune",
  "Nagpur",
  "Aurangabad",
  "Nashik",
  "Kolhapur",
  "Amravati",
  "Solapur",
  "Jalgaon",
  "Jalna",
  "Ratnagiri",
  "Sindhudurg",
  "Thane",
  "Wardha",
  "Yavatmal",
  "Bhandara",
  "Chandrapur",
  "Gadchiroli",
  "Hingoli",
  "Washim",
  "Akola",
  "Buldhana",
  "Gondia",
  "Dhulia",
  "Osmanabad",
  "Parbhani",
  "Latur",
  "Satara",
  "Sangli",
  "Raigad",
];

function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-6">
      <div className="container mx-auto px-4 flex justify-between items-start">
        {/* Left Side: Districts */}
        <div className="w-1/2">
          <h3 className="text-lg font-bold mb-4">Districts of Maharashtra</h3>
          <hr className="mb-4 border-gray-300" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {districts.map((district) => (
              <Link
                key={district}
                href={`/district?city=${district}`}
                className="block text-white p-1 rounded-lg hover:bg-gray-100 hover:text-black transition duration-300 text-center"
              >
                {district}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: QR Scanner, Contact Information */}
        <div className="w-1/2 space-y-4 mt-12 m-2">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg pb-8">
            <h4 className="text-lg font-bold mb-2">QR Scanner</h4>
            <p className="text-sm text-gray-300">
              Scan the QR code below for more information.
            </p>
            {/* Placeholder QR code */}
            <div className="flex justify-center mt-5 bg-white">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png"
                alt="QR Code"
                className="w-24 h-24"
              />
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
            <h4 className="text-lg font-bold mb-2">Help Line</h4>
            <p className="text-sm">
              General Help:{" "}
              <a href="tel:+912345678900" className="text-blue-400">
                +91-2345-678-900
              </a>
            </p>
            <p className="text-sm">
              Technical Support:{" "}
              <a href="tel:+912345678901" className="text-blue-400">
                +91-2345-678-901
              </a>
            </p>
            <p className="text-sm">
              Email:{" "}
              <a
                href="mailto:support@maharashtra.gov.in"
                className="text-blue-400"
              >
                support@maharashtra.gov.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
