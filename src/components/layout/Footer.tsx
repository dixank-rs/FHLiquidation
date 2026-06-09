import AppContainer from "@/components/layout/AppContainer";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#181512]">
      <AppContainer>
        <div
          className="py-4 text-center text-sm font-semibold leading-[1.45] text-white"
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
