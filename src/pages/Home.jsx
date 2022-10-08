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
              modules={[Autoplay, Pagination]}
              slidesPerView={1}
              pagination={{
                clickable: true
              }}
              loop={true}
              autoplay={{
                delay: 6000,
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
            <div className="relative w-full aspect-[5/4] sm:aspect-[2/1] max-h-[540px] overflow-hidden animated-bg"></div>
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
              url="https://432351-1355221-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2016/03/205.jpg"
              number={12}
            />
            <PropertyType 
              name="House"
              url="https://432351-1355221-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2016/03/026.jpg"
              number={12}
            />
            <PropertyType 
              name="Villa"
              url="https://432351-1355221-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2016/03/020.jpg"
              number={4}
            />
            <PropertyType 
              name="Rural"
              url="https://432351-1355221-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2016/02/056.jpg"
              number={4}
            />

          </div>
        </div>
      </section>
    </div>
  )
}
export default Home