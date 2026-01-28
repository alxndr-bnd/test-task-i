"use client";

type Props = {
  text: string;
  href: string;
};

export default function TopNav({ text, href }: Props) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <a
        href={href}
        style={{
          fontSize: "14px",
          textDecoration: "none",
          border: "1px solid #bbb",
          borderRadius: "999px",
          padding: "6px 12px",
          color: "inherit",
        }}
      >
        {text}
      </a>
    </div>
  );
}
