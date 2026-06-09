import AppContainer from "@/components/layout/AppContainer";
import { footerFont } from "@/config/fonts";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#181512]">
      <AppContainer>
        <div
          className="py-4 text-center text-sm text-white"
          style={footerFont}
        >
          Copyright &copy; 2026 FH Liquidation Auction Tool All Rights Reserved.
          <br />
          Powered by{" "}
          <a className="text-[#d36838] no-underline" href="https://www.devdigital.com/" target="_blank" rel="noopener">
            Navam Tech
          </a>
        </div>
      </AppContainer>
    </footer>
  );
}
