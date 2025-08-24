import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import medina from "../../assets/images/Sousse/s1.jpg";
import beach from "../../assets/images/Sousse/s2.jpg";
import port from "../../assets/images/Sousse/s4.jpg";
import mall from "../../assets/images/Sousse/s6.jpg";
import souk from "../../assets/images/Sousse/s3.jpg";
import park from "../../assets/images/Sousse/s5.jpg";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const ImageCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );


  const images = [beach, park, medina, port, souk, mall];

  return (
    <Carousel
      className="w-full mt-2"
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="w-full">
        {images.map((imgSrc, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center h-[250px]">
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={imgSrc}
                    alt={`Carousel image ${index + 1}`}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ImageCarousel;