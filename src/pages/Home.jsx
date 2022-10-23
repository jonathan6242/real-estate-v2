import React, { useEffect, useRef, useState } from "react"
import ListingThumbnail from "../components/ListingThumbnail"
import ListingThumbnailSkeleton from "../components/ListingThumbnailSkeleton"
import { collection, getDocs, limit, onSnapshot, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { Link } from "react-router-dom"
import PropertyType from "../components/PropertyType"
import { Autoplay, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react";
import ListingSlide from "../components/ListingSlide"
import Aos from "aos"
import 'aos/dist/aos.css';

function Home() {
  const [listings, setListings] = useState(null);
  const [featuredListings, setFeaturedListings] = useState(null);
  

  useEffect(() => {
    async function getListings() {
      const data = await getDocs(
        query(
          collection(db, "listings"),
          limit(6)
        )
      );
      setListings(data.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    async function getFeaturedListings() {
      const data = await getDocs(
        query(
          collection(db, "listings"),
          where("featured", "==", true)
        )
      );
      setFeaturedListings(data.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    Aos.init()
    getListings();
    getFeaturedListings();
  }, [])



  return (
    <div className="home">
      {/* Swiper */}
      <div className="header">
        {
          featuredListings ? (
            <Swiper
              data-aos="fade-in"
              data-aos-delay="500"
              data-aos-duration="1000"
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              pagination={{
                clickable: true
              }}
              loop={true}
              autoplay={{
                delay: 10000,
                disableOnInteraction: true,
              }}
            >
              {
                featuredListings?.map((listing) => (
                  <SwiperSlide key={listing.id}>
                    <ListingSlide listing={listing} />
                  </SwiperSlide>
                ))
              }
            </Swiper>
          ) : (
            <div className="relative w-full aspect-square sm:aspect-[7/4] max-h-[540px] overflow-hidden animated-bg"></div>
          )
        }
      </div>


      {/* Best Deals */}
      <section id="deals" className="bg-background">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 py-16">
          <div className="flex flex-col space-y-3 text-center text-black mb-12 font-light">
            <div className="text-2xl md:text-4xl leading-tight">
              Discover Our Best Deals
            </div>
            <div className="text-secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit donec sollicitudin
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {
              listings ? (
                listings
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map(listing => (
                    <ListingThumbnail
                      listing={listing}
                      key={listing.id}
                    />
                  ))
              ) : (
                new Array(6).fill(0).map((_, index) => (
                  <ListingThumbnailSkeleton key={index} />
                ))
              )
            }
          </div>
        </div>
      </section>
      <section id="explore" className="bg-background">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 py-16">
          <div className="flex flex-col space-y-3 text-center text-black mb-12 font-light">
            <div className="text-2xl md:text-4xl leading-tight">
              Explore Our Properties
            </div>
            <div className="text-secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit donec sollicitudin
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <PropertyType 
              name="Apartment"
              url="https://i2.au.reastatic.net/800x600-format=webp/f00366bedd8c71753880189ca27b390c8a45aa46902d9024e8ee2f2f3f8c94fe/image.jpg"
              number={12}
            />
            <PropertyType 
              name="House"
              url="https://i2.au.reastatic.net/800x600-format=webp/500a35aa94920e4b02c0cb8864b925a50c53576ae12d788aac2a206aa14e1559/image.jpg"
              number={12}
            />
            <PropertyType 
              name="Villa"
              url="https://i2.au.reastatic.net/800x600-format=webp/278a85ee3daaa136846c9ecf361dd40b148e66f19787a9d0d630d2b8f1b5a888/image.jpg"
              number={4}
            />
            <PropertyType 
              name="Rural"
              url="https://i2.au.reastatic.net/800x600-format=webp/492ac42ed08f6aa940593b69f3f38b313adf7f8c328c904e72f96c06ab00abb0/image.jpg"
              number={4}
            />

          </div>
        </div>
      </section>
    </div>
  )
}
export default Home