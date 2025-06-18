import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-10 p-6 border-t border-border text-center text-sm text-muted-foreground shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
      <div className="flex justify-center gap-6 mb-2">
  <a
  href="https://github.com/sathvikchandanala"
  target="_blank"
  rel="noopener noreferrer"
  className="transition-transform transform hover:scale-110 text-black dark:text-white"
>
  <FaGithub
    size={24}
    className="transition-all hover:drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] dark:hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
  />
</a>


        <a
          href="https://www.linkedin.com/in/sathvik-chandanala-7b343628b/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform transform hover:scale-110 text-[#0A66C2]"
        >
          <FaLinkedin
            size={24}
            className="hover:drop-shadow-[0_0_10px_rgba(10,102,194,0.7)] transition-all"
          />
        </a>
        <a
          href="https://instagram.com/sathvik_chandanala"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform transform hover:scale-110 text-[#E1306C]"
        >
          <FaInstagram
            size={24}
            className="hover:drop-shadow-[0_0_10px_rgba(225,48,108,0.7)] transition-all"
          />
        </a>
      </div>
      © 2025 CodeFuse by Sathvik Chandanala
    </footer>
  );
}
