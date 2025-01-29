import React from "react";

const Footer = () => {
  return (
    <div className=" bg-gray-900 text-white">
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex-1 flex justify-center">
          <img
            src="/footer.png"
            alt="Footer Logo"
            className="h-[24rem] w-auto object-cover"
          />
        </div>
        <div className="flex-1 border-l h-full border-gray-600 flex pl-8">
          <div className="space-y-4">
            <a href="#about" className="hover:text-gray-400">
              About{" "}
            </a>
            <a href="#services" className="hover:text-gray-400">
              {" "}
              Services{" "}
            </a>
            <a href="#contact" className="hover:text-gray-400">
              {" "}
              Contact{" "}
            </a>
          </div>
          <div className="space-y-4 mt-8">
            <a href="https://facebook.com" className="hover:text-gray-400">
              Facebook{" "}
            </a>
            <a href="https://twitter.com" className="hover:text-gray-400">
              {" "}
              Twitter{" "}
            </a>
            <a href="https://linkedin.com" className="hover:text-gray-400">
              {" "}
              LinkedIn{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
