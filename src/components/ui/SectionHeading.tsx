type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "center"
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "section-heading" : "section-heading section-heading--left"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-heading__title">{title}</h2>
      {copy && <p className="section-heading__copy">{copy}</p>}
    </div>
  );
}