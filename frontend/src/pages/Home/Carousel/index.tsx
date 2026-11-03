import { ProductCard } from "@/components/products/ProductCard"
import { ActionButton } from "@/components/ui/ActionButton"
import { Product } from "@/types/Product"
import { getIconByName } from "@/utils/getIconByName"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Autoplay from "embla-carousel-autoplay"
import useEmblaCarousel from "embla-carousel-react"
import { FC, useCallback } from "react"
import styles from "./carousel.module.scss"

interface CarouselProps {
  items: Product[]
}

export const Carousel: FC<CarouselProps> = ({ items }) => {
  const [emblaRef, emblaAPi] = useEmblaCarousel(
    {
      loop: true,
      slidesToScroll: 4,
      breakpoints: {
        "(max-width: 1540px)": { slidesToScroll: 3 },
        "(max-width: 960px)": { slidesToScroll: 2 },
        "(max-width: 768px)": { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 8000 })],
  )

  const scrollPrev = useCallback(() => {
    if (emblaAPi) emblaAPi.scrollPrev()
  }, [emblaAPi])

  const scrollNext = useCallback(() => {
    if (emblaAPi) emblaAPi.scrollNext()
  }, [emblaAPi])

  return (
    <section className={styles.carousel}>
      <div className={`embla ${styles.embla}`} ref={emblaRef}>
        <div className={`embla__container ${styles.emblaContainer}`}>
          {items.map((item: Product) => (
            <div key={item.id} className={`embla__slide ${styles.emblaSlide}`}>
              <div className={styles.slideItem}>
                <ProductCard product={item} />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.buttonsContainer}>
          <ActionButton className={"carouselButton"} action={scrollPrev}>
            <FontAwesomeIcon icon={getIconByName("faChevronLeft")} size='sm' />
          </ActionButton>
          <ActionButton className={"carouselButton"} action={scrollNext}>
            <FontAwesomeIcon icon={getIconByName("faChevronRight")} size='sm' />
          </ActionButton>
        </div>
      </div>
    </section>
  )
}
