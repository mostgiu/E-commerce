export default function PaymentLogo({ method }) {
  if (method === "paypal") {
    return (
      <i
        aria-label="PayPal"
        className="fa-brands fa-paypal text-2xl text-[#003087]"
        role="img"
      />
    );
  }

  if (method === "mastercard") {
    return (
      <span
        aria-label="Mastercard"
        className="relative inline-flex h-7 w-10 items-center justify-center"
        role="img"
      >
        <span className="absolute left-1 h-5 w-5 rounded-full bg-[#eb001b]" />
        <span className="absolute right-1 h-5 w-5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
      </span>
    );
  }

  if (method === "klarna") {
    return (
      <span
        aria-label="Klarna"
        className="inline-flex h-7 items-center rounded bg-[#ffb3c7] px-2 text-xs font-black tracking-tight text-[#17120f]"
        role="img"
      >
        Klarna.
      </span>
    );
  }

  return null;
}
