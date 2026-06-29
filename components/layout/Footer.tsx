import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-8 border-t border-[#2a2a2a]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className=" bg-brand flex items-center justify-center">
            <Image
              src="/images/logos/white-text-trans.png"
              className="-mt-5 md:mt-0 lg:mt-0 opacity-70 md:"
              alt="Do-am"
              width={50}
              height={50}
            />
          </div>
          <span className="font-syne font-bold text-base text-[#f5f5dc]/70 -mt-5 md:mt-0 lg:mt-0">
            Do&minus;am
          </span>
        </div>

        <span className="font-mono text-[11px] text-[#f5f5dc]/70">
          Do&minus;am | {new Date().getUTCFullYear()} &nbsp;
        </span>

        <span className="font-mono text-[11px] text-[#f5f5dc]/70">
          Built by{" "}
          <Link
            href=""
            className="text-white underline"
            // target="_blank"
          >
            Almattech
          </Link>
        </span>
      </div>
    </footer>
  );
}
