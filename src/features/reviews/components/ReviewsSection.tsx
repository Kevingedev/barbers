import { getMessages } from "@/messages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Parallax } from "@/components/animations/Parallax";
import { Reveal } from "@/components/animations/Reveal";
import { ReviewsCarousel } from "@/features/reviews/components/ReviewsCarousel";

export function ReviewsSection() {
  const t = getMessages();

  return (
    <section className="section section--reviews" id="resenas">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow={t.reviews.eyebrow}
            title={t.reviews.title}
            copy={t.reviews.copy}
          />
        </Reveal>

        {/* El rótulo va en parallax y las reseñas no: si las dos cosas se mueven
            a la vez, el ojo no sabe qué seguir al hacer scroll. */}
        <Parallax speed={0.16}>
          <Reveal>
            <ReviewsCarousel />
          </Reveal>
        </Parallax>
      </div>
    </section>
  );
}